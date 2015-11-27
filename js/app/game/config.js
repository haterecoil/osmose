
var lanesConfig = [
    {
        count: 0,
        max: 3,
        width: 200,
        template: "<div class='lane lane0'><div class='background-lane background-lane--0'></div></div>",
        $domElement: null
    },
    {
        count: 0,
        max: 3,
        width: 350,
        template: "<div class='lane lane1'><div class='background-lane background-lane--1'></div></div>",
        $domElement: null
    },
    {
        count: 0,
        max: 4,
        width: 500,
        template: "<div class='lane lane2'><div class='background-lane background-lane--2'></div></div>",
        $domElement: null
    }
];

var animalsConfig = [
    {
        name: "buffle",
        alive: 0,
        dead: 0,
        population: 1,
        health: 1,
        speed: 34,
        color: "yellow",
        assets: {
            moving: { svgPath : '/img/game_svg/s_buffle.svg#animal' },
            death: {flashPath : '/img/game_flashes/buffle.jpeg'},
            sounds: []
        }
    },
    {
        name: "elephant",
        alive: 0,
        dead: 0,
        population: 2,
        health: 1,
        speed: 20,
        color: "blue",
        assets: {
            moving: { svgPath : '/img/game_svg/s_elephant.svg#animal' },
            death: {flashPath : '/img/game_flashes/elephant.jpeg'},
            sounds: []
        }
    },
    {
        name: "lion",
        alive: 0,
        dead: 0,
        population: 1,
        health: 1,
        speed: 45,
        color: "red",
        assets: {
            moving: { svgPath : '/img/game_svg/s_lion.svg#animal' },
            death: {flashPath : '/img/game_flashes/lion.jpeg'},
            sounds: []
        }
    },
    {
        name: "rhinoceros",
        alive: 0,
        dead: 0,
        population: 1,
        health: 1,
        speed: 33,
        color: "red",
        assets: {
            moving: { svgPath : '/img/game_svg/s_rhinoceros.svg#animal' },
            death: {flashPath : '/img/game_flashes/rhinoceros.jpeg'},
            sounds: []
        }
    },
    {
        name: "leopard",
        alive: 0,
        dead: 0,
        population: 2,
        health: 1,
        speed: 50,
        color: "red",
        assets: {
            moving: { svgPath : '/img/game_svg/s_leopard.svg#animal' },
            death: {flashPath : '/img/game_flashes/leopard.jpeg'},
            sounds: []
        }
    }
];