// Node built-ins only. No backend writes, payment calls or external dependencies.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const id = "e0da78ba-de9d-4fd9-a0a2-0453dbc74be5";
const otherId = "cc88b2fb-3056-4254-b47f-d764b7fdb0ae";
function memory() {
  const data = new Map();
  return { getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,v), removeItem: k => data.delete(k) };
}
function setup() {
  const window = { sessionStorage: memory(), localStorage: memory() };
  const context = vm.createContext({ window, URLSearchParams, setTimeout, clearTimeout, URL, AbortController });
  for (const file of ["cart-storage.js", "orders.js", "order-return.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "../js", file), "utf8"), context);
  }
  return { window, context, orders: vm.runInContext("LumenOrders", context),
    cart: vm.runInContext("LumenCartStorage", context), returns: vm.runInContext("LumenOrderReturn", context) };
}
function order(status = "PENDING_PAYMENT", public_id = id) {
  return { public_id, status, subtotal: 60000, total: 60000,
    delivery: { method: "PICKUP", shipping_cost: null },
    items: [{ product_name: "Agenda", variant_name: "A5", quantity: 2, unit_price: 30000, subtotal: 60000 }] };
}
const line = { productoId: "agenda", tamano: "A5", sku: "AGENDA-A5", variant_id: 7, cantidad: 2, disenoId: "floral" };
function harness(getOrder, env = setup()) {
  const states = [], queue = [];
  const controller = env.returns.createController({ id, getOrder, render: state => states.push(state),
    setTimer: (fn, ms) => { assert.equal(ms, 5000); queue.push(fn); return fn; },
    clearTimer: fn => { const index = queue.indexOf(fn); if (index >= 0) queue.splice(index,1); } });
  return { ...env, states, queue, controller };
}
test("reference prefers external_reference, validates UUID, uses session fallback and ignores payment claims", () => {
  const { returns } = setup();
  assert.equal(returns.resolveReference(`?external_reference=${id}&status=approved&payment_id=99`, otherId).id, id);
  assert.equal(returns.resolveReference("?external_reference=bad&collection_status=approved", otherId).id, otherId);
  assert.equal(returns.resolveReference("?status=approved", id).id, id);
  assert.equal(returns.resolveReference(`?external_reference=${id}&external_reference=${otherId}`, null).id, null);
  assert.equal(returns.resolveReference("?external_reference=../orders", null).id, null);
});
test("pending then paid stops polling; payment claims in URL cannot override backend", async () => {
  let calls = 0;
  const h = harness(async () => order(++calls === 1 ? "PENDING_PAYMENT" : "PAID"));
  await h.controller.start();
  assert.equal(h.states.at(-1).order.status, "PENDING_PAYMENT");
  assert.equal(h.queue.length, 1);
  await h.queue.shift()();
  assert.equal(h.states.at(-1).order.status, "PAID");
  assert.equal(h.queue.length, 0);
});
test("at most six automatic checks; manual refresh performs one additional GET without restarting polling", async () => {
  let calls = 0;
  const h = harness(async () => { calls++; return order(); });
  await h.controller.start();
  while (h.queue.length) await h.queue.shift()();
  assert.equal(calls, 6);
  assert.equal(h.states.at(-1).willPoll, false);
  await h.controller.refresh();
  assert.equal(calls, 7);
  assert.equal(h.queue.length, 0);
});
test("cancelled, malformed and mismatched responses never confirm payment", async () => {
  const cancelled = harness(async () => order("CANCELLED"));
  await cancelled.controller.start();
  assert.equal(cancelled.states.at(-1).order.status, "CANCELLED");
  assert.equal(cancelled.queue.length, 0);
  for (const response of [order("PAID", otherId), { ...order("PAID"), total: "60000" }, order("approved")]) {
    const h = harness(async () => response);
    await h.controller.start();
    assert.equal(h.states.at(-1).kind, "error");
    assert.equal(h.queue.length, 0);
  }
});
test("network/404 failures preserve cart; manual recovery is possible", async () => {
  for (const status of [undefined, 404]) {
    let fail = true;
    const h = harness(async () => { if (fail) throw Object.assign(new Error("offline"), {status}); return order(); });
    h.cart.save([line]);
    await h.controller.start();
    assert.equal(h.states.at(-1).kind, "error");
    assert.equal(h.cart.load().items.length, 1);
    assert.equal(h.queue.length, 0);
    fail = false;
    await h.controller.refresh();
    assert.equal(h.states.at(-1).order.status, "PENDING_PAYMENT");
  }
});
test("duplicate clicks and page exit do not create overlapping or continuing queries", async () => {
  let resolve, calls = 0;
  const h = harness(() => { calls++; return new Promise(r => { resolve = r; }); });
  const pending = h.controller.start();
  await h.controller.refresh();
  assert.equal(calls, 1);
  h.controller.stop();
  resolve(order("PAID"));
  await pending;
  assert.equal(h.states.at(-1).kind, "loading");
  assert.equal(h.queue.length, 0);
});
test("only verified PAID with unchanged associated cart clears; new purchases and missing associations are preserved", () => {
  const { cart, orders, window } = setup();
  cart.save([line]);
  orders.rememberCart(id, [{ ...line, precio: 1, email: "must-not-persist" }]);
  assert.doesNotMatch(window.sessionStorage.getItem(orders.cartReferenceKey(id)), /precio|email|must-not-persist/);
  for (const status of ["PENDING_PAYMENT", "CANCELLED", "PAYMENT_REVIEW"]) {
    orders.clearPaidCart(order(status));
    assert.equal(cart.load().items.length, 1);
  }
  cart.save([line, { ...line, cantidad: 3 }]);
  orders.clearPaidCart(order("PAID"));
  assert.equal(cart.load().items.length, 2);
  cart.save([line]);
  orders.clearPaidCart(order("PAID"));
  assert.equal(cart.load().items.length, 0);
  cart.save([line]);
  orders.clearPaidCart(order("PAID")); // Association consumed: don't clear future purchases.
  assert.equal(cart.load().items.length, 1);
});
test("storage errors preserve cart and association for later recovery", () => {
  const { cart, orders, window } = setup();
  cart.save([line]); orders.rememberCart(id, [line]);
  window.localStorage.setItem = () => { throw new Error("storage unavailable"); };
  assert.match(orders.clearPaidCart(order("PAID")), /no pudimos limpiar/);
  assert.equal(cart.load().items.length, 1);
  assert.ok(window.sessionStorage.getItem(orders.cartReferenceKey(id)));
});

test("pending to review stops polling and keeps associated cart; manual refresh still works", async () => {
  let calls = 0;
  const h = harness(async () => order(++calls === 1 ? "PENDING_PAYMENT" : "PAYMENT_REVIEW"));
  h.cart.save([line]); h.orders.rememberCart(id, [line]);
  await h.controller.start(); await h.queue.shift()();
  assert.equal(h.states.at(-1).order.status, "PAYMENT_REVIEW");
  assert.equal(h.states.at(-1).willPoll, false); assert.equal(h.queue.length, 0);
  assert.equal(h.cart.load().items.length, 1);
  await h.controller.refresh(); assert.equal(calls, 3); assert.equal(h.cart.load().items.length, 1);
});

test("paid then refunded review cannot erase a new cart", async () => {
  let calls = 0;
  const h = harness(async () => order(++calls === 1 ? "PAID" : "PAYMENT_REVIEW"));
  h.cart.save([line]); h.orders.rememberCart(id, [line]);
  await h.controller.start(); assert.equal(h.cart.load().items.length, 0);
  h.cart.save([{...line, cantidad: 3}]);
  await h.controller.refresh(); assert.equal(h.states.at(-1).order.status, "PAYMENT_REVIEW");
  assert.equal(h.cart.load().items[0].cantidad, 3); assert.equal(h.queue.length, 0);
});
test("API lookup is GET, no body, no cache and invalid references do not call fetch", async () => {
  const { context } = setup();
  let seen;
  context.fetch = async (url, options) => { seen = {url, options}; return { ok: true, status: 200, json: async () => order() }; };
  vm.runInContext('const LUMEN_CONFIG = { apiBaseUrl: "http://localhost:8080" };', context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../js/api.js"), "utf8"), context);
  await vm.runInContext(`LumenApi.getPublicOrder("${id}")`, context);
  assert.equal(seen.url, `http://localhost:8080/api/v1/public/orders/${id}`);
  assert.equal(seen.options.method, "GET");
  assert.equal(seen.options.cache, "no-store");
  assert.equal(seen.options.credentials, "omit");
  assert.equal(seen.options.body, undefined);
  seen = null;
  assert.throws(() => vm.runInContext('LumenApi.getPublicOrder("bad")', context));
  assert.equal(seen, null);
});
