const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const pages = [
    'index.html',
    'restaurant.html',
    'cart.html',
    'decision.html',
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
    'assets/food/real/milk-tea.webp'
];

foodAssets.forEach(asset => assert.ok(fs.existsSync(asset), `missing food photo: ${asset}`));

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
        .map(resource => resource.split(/[?#]/)[0]);
    localResources.forEach(resource => {
        assert.ok(fs.existsSync(resource), `${page} references missing local resource: ${resource}`);
    });
}

console.log(`html syntax tests: OK (${pages.length} pages)`);
