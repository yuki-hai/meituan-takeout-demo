const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const values = new Map();
const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
};
const context = { window: { localStorage }, console, Date };
vm.createContext(context);
vm.runInContext(fs.readFileSync('app-state.js', 'utf8'), context);

const { Chanlema } = context.window;
const cart = {
    restaurant: {
        id: 1,
        name: '演示商家',
        deliveryFee: 6,
        packagingFee: 0,
        minPrice: 20,
        discountRules: [{ threshold: 30, amount: 11 }]
    },
    items: [{ id: 101, variantKey: '101|大杯', name: '咖啡', price: 19.9, calories: 144, count: 2 }]
};

const delivery = Chanlema.calculateOrder(cart, 'delivery');
assert.equal(delivery.foodTotal, 39.8);
assert.equal(delivery.deliveryFee, 6);
assert.equal(delivery.discount, 11);
assert.equal(delivery.total, 34.8);
assert.equal(delivery.canCheckout, true);

const pickup = Chanlema.calculateOrder(cart, 'pickup');
assert.equal(pickup.deliveryFee, 0);
assert.equal(pickup.total, 28.8);

const smallCart = { ...cart, items: [{ ...cart.items[0], price: 13.9, count: 1 }] };
const belowMinimum = Chanlema.calculateOrder(smallCart, 'delivery');
assert.equal(belowMinimum.canCheckout, false);
assert.equal(belowMinimum.amountToMinimum, 6.1);
assert.equal(belowMinimum.discount, 0);

const pending = Chanlema.createPendingOrder(cart, 'delivery');
const result = Chanlema.finishDecision(pending, {
    id: 'home', label: '家里简餐', cost: 9, calories: 480
});
assert.equal(result.netSaved, 25.8);
assert.equal(Chanlema.loadLastOrder().id, result.id);
assert.equal(Chanlema.loadHistory().length, 1);
assert.equal(Chanlema.loadStats().savedMoney, 25.8);
assert.equal(Chanlema.loadCart().items.length, 0);

const secondCart = {
    restaurant: { id: 2, name: '第二家演示商家', deliveryFee: 0, minPrice: 20, discountRules: [] },
    items: [{ id: 201, variantKey: '201', name: '便当', price: 20, calories: 360, count: 1 }]
};
const secondPending = Chanlema.createPendingOrder(secondCart, 'pickup');
const secondResult = Chanlema.finishDecision(secondPending, {
    id: 'canteen', label: '食堂', cost: 30, calories: 500
});
assert.equal(secondResult.netSaved, -10);
assert.notEqual(secondResult.id, result.id);
assert.equal(Chanlema.loadHistory().length, 2);
assert.equal(Chanlema.loadStats().skippedOrders, 2);
assert.equal(Chanlema.loadStats().savedMoney, 25.8);

const placedCart = {
    restaurant: { id: 3, name: '模拟下单商家', deliveryFee: 5, minPrice: 20, discountRules: [] },
    items: [{ id: 301, variantKey: '301', name: '水煮鱼', price: 38, calories: 480, count: 1 }]
};
const placedPending = Chanlema.createPendingOrder(placedCart, 'delivery');
const placedOrder = Chanlema.finishPlacedOrder(placedPending);
assert.equal(placedOrder.status, 'placed');
assert.equal(Chanlema.loadLastPlacedOrder().id, placedOrder.id);
assert.equal(Chanlema.loadPendingOrder(), null);
assert.equal(Chanlema.loadCart().items.length, 0);
assert.equal(Chanlema.loadHistory().length, 2, '完成的模拟订单不应计入“没点”记录');

console.log('app-state tests: OK');
