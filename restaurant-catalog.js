(function (global) {
    'use strict';

    const image = name => `assets/food/real/${name}.webp`;

    const homeRestaurants = [
        { id: 1, name: '東盛炭烤自助料理(长泰广场店)', rating: 4.6, sales: 1200, deliveryTime: 25, deliveryFee: 6, minPrice: 28, image: image('lamb-skewers'), tags: ['夜宵热点', '自助烧烤'], activities: ['满58减12'] },
        { id: 2, name: '陳香貴·蘭州牛肉面(长泰广场店)', rating: 4.7, sales: 1100, deliveryTime: 20, deliveryFee: 3, minPrice: 15, image: image('beef-noodles'), tags: ['人气面馆', '快手夜宵'], activities: ['满25减3'] },
        { id: 3, name: '鱼非鱼(长泰广场店)', rating: 4.5, sales: 950, deliveryTime: 30, deliveryFee: 5, minPrice: 30, image: image('spicy-fish'), tags: ['川菜美食', '麻辣爽口'], activities: ['满50减8'] },
        { id: 4, name: '一绪に寿喜烧放题(长泰广场店)', rating: 4.4, sales: 800, deliveryTime: 28, deliveryFee: 7, minPrice: 35, image: image('meat-platter'), tags: ['日式火锅', '放题聚餐'], activities: ['满60减10'] },
        { id: 5, name: '新旺茶餐廳(长泰广场店)', rating: 4.3, sales: 920, deliveryTime: 22, deliveryFee: 4, minPrice: 20, image: image('roast-duck-rice'), tags: ['港式烧味', '经典港茶'], activities: ['满40减6'] },
        { id: 6, name: '和米堂(长泰广场店)', rating: 4.6, sales: 760, deliveryTime: 18, deliveryFee: 3, minPrice: 20, image: image('katsu-rice'), tags: ['日式简餐', '现点现做'], activities: ['满30减5'] },
        { id: 7, name: '新元素(长泰广场店)', rating: 4.7, sales: 680, deliveryTime: 25, deliveryFee: 5, minPrice: 30, image: image('poke-salad'), tags: ['健康轻食', '高蛋白'], activities: ['满60减10'] },
        { id: 8, name: 'blue frog蓝蛙(长泰广场店)', rating: 4.6, sales: 850, deliveryTime: 26, deliveryFee: 6, minPrice: 35, image: image('beef-burger'), tags: ['美式汉堡', '现烤牛肉'], activities: ['满70减12'] },
        { id: 9, name: '茉沏(长泰广场店)', rating: 4.8, sales: 1300, deliveryTime: 15, deliveryFee: 2, minPrice: 15, image: image('bubble-tea'), tags: ['现制茶饮', '下午茶'], activities: ['满25减4'] },
        { id: 10, name: '毕真烤肉店(长泰广场店)', rating: 4.5, sales: 720, deliveryTime: 28, deliveryFee: 6, minPrice: 40, image: image('korean-bbq'), tags: ['韩式烤肉', '聚餐套餐'], activities: ['满88减15'] }
    ];

    const detailRestaurants = {
        6: {
            id: 6, name: '和米堂(长泰广场店)', rating: 4.6, sales: 760,
            deliveryTime: 18, deliveryFee: 3, minPrice: 20, packagingFee: 1,
            discountRules: [{ threshold: 30, amount: 5 }], distance: 0.6,
            image: image('katsu-rice'), imageType: 'img',
            categories: [
                { name: '招牌饭食', dishes: [
                    { id: 601, name: '日式炸猪排饭', desc: '酥脆猪排配米饭和酱汁', price: 26, originalPrice: 38, sales: 220, calories: 720, image: image('katsu-rice') }
                ] },
                { name: '人气小食', dishes: [
                    { id: 602, name: '章鱼小丸子(6颗)', desc: '柴鱼花配沙拉酱', price: 16, originalPrice: 24, sales: 180, calories: 360, image: image('takoyaki') }
                ] }
            ]
        },
        7: {
            id: 7, name: '新元素(长泰广场店)', rating: 4.7, sales: 680,
            deliveryTime: 25, deliveryFee: 5, minPrice: 30, packagingFee: 2,
            discountRules: [{ threshold: 60, amount: 10 }], distance: 0.4,
            image: image('poke-salad'), imageType: 'img',
            categories: [
                { name: '健康能量碗', dishes: [
                    { id: 701, name: '烤鸡藜麦能量碗', desc: '时蔬、藜麦与烤鸡搭配', price: 42, originalPrice: 58, sales: 180, calories: 520, image: image('poke-salad') }
                ] },
                { name: '卷饼与三明治', dishes: [
                    { id: 702, name: '香草鸡肉卷', desc: '鸡肉配生菜和香草酱', price: 32, originalPrice: 45, sales: 140, calories: 480, image: image('chicken-wrap') }
                ] }
            ]
        },
        8: {
            id: 8, name: 'blue frog蓝蛙(长泰广场店)', rating: 4.6, sales: 850,
            deliveryTime: 26, deliveryFee: 6, minPrice: 35, packagingFee: 2,
            discountRules: [{ threshold: 70, amount: 12 }], distance: 0.5,
            image: image('beef-burger'), imageType: 'img',
            categories: [
                { name: '汉堡与三明治', dishes: [
                    { id: 801, name: '经典芝士牛肉汉堡', desc: '牛肉饼、芝士与炸薯条', price: 48, originalPrice: 68, sales: 260, calories: 850, image: image('beef-burger') },
                    { id: 802, name: '酥脆鸡肉三明治', desc: '酥脆鸡排配酸黄瓜和吐司', price: 38, originalPrice: 55, sales: 190, calories: 720, image: image('chicken-burger') }
                ] }
            ]
        },
        9: {
            id: 9, name: '茉沏(长泰广场店)', rating: 4.8, sales: 1300,
            deliveryTime: 15, deliveryFee: 2, minPrice: 15, packagingFee: 0,
            discountRules: [{ threshold: 25, amount: 4 }], distance: 0.3,
            image: image('bubble-tea'), imageType: 'img',
            categories: [
                { name: '人气奶茶', dishes: [
                    { id: 901, name: '芋香奶茶', desc: '芋香牛奶茶，冰爽顺滑', price: 18, originalPrice: 24, sales: 360, calories: 330, image: image('bubble-tea') },
                    { id: 902, name: '珍珠奶茶', desc: '冰奶茶配黑色珍珠', price: 20, originalPrice: 26, sales: 280, calories: 420, image: image('milk-tea-glass') }
                ] }
            ]
        },
        10: {
            id: 10, name: '毕真烤肉店(长泰广场店)', rating: 4.5, sales: 720,
            deliveryTime: 28, deliveryFee: 6, minPrice: 40, packagingFee: 2,
            discountRules: [{ threshold: 88, amount: 15 }], distance: 0.7,
            image: image('korean-bbq'), imageType: 'img',
            categories: [
                { name: '韩式烤肉套餐', dishes: [
                    { id: 1001, name: '韩式炭火烤肉套餐', desc: '炭火现烤腌制肉片', price: 56, originalPrice: 78, sales: 170, calories: 780, image: image('korean-bbq') },
                    { id: 1002, name: '炭烤牛肉', desc: '牛肉上桌现烤', price: 62, originalPrice: 88, sales: 150, calories: 720, image: image('korean-grill') }
                ] }
            ]
        }
    };

    const dishSpecs = {
        601: [{ title: '饭量', options: [{ label: '正常' }, { label: '加饭', price: 2, calories: 1.15 }] }, { title: '酱汁', options: [{ label: '原味' }, { label: '咖喱' }] }],
        602: [{ title: '份量', options: [{ label: '6颗' }, { label: '12颗', price: 12, calories: 2 }] }, { title: '酱料', options: [{ label: '经典酱' }, { label: '少酱' }] }],
        701: [{ title: '份量', options: [{ label: '标准份' }, { label: '加鸡肉', price: 8, calories: 1.2 }] }, { title: '沙拉酱', options: [{ label: '柚子醋' }, { label: '凯撒酱' }, { label: '酱另放' }] }],
        702: [{ title: '鸡肉份量', options: [{ label: '标准' }, { label: '双份鸡肉', price: 8, calories: 1.25 }] }, { title: '酱料', options: [{ label: '香草酱' }, { label: '酱另放' }] }],
        801: [{ title: '牛肉饼', options: [{ label: '单层' }, { label: '双层', price: 16, calories: 1.35 }] }, { title: '配菜', options: [{ label: '炸薯条' }, { label: '生菜沙拉' }] }],
        802: [{ title: '鸡排', options: [{ label: '单层' }, { label: '双层', price: 12, calories: 1.4 }] }, { title: '配菜', options: [{ label: '炸薯条' }, { label: '生菜沙拉' }] }],
        901: [{ title: '杯型', options: [{ label: '中杯' }, { label: '大杯', price: 3, calories: 1.25 }] }, { title: '甜度', options: [{ label: '三分糖' }, { label: '五分糖' }, { label: '七分糖' }] }, { title: '温度', options: [{ label: '热' }, { label: '去冰' }, { label: '正常冰' }] }],
        902: [{ title: '杯型', options: [{ label: '中杯' }, { label: '大杯', price: 3, calories: 1.25 }] }, { title: '甜度', options: [{ label: '三分糖' }, { label: '五分糖' }, { label: '七分糖' }] }, { title: '温度', options: [{ label: '热' }, { label: '去冰' }, { label: '正常冰' }] }],
        1001: [{ title: '份量', options: [{ label: '单人份' }, { label: '双人份', price: 42, calories: 1.8 }] }, { title: '辣度', options: [{ label: '不辣' }, { label: '微辣' }, { label: '中辣' }] }],
        1002: [{ title: '份量', options: [{ label: '单人份' }, { label: '双人份', price: 48, calories: 1.8 }] }, { title: '熟度', options: [{ label: '七分' }, { label: '全熟' }] }]
    };

    global.ChanlemaCatalog = {
        categories: [
            { id: 1, name: '全部', icon: '🍜' },
            { id: 2, name: '汉堡西餐', icon: '🍔' },
            { id: 3, name: '烧烤', icon: '🥩' },
            { id: 4, name: '面食', icon: '🍜' },
            { id: 5, name: '火锅川菜', icon: '🌶️' },
            { id: 6, name: '轻食', icon: '🥗' },
            { id: 7, name: '茶饮', icon: '🧋' },
            { id: 8, name: '快餐', icon: '🍱' }
        ],
        promotions: [
            { id: 1, title: '炭烤双人组合', price: '¥22.1', desc: '限时免配送费', image: image('lamb-skewers') },
            { id: 2, title: '招牌牛肉面套餐', price: '¥23.9', desc: '午餐人气款', image: image('beef-noodles') },
            { id: 8, title: '经典芝士牛肉汉堡', price: '¥48', desc: '汉堡配薯条', image: image('beef-burger') }
        ],
        homeRestaurants,
        categoryRestaurants: {
            1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            2: [7, 8],
            3: [1, 10],
            4: [2],
            5: [3, 4],
            6: [7],
            7: [5, 9],
            8: [2, 5, 6, 8]
        },
        detailRestaurants,
        dishSpecs
    };
})(window);
