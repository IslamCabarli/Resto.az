// Run with: bun tool/mock_smoke_test.mjs
// Start Prism first; see ../README.md. These requests only target a local mock.
import assert from 'node:assert/strict';

const base = process.env.MOCK_BASE_URL ?? 'http://127.0.0.1:4010';
assert.equal(new URL(base).hostname, '127.0.0.1', 'Only a local mock is allowed');

const cases = [
  ['POST', '/auth/otp/request', 204, { phone: '+994501234567' }],
  ['POST', '/auth/otp/verify', 200, { phone: '+994501234567', code: '123456' }],
  ['GET', '/me', 200],
  ['PATCH', '/me', 200, { name: 'Murad', locale: 'az' }],
  ['GET', '/restaurants?min_budget_minor=2000&max_budget_minor=5000', 200],
  ['GET', '/restaurants/1', 200],
  ['GET', '/restaurants/1/menu', 200],
  ['GET', '/restaurants/1/reviews', 200],
  ['POST', '/restaurants/1/reviews', 201, { order_id: 101, rating: 5 }],
  ['GET', '/tables/resolve?token=k9Xp2mQ7', 200],
  ['POST', '/orders', 201, { table_id: 12, items: [{ menu_item_id: 31, quantity: 2 }] }],
  ['GET', '/orders', 200],
  ['GET', '/orders/101', 200],
  ['POST', '/orders/101/pay', 200, { method: 'google_pay' }],
  ['GET', '/me/coupons', 200],
  ['GET', '/me/loyalty', 200],
  ['GET', '/staff/orders', 200],
  ['PATCH', '/staff/orders/101/status', 200, { status: 'accepted' }],
  ['POST', '/auth/otp/request', 422, {}],
];

function checkMoney(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (key.endsWith('_minor') && item !== null) {
      assert.ok(Number.isSafeInteger(item), `${key} must be integer qepik`);
    }
    checkMoney(item);
  }
}

for (const [method, path, status, body] of cases) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: 'Bearer mock-token',
      'Accept-Language': 'az',
      'Content-Type': 'application/json',
      'Idempotency-Key': 'b6781872-a164-4ef3-b64b-cda5a9727575',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
  const text = await response.text();
  assert.equal(response.status, status, `${method} ${path}: ${text}`);
  if (text) {
    const json = JSON.parse(text);
    checkMoney(json);
    if (status === 422) {
      assert.equal(typeof json.code, 'string');
      assert.equal(typeof json.message, 'string');
    } else if (path === '/auth/otp/verify') {
      assert.equal(typeof json.token, 'string');
      assert.ok(json.user);
    } else {
      assert.ok(Object.hasOwn(json, 'data'), `${path}: missing data envelope`);
    }
  }
  console.log(`PASS ${method} ${path} -> ${status}`);
}
console.log(`Passed ${cases.length} mock checks. Prism is stateless, not a backend.`);
