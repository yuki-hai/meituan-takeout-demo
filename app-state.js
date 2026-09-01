(function (global) {
    'use strict';

    const memoryStore = {};
    const KEYS = {
        cart: 'chanlema:cart',
        pendingOrder: 'chanlema:pending-order',
        lastOrder: 'chanlema:last-order',
        history: 'chanlema:history',
        stats: 'chanlema:stats'
    };

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function round(value, digits = 2) {
        const factor = 10 ** digits;
        return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
    }

    function readRaw(key) {
        try {
            return global.localStorage.getItem(key);
        } catch (error) {
            return memoryStore[key] || null;
        }
    }

    function writeRaw(key, value) {
        const serialized = String(value);
        try {
            global.localStorage.setItem(key, serialized);
        } catch (error) {
            memoryStore[key] = serialized;
        }
    }

    function removeRaw(key) {
        try {
            global.localStorage.removeItem(key);
        } catch (error) {
            delete memoryStore[key];
        }
    }

    function readJSON(key, fallback) {
        try {
            const value = readRaw(key);
            return value ? JSON.parse(value) : clone(fallback);
        } catch (error) {
            return clone(fallback);
        }
    }

    function writeJSON(key, value) {
        writeRaw(key, JSON.stringify(value));
        return value;
    }

    function emptyCart() {
        return { items: [], restaurant: null };
    }

    function loadCart() {
        const current = readJSON(KEYS.cart, null);
        if (current && Array.isArray(current.items)) return current;

        // 兼容仓库旧版本的购物车，首次读取后迁移到新键名。
        const legacy = readJSON('cart', null);
        if (legacy && Array.isArray(legacy.items)) {
            const migrated = {
                items: legacy.items.map(item => ({
                    ...item,
                    variantKey: item.variantKey || String(item.id),
                    specs: Array.isArray(item.specs) ? item.specs : []
                })),
                restaurant: legacy.restaurant || null
            };
            writeJSON(KEYS.cart, migrated);
            return migrated;
        }
        return emptyCart();
    }

    function saveCart(cart) {
        return writeJSON(KEYS.cart, cart);
    }

    function clearCart() {
        removeRaw(KEYS.cart);
        removeRaw('cart');
    }

    function getDiscount(foodTotal, restaurant) {
        const rules = Array.isArray(restaurant && restaurant.discountRules)
            ? [...restaurant.discountRules].sort((a, b) => b.threshold - a.threshold)
            : [];
        const matched = rules.find(rule => foodTotal >= Number(rule.threshold));
        return matched ? Number(matched.amount) : 0;
    }

    function calculateOrder(cart, deliveryMode = 'delivery') {
        const items = Array.isArray(cart && cart.items) ? cart.items : [];
        const restaurant = (cart && cart.restaurant) || {};
        const foodTotal = round(items.reduce(
            (sum, item) => sum + Number(item.price || 0) * Number(item.count || 0),
            0
        ));
        const itemCount = items.reduce((sum, item) => sum + Number(item.count || 0), 0);
        const calories = Math.round(items.reduce(
            (sum, item) => sum + Number(item.calories || 0) * Number(item.count || 0),
            0
        ));
        const deliveryFee = deliveryMode === 'delivery' ? Number(restaurant.deliveryFee || 0) : 0;
        const packagingFee = Number(restaurant.packagingFee || 0);
        const discount = getDiscount(foodTotal, restaurant);
        const total = round(Math.max(0, foodTotal + deliveryFee + packagingFee - discount));
        const minPrice = Number(restaurant.minPrice || 0);

        return {
            foodTotal,
            itemCount,
            calories,
            caloriesLow: Math.max(0, Math.round(calories * 0.85)),
            caloriesHigh: Math.max(0, Math.round(calories * 1.15)),
            deliveryFee: round(deliveryFee),
            packagingFee: round(packagingFee),
            discount: round(discount),
            total,
            minPrice,
            amountToMinimum: round(Math.max(0, minPrice - foodTotal)),
            canCheckout: items.length > 0 && foodTotal >= minPrice,
            deliveryMode
        };
    }

    function createPendingOrder(cart, deliveryMode) {
        const calculation = calculateOrder(cart, deliveryMode);
        const pendingOrder = {
            id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            items: clone(cart.items || []),
            restaurant: clone(cart.restaurant || {}),
            calculation
        };
        writeJSON(KEYS.pendingOrder, pendingOrder);
        return pendingOrder;
    }

    function loadPendingOrder() {
        return readJSON(KEYS.pendingOrder, null);
    }

    function finishDecision(pendingOrder, alternative) {
        if (!pendingOrder || !pendingOrder.calculation) {
            throw new Error('订单数据不存在');
        }

        const selectedAlternative = {
            id: alternative.id || 'custom',
            label: alternative.label || '自定义替代餐',
            cost: round(Math.max(0, Number(alternative.cost || 0))),
            calories: Math.max(0, Math.round(Number(alternative.calories || 0)))
        };
        const calculation = pendingOrder.calculation;
        const netSaved = round(calculation.total - selectedAlternative.cost);
        const calorieDiffLow = calculation.caloriesLow - selectedAlternative.calories;
        const calorieDiffHigh = calculation.caloriesHigh - selectedAlternative.calories;
        const result = {
            ...clone(pendingOrder),
            completedAt: new Date().toISOString(),
            alternative: selectedAlternative,
            netSaved,
            calorieDiffLow,
            calorieDiffHigh
        };

        const history = readJSON(KEYS.history, []);
        const nextHistory = [result, ...history.filter(item => item.id !== result.id)].slice(0, 50);
        writeJSON(KEYS.history, nextHistory);
        writeJSON(KEYS.lastOrder, result);
        writeJSON(KEYS.stats, {
            skippedOrders: nextHistory.length,
            savedMoney: round(nextHistory.reduce((sum, item) => sum + Math.max(0, Number(item.netSaved || 0)), 0))
        });
        removeRaw(KEYS.pendingOrder);
        clearCart();
        return result;
    }

    function loadLastOrder() {
        return readJSON(KEYS.lastOrder, null);
    }

    function loadHistory() {
        return readJSON(KEYS.history, []);
    }

    function loadStats() {
        return readJSON(KEYS.stats, { skippedOrders: 0, savedMoney: 0 });
    }

    global.Chanlema = {
        KEYS,
        round,
        emptyCart,
        loadCart,
        saveCart,
        clearCart,
        calculateOrder,
        createPendingOrder,
        loadPendingOrder,
        finishDecision,
        loadLastOrder,
        loadHistory,
        loadStats
    };
})(window);
