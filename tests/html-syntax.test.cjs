const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const pages = [
    'index.html',
    'restaurant.html',
    'cart.html',
    'decision.html',
    'order-success.html',
    'success.html',
    'history.html'
];
const foodAssets = [
    'assets/food/real/lamb-skewers.webp',
    'assets/food/real/chicken-wings.webp',
    'assets/food/real/fish-tofu-skewers.webp',
    'assets/food/real/grilled-eggplant.webp',
    'assets/food/real/beef-noodles.webp',
    'assets/food/real/lamb-noodles.webp',
    'assets/food/real/egg-radish.webp',
    'assets/food/real/spicy-fish.webp',
    'assets/food/real/mao-xue-wang.webp',
    'assets/food/real/meat-platter.webp',
    'assets/food/real/seafood-platter.webp',
    'assets/food/real/roast-duck-rice.webp',
    'assets/food/real/curry-brisket-rice.webp',
    'assets/food/real/milk-tea.webp',
    'assets/food/real/katsu-rice.webp',
    'assets/food/real/takoyaki.webp',
    'assets/food/real/poke-salad.webp',
    'assets/food/real/chicken-wrap.webp',
    'assets/food/real/beef-burger.webp',
    'assets/food/real/chicken-burger.webp',
    'assets/food/real/bubble-tea.webp',
    'assets/food/real/milk-tea-glass.webp',
    'assets/food/real/korean-bbq.webp',
    'assets/food/real/korean-grill.webp'
];

foodAssets.forEach(asset => assert.ok(fs.existsSync(asset), `missing food photo: ${asset}`));

const catalogContext = { window: {} };
vm.createContext(catalogContext);
vm.runInContext(fs.readFileSync('restaurant-catalog.js', 'utf8'), catalogContext, { filename: 'restaurant-catalog.js' });
const catalog = catalogContext.window.ChanlemaCatalog;
assert.equal(catalog.homeRestaurants.length, 10, 'home should expose all ten merchants');
assert.equal(Object.keys(catalog.detailRestaurants).length, 5, 'catalog should add five merchant detail records');
assert.equal(
    Object.values(catalog.detailRestaurants).flatMap(restaurant => restaurant.categories.flatMap(category => category.dishes)).length,
    10,
    'catalog should add ten individually configured dishes'
);

for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(inlineScripts.length > 0, `${page} should include an inline script`);
    inlineScripts.forEach((match, index) => {
        new vm.Script(match[1], { filename: `${page}:inline-${index + 1}` });
    });

    const localResources = [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)]
        .map(match => match[1])
        .filter(resource => resource && !resource.startsWith('#') && !/^[a-z]+:/i.test(resource))
        .filter(resource => !resource.includes('${'))
        .map(resource => resource.split(/[?#]/)[0]);
    localResources.forEach(resource => {
        assert.ok(fs.existsSync(resource), `${page} references missing local resource: ${resource}`);
    });
}

const restaurantHtml = fs.readFileSync('restaurant.html', 'utf8');
assert.match(restaurantHtml, /class="dish-item"[^>]*onclick="showDishModal\(/, 'dish card should open its detail modal');
assert.match(restaurantHtml, /class="dish-detail-image"/, 'dish detail should include the food photo');
assert.match(restaurantHtml, /约 \$\{dish\.calories\} 千卡/, 'dish detail should include calories');
assert.match(restaurantHtml, /104:\s*\[\s*\{ title: '份量'/, 'grilled eggplant should have dish-specific portion options');
assert.match(restaurantHtml, /503:\s*\[\s*\{ title: '杯型'/, 'only the milk tea should use cup-size options');
assert.doesNotMatch(restaurantHtml, /dishId\s*>=\s*100/, 'dish specs should not be inferred from legacy id ranges');

const decisionHtml = fs.readFileSync('decision.html', 'utf8');
assert.match(decisionHtml, /onclick="finishOrder\(\)"/, 'decision page should offer a clear place-order action');
assert.match(decisionHtml, /onclick="finishSkip\(\)"/, 'decision page should preserve the skip-order action');

console.log(`html syntax tests: OK (${pages.length} pages)`);
