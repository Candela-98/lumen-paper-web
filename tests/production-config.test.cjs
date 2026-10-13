// Respuestas simuladas: estas pruebas no crean pedidos, preferencias ni pagos.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const id = "e0da78ba-de9d-4fd9-a0a2-0453dbc74be5";
const source = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
function setup(url) {
  const context = vm.createContext({ window: { location: new URL(url) }, URL, AbortController, setTimeout, clearTimeout });
  vm.runInContext(source("js/config.js"), context);
  vm.runInContext(source("js/orders.js"), context);
  vm.runInContext(source("js/api.js"), context);
  return { context, config: vm.runInContext("LUMEN_CONFIG", context) };
}
for (const host of ["localhost", "127.0.0.1"]) {
  test("desarrollo conserva la API y el checkout local: " + host, async () => {
    const { context, config } = setup("http://" + host + ":3000");
    assert.equal(config.apiBaseUrl, "http://localhost:8080");
    assert.equal(config.mercadoPagoEnabled, true);
    let seen;
    context.fetch = async (url, options) => {
      seen = { url, options };
      return { ok: true, status: 200, json: async () => ({ preference_id: "test", checkout_url: "https://www.mercadopago.com.ar/checkout/test" }) };
    };
    await vm.runInContext('LumenApi.startOrderCheckout("' + id + '")', context);
    assert.equal(seen.url, "http://localhost:8080/api/v1/public/orders/" + id + "/checkout");
    assert.equal(seen.options.method, "POST");
    assert.equal(seen.options.body, undefined);
    assert.equal(seen.options.headers["Content-Type"], undefined);
  });
}
for (const host of ["www.lumenpaper.com.ar", "lumenpaper.com.ar"]) {
  test("producción conecta catálogo/pedidos y bloquea checkout: " + host, async () => {
    const { context, config } = setup("https://" + host);
    assert.equal(config.apiBaseUrl, "https://api.lumenpaper.com.ar");
    assert.equal(config.mercadoPagoEnabled, false);
    assert.equal(Object.isFrozen(config), true);
    const calls = [];
    context.fetch = async (url, options) => {
      calls.push({ url, options });
      return { ok: true, status: options.method === "POST" ? 201 : 200, json: async () => url.endsWith("products") ? [] : { public_id: id } };
    };
    await vm.runInContext("LumenApi.getPublicProducts()", context);
    await vm.runInContext("LumenApi.createOrder({ items: [] })", context);
    await vm.runInContext('LumenApi.getPublicOrder("' + id + '")', context);
    assert.deepEqual(calls.map(c => c.url), [
      "https://api.lumenpaper.com.ar/api/v1/public/products",
      "https://api.lumenpaper.com.ar/api/v1/public/orders",
      "https://api.lumenpaper.com.ar/api/v1/public/orders/" + id
    ]);
    assert.deepEqual(calls.map(c => c.options.method), ["GET", "POST", "GET"]);
    await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("' + id + '")', context), error => error.code === "PAYMENT_DISABLED");
    assert.equal(calls.length, 3, "checkout deshabilitado nunca llama a fetch");
  });
}
for (const url of ["file:///C:/index.html", "https://preview.amplifyapp.com", "https://www.lumenpaper.com.ar.ejemplo.com"]) {
  test("origen desconocido queda deshabilitado: " + url, async () => {
    const { context, config } = setup(url);
    assert.equal(config.apiBaseUrl, null);
    assert.equal(config.mercadoPagoEnabled, false);
    context.fetch = () => { throw new Error("No debe llamar a fetch"); };
    await assert.rejects(vm.runInContext("LumenApi.getPublicProducts()", context), /no está configurada/);
    await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("' + id + '")', context), error => error.code === "PAYMENT_DISABLED");
  });
}
function paymentUi(url, status = "PENDING_PAYMENT") {
  const { context } = setup(url);
  const button = { disabled: false, textContent: "", setAttribute() {} };
  const message = { textContent: "" };
  const recoverButton = { disabled: false, hidden: false, setAttribute() {} };
  let calls = 0, navigations = 0;
  context.document = { querySelector: selector => selector === "#payOrderButton" ? button : selector === "#recoverCheckoutButton" ? recoverButton : message };
  context.window.location.assign = () => { navigations++; };
  context.setOrderBusy = () => {};
  context.fetch = async url => {
    calls++;
    return { ok: true, status: 200, json: async () => url.endsWith("/checkout")
      ? { preference_id: "test", checkout_url: "https://www.mercadopago.com.ar/checkout/test" }
      : { public_id: id, status, subtotal: 100, total: 100, delivery: {method: "PICKUP", shipping_cost: 0},
          items: [{product_name: "Agenda", variant_name: "A5", unit_price: 100, quantity: 1, subtotal: 100}] } };
  };
  context.orderFixture = { public_id: id, status };
  vm.runInContext('let createdOrder = orderFixture; let orderReference = orderFixture.public_id; let orderSubmitting = false, orderRestoring = false, paymentStarting = false, paymentUncertain = false;', context);
  // Ejecuta las funciones reales de pago con DOM y navegación simulados.
  const main = source("js/main.js");
  const start = main.indexOf("function canPayOrder() {");
  const end = main.indexOf("function showOrderSummary(", start);
  assert.ok(start >= 0 && end > start);
  vm.runInContext(main.slice(start, end), context);
  return { context, button, effects: () => ({ calls, navigations }) };
}
for (const host of ["www.lumenpaper.com.ar", "lumenpaper.com.ar"]) {
  test("botón y handler bloquean pago en producción: " + host, async () => {
    const ui = paymentUi("https://" + host);
    vm.runInContext("updatePaymentButton()", ui.context);
    assert.equal(ui.button.disabled, true);
    assert.equal(ui.button.textContent, "Mercado Pago no habilitado");
    assert.equal(vm.runInContext("canPayOrder()", ui.context), false);
    // Incluso invocar el handler directamente debe bloquear la solicitud y la navegación.
    await vm.runInContext("startPayment()", ui.context);
    assert.deepEqual(ui.effects(), { calls: 0, navigations: 0 });
  });
}
test("botón y handler conservan checkout local para pedidos pendientes", async () => {
  const ui = paymentUi("http://localhost:3000");
  vm.runInContext("updatePaymentButton()", ui.context);
  assert.equal(ui.button.disabled, false);
  assert.equal(ui.button.textContent, "Pagar con Mercado Pago");
  await vm.runInContext("startPayment()", ui.context);
  assert.deepEqual(ui.effects(), { calls: 2, navigations: 1 });
});
for (const status of ["PAID", "CANCELLED", "PAYMENT_REVIEW"]) {
  test("checkout local sigue bloqueado para " + status, async () => {
    const ui = paymentUi("http://localhost:3000", status);
    vm.runInContext("updatePaymentButton()", ui.context);
    assert.equal(ui.button.disabled, true);
    await vm.runInContext("startPayment()", ui.context);
    assert.deepEqual(ui.effects(), { calls: 0, navigations: 0 });
  });
}
