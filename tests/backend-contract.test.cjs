// Built-in Node tools only. fetch, DOM, storage and navigation are simulated.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const id = 'e0da78ba-de9d-4fd9-a0a2-0453dbc74be5';
const other = 'cc88b2fb-3056-4254-b47f-d764b7fdb0ae';
const link = {preference_id: 'existing-pref', checkout_url: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=existing-pref'};
const line = {productoId: 'agenda', tamano: 'A5', sku: 'AGENDA-A5', variant_id: 1, cantidad: 1, disenoId: 'floral'};
function summary(status = 'PENDING_PAYMENT', public_id = id) {
  return {public_id, status, subtotal: 100, total: 100, delivery: {method: 'CORREO_ARGENTINO', shipping_cost: null},
    items: [{product_name: 'Agenda', variant_name: 'A5', quantity: 1, unit_price: 100, subtotal: 100}]};
}
function memory() {const data = new Map(); return {getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,String(v)), removeItem: k => data.delete(k)};}
const ok = value => ({ok: true, status: 200, json: async () => value});
const failure = (code, status = 409) => ({ok: false, status, json: async () => ({code})});
function setup(url = 'http://localhost:3000') {
  const window = {location: new URL(url), sessionStorage: memory(), localStorage: memory(), addEventListener() {}};
  const context = vm.createContext({window, URL, URLSearchParams, AbortController, setTimeout, clearTimeout});
  for (const name of ['config', 'cart-storage', 'orders', 'api']) vm.runInContext(source(`js/${name}.js`), context);
  return {context, window, api: vm.runInContext('LumenApi', context), orders: vm.runInContext('LumenOrders', context), cart: vm.runInContext('LumenCartStorage', context)};
}
function ui(url) {
  const e = setup(url);
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {textContent: '', innerHTML: '', hidden: false, disabled: false,
      setAttribute() {}, replaceChildren() {}, append() {}, classList: {add() {}, remove() {}}});
    return elements.get(selector);
  };
  e.context.document = {querySelector: element};
  e.context.checkoutForm = element('#checkoutForm');
  e.context.clearCartButton = element('#clearCartButton');
  e.context.renderCart = () => {};
  e.context.reconcileCart = () => {};
  e.context.hideCheckoutForm = () => {};
  e.context.buildWhatsappUrl = text => `https://wa.me/test?text=${encodeURIComponent(text)}`;
  e.context.escapeAttribute = value => String(value);
  e.context.formatPrice = value => `$${value}`;
  e.context.fixture = summary();
  e.context.fixtureLine = line;
  vm.runInContext('let cart=[fixtureLine], cartStorageMessage="", createdOrder=fixture, orderReference=fixture.public_id, orderSubmitting=false, orderRestoring=false, orderUncertain=false, paymentStarting=false, paymentUncertain=false;', e.context);
  const main = source('js/main.js');
  vm.runInContext(main.slice(main.indexOf('function setOrderBusy('), main.indexOf('function setupCheckout() {')), e.context);
  const calls = [], navigations = [];
  e.window.location.assign = value => navigations.push(value);
  e.context.fetch = async (url, options) => {calls.push({url, options}); return ok(url.endsWith('/checkout') ? link : summary());};
  e.cart.save([line]); e.orders.rememberCart(id, [line]); e.orders.saveReference(id);
  return {...e, element, calls, navigations, run: code => vm.runInContext(code, e.context)};
}

test('PAYMENT_REVIEW validates and cannot clear an associated cart', () => {
  const e = setup(); e.cart.save([line]); e.orders.rememberCart(id, [line]);
  assert.equal(e.orders.validateSummary(summary('PAYMENT_REVIEW'), id).status, 'PAYMENT_REVIEW');
  assert.equal(e.orders.clearPaidCart(summary('PAYMENT_REVIEW')), '');
  assert.equal(e.cart.load().items.length, 1);
});

test('GET recovers while POST stays blocked and sends no body or credentials', async () => {
  const e = setup(); e.orders.setCheckoutBlocked(id, true);
  const calls = [];
  e.context.fetch = async (url, options) => {calls.push({url, options}); return ok(link);};
  assert.equal((await e.api.recoverOrderCheckout(id)).preference_id, link.preference_id);
  assert.equal(calls[0].options.method, 'GET');
  assert.equal(calls[0].options.body, undefined);
  assert.equal(calls[0].options.headers['Content-Type'], undefined);
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.cache, 'no-store');
  await assert.rejects(e.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
  assert.equal(calls.length, 1);
});

for (const code of ['CHECKOUT_UNCERTAIN', 'CHECKOUT_REVIEW_REQUIRED', 'CHECKOUT_EXPIRED', 'ORDER_NOT_PENDING_PAYMENT', 'UNKNOWN_CONFLICT']) {
  test(`409 ${code} keeps POST blocked, including after reload`, async () => {
    const e = setup(); e.context.fetch = async () => failure(code);
    await assert.rejects(e.api.recoverOrderCheckout(id), error => error.code === code);
    assert.equal(e.orders.isCheckoutBlocked(id), true);
    await assert.rejects(e.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
    const reloaded = setup(); reloaded.window.sessionStorage = e.window.sessionStorage;
    reloaded.context.fetch = () => {throw Error('must not fetch');};
    await assert.rejects(reloaded.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
  });
}

test('only GET 409 CHECKOUT_NOT_STARTED authorizes a manual first POST', async () => {
  const e = setup(); let calls = 0;
  e.context.fetch = async () => {calls++; return failure('CHECKOUT_NOT_STARTED');};
  await assert.rejects(e.api.startOrderCheckout(id));
  assert.equal(e.api.isCheckoutBlocked(id), true);
  await assert.rejects(e.api.recoverOrderCheckout(id));
  assert.equal(e.api.isCheckoutBlocked(id), false);
  assert.equal(calls, 2, 'GET never starts a POST automatically');
  e.context.fetch = async () => {calls++; return ok(link);};
  await e.api.startOrderCheckout(id);
  assert.equal(calls, 3);
});

for (const problem of ['network', 'timeout', '500', 'malformed', 'status', 'null']) {
  test(`uncertain recovery ${problem} never falls back to POST`, async () => {
    const e = setup(); let calls = 0;
    e.context.fetch = async () => {
      calls++;
      if (problem === 'network') throw Error('offline');
      if (problem === 'timeout') throw Object.assign(Error('abort'), {name: 'AbortError'});
      if (problem === '500') return failure('SERVICE_UNAVAILABLE', 500);
      if (problem === 'malformed') return {ok: true, status: 200, json: async () => {throw SyntaxError('invalid JSON');}};
      if (problem === 'status') return {ok: true, status: 201, json: async () => link};
      return ok(null);
    };
    await assert.rejects(e.api.recoverOrderCheckout(id), error => error.uncertain === true);
    await assert.rejects(e.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
    assert.equal(calls, 1);
  });
}

for (const url of ['https://evil.example/checkout/a', 'http://www.mercadopago.com.ar/checkout/a',
  'https://www.mercadopago.com.ar.evil.example/checkout/a', 'https://www.mercadopago.com.ar:444/checkout/a',
  'https://u:p@www.mercadopago.com.ar/checkout/a', 'https://www.mercadopago.com.ar/not-checkout',
  'https://www.mercadopago.com.ar/checkout/a#fragment']) {
  test(`recovered URL rejected: ${url}`, async () => {
    const h = ui(); h.context.fetch = async () => ok({...link, checkout_url: url});
    await h.run('recoverCheckout()');
    assert.equal(h.navigations.length, 0);
    assert.equal(h.api.isCheckoutBlocked(id), true);
    assert.equal(h.cart.load().items.length, 1);
  });
}

test('concurrent GETs and POST cannot overlap for the same UUID', async () => {
  const e = setup(); let resolve, calls = 0;
  e.context.fetch = () => {calls++; return new Promise(r => resolve = r);};
  const first = e.api.recoverOrderCheckout(id);
  await assert.rejects(e.api.recoverOrderCheckout(id.toUpperCase()), error => error.code === 'CHECKOUT_BUSY');
  await assert.rejects(e.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
  resolve(ok(link)); await first;
  assert.equal(calls, 1);
});

test('recovery works after a failed POST with unavailable storage', async () => {
  const e = setup(); e.window.sessionStorage.setItem = () => {throw Error('blocked');};
  e.context.fetch = async () => {throw Error('offline');};
  await assert.rejects(e.api.startOrderCheckout(id));
  await assert.rejects(e.api.startOrderCheckout(id), error => error.code === 'CHECKOUT_ALREADY_STARTED');
  e.context.fetch = async () => ok(link);
  assert.equal((await e.api.recoverOrderCheckout(id)).preference_id, link.preference_id);
  assert.equal(e.api.isCheckoutBlocked(id), true);
});

for (const host of ['www.lumenpaper.com.ar', 'lumenpaper.com.ar']) {
  test(`production blocks recovery API and UI: ${host}`, async () => {
    const h = ui(`https://${host}`);
    await assert.rejects(h.api.recoverOrderCheckout(id), error => error.code === 'PAYMENT_DISABLED');
    h.run('updatePaymentButton()'); await h.run('recoverCheckout()');
    assert.equal(h.calls.length, 0); assert.equal(h.navigations.length, 0);
    assert.equal(h.element('#recoverCheckoutButton').hidden, true);
  });
}

test('successful UI recovery only uses GET and rechecks pending state before navigation', async () => {
  const h = ui(); h.orders.setCheckoutBlocked(id, true);
  await h.run('recoverCheckout()');
  assert.deepEqual(h.calls.map(c => c.options.method), ['GET', 'GET']);
  assert.equal(h.calls[0].url.endsWith('/checkout'), true);
  assert.deepEqual(h.navigations, [link.checkout_url]);
  assert.equal(h.cart.load().items.length, 1);
});

for (const status of ['PAYMENT_REVIEW', 'CANCELLED', 'PAID']) {
  test(`state changed to ${status} after preference prevents navigation`, async () => {
    const h = ui();
    h.context.fetch = async (url, options) => {h.calls.push({url, options}); return ok(url.endsWith('/checkout') ? link : summary(status));};
    await h.run('recoverCheckout()');
    assert.equal(h.navigations.length, 0);
    assert.equal(h.run('canPayOrder()'), false);
    assert.equal(h.run('canRecoverCheckout()'), false);
    if (status === 'PAYMENT_REVIEW') {
      assert.equal(h.cart.load().items.length, 1);
      assert.match(h.element('#paymentMessage').textContent, /revisión/);
      assert.equal(h.element('#newOrderButton').hidden, true);
    }
  });
}

for (const code of ['CHECKOUT_EXPIRED', 'CHECKOUT_REVIEW_REQUIRED', 'CHECKOUT_UNCERTAIN']) {
  test(`home explains ${code} without redirect or automatic creation`, async () => {
    const h = ui(); h.context.fetch = async (url, options) => {h.calls.push({url, options}); return failure(code);};
    await h.run('recoverCheckout()');
    assert.equal(h.navigations.length, 0);
    assert.equal(h.calls.length, 1); assert.equal(h.calls[0].options.method, 'GET');
    assert.equal(h.run('canPayOrder()'), false);
    assert.equal(h.cart.load().items.length, 1);
    assert.match(h.element('#paymentMessage').textContent, code === 'CHECKOUT_EXPIRED' ? /venció/ : /revisión|confirmar/);
  });
}

test('GET NOT_STARTED enables manual payment without navigating or creating automatically', async () => {
  const h = ui(); h.orders.setCheckoutBlocked(id, true);
  h.context.fetch = async (url, options) => {h.calls.push({url, options}); return url.endsWith('/checkout') ? failure('CHECKOUT_NOT_STARTED') : ok(summary());};
  await h.run('recoverCheckout()');
  assert.equal(h.run('canPayOrder()'), true);
  assert.deepEqual(h.calls.map(c => c.options.method), ['GET', 'GET']);
  assert.equal(h.navigations.length, 0);
});

test('duplicate recovery clicks cause one request and one navigation', async () => {
  const h = ui(); let resolve;
  h.context.fetch = (url, options) => {h.calls.push({url, options}); return url.endsWith('/checkout') ? new Promise(r => resolve = r) : Promise.resolve(ok(summary()));};
  const first = h.run('recoverCheckout()'); await h.run('recoverCheckout()'); await h.run('startPayment()');
  assert.equal(h.calls.length, 1);
  resolve(ok(link)); await first;
  assert.equal(h.calls.length, 2); assert.equal(h.navigations.length, 1);
});

test('cancelled navigation ignores a late checkout response', async () => {
  const h = ui(); let resolve;
  h.context.fetch = () => new Promise(r => resolve = r);
  const first = h.run('recoverCheckout()');
  h.run('performCheckout.sequence++'); // Same invalidation performed by pagehide.
  resolve(ok(link)); await first;
  assert.equal(h.navigations.length, 0); assert.equal(h.api.isCheckoutBlocked(id), true);
});

test('home accepts a shared reference without storage and preserves review cart', async () => {
  const h = ui(`http://localhost:3000/?external_reference=${other}#carrito`);
  h.window.sessionStorage.getItem = () => {throw Error('blocked');};
  h.window.sessionStorage.setItem = () => {throw Error('blocked');};
  h.context.fetch = async (url, options) => {h.calls.push({url, options}); return ok(summary('PAYMENT_REVIEW', other));};
  await h.run('restoreOrderReference()');
  assert.equal(h.calls[0].url.endsWith(other), true);
  assert.equal(h.run('createdOrder.status'), 'PAYMENT_REVIEW');
  assert.match(h.element('#orderResultMessage').textContent, /Pago en revisión/);
  assert.match(h.element('#orderResultDetails').innerHTML, /pago por separado/);
  assert.equal(h.element('#payOrderButton').hidden, true);
  assert.equal(h.element('#recoverCheckoutButton').hidden, true);
  assert.equal(h.cart.load().items.length, 1);
});

for (const page of ['pago-exitoso', 'pago-pendiente', 'pago-fallido']) {
  test(`${page} renders PAYMENT_REVIEW and carries reference home without checkout`, async () => {
    const e = setup(`https://www.lumenpaper.com.ar/${page}.html?external_reference=${id}&status=approved`);
    const nodes = new Map();
    const node = key => {if (!nodes.has(key)) nodes.set(key, {textContent: '', disabled: false, href: '', replaceChildren() {}, append() {}, addEventListener() {}}); return nodes.get(key);};
    e.context.document = {querySelector: node, createElement: () => ({textContent: '', append() {}})};
    e.cart.save([line]); e.orders.rememberCart(id, [line]); const calls = [];
    e.context.fetch = async (url, options) => {calls.push({url, options}); return ok(summary('PAYMENT_REVIEW'));};
    vm.runInContext(source('js/order-return.js'), e.context);
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(node('#returnTitle').textContent, 'Pago en revisión');
    assert.match(node('#returnMessage').textContent, /No podemos confirmar/);
    assert.equal(e.cart.load().items.length, 1);
    assert.match(node('#returnHomeLink').href, new RegExp(id));
    assert.deepEqual(calls.map(c => c.options.method), ['GET']);
    assert.equal(calls[0].url.endsWith('/checkout'), false);
    assert.match(source(`${page}.html`), /id="returnHomeLink"/);
  });
}
