const _axios = require('axios')
const axios = _axios.default

var urlOrder = "http://xchainos.com/api/v1/orders"
   
var access_token
var token_type

var config = {
    headers: {
        "Accept": "application/json",
        "Authorization": ""
    }
}
// Get token and set headers
axios.post("http://xchainos.com/oauth/token", {
    "grant_type": "password",
    "client_id": "3",
    "client_secret": "trdNV0J1DOICcu5JjQgouAXTiHw2cEjsk4KGZ9Rs",
    "scope": "",
    "username": "bot1@gmail.com",
    "password": "123123"
})
.then(data => {
    access_token = data.data.access_token
    token_type = data.data.token_type
    config.headers.Authorization = token_type + " " + access_token
})

//----------------------------------------------------------------------------------------------------------------

function buyLimit(pairs, price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "coin":	pair[0],
        "currency":	pair[1],
        "price": price,
        "quantity":	quantity,
        "trade_type": "buy",
        "type": "limit"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
    
}

function sellLimit(pairs, price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "coin":	pair[0],
        "currency":	pair[1],
        "price": price,
        "quantity":	quantity,
        "trade_type": "sell",
        "type": "limit"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}
//----------------------------------------------------------------------------------------------------------------
function buyMarket(pairs, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "coin": pair[0],
        "currency": pair[1],
        "quantity": quantity,
        "trade_type": "buy",
        "type": "market"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}

function sellMarket(pairs, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "coin": pair[0],
        "currency": pair[1],
        "quantity": quantity,
        "trade_type": "sell",
        "type": "market"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}
//----------------------------------------------------------------------------------------------------------------

function buyStopLimit(pairs, base_price, price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "base_price": base_price,
        "coin": pair[0],
        "currency": pair[1],
        "price": price,
        "quantity": quantity,
        "stop_condition": "le",
        "trade_type": "buy",
        "type": "stop_limit"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}

function sellStopLimit(pairs, base_price, price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "base_price": base_price,
        "coin": pair[0],
        "currency": pair[1],
        "price": price,
        "quantity": quantity,
        "stop_condition": "le",
        "trade_type": "sell",
        "type": "stop_limit"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => console.log(err))
}
//---------------------------------------------------------------------------------------------------------------- 

function buyStopMaket(pairs, base_price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "base_price": base_price,
        "coin": pair[0],
        "currency": pair[1],
        "quantity": quantity,
        "stop_condition": "le",
        "trade_type": "buy",
        "type": "stop_market"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}

function sellStopMaket(pairs, base_price, quantity){
    var pair = pairs.split('-')
    axios.post(urlOrder, {
        "base_price": base_price,
        "coin": pair[0],
        "currency": pair[1],
        "quantity": quantity,
        "stop_condition": "le",
        "trade_type": "sell",
        "type": "stop_market"
    }, config)
    .then(data => console.log(data.data))
    .catch(err => {})
}
     
//----------------------------------------------------------------------------------------------------------------

function getPair(){
    axios.get('http://xchainos.com/api/masterdata')
    .then(data => {
        data.data.data.coin_settings.forEach(object => {
            coins.push(object.coin + "-" + object.currency)
        });
    })
    .then(() => {
        random = coins[Math.floor(Math.random() * coins.length)]
    })
    .then(() => {
        run()
    })
}

var random = 0
getPair()
var coins = []
var allFunction = [buyLimit, sellLimit, buyMarket, sellMarket, buyStopLimit, sellStopLimit, buyStopMaket, sellStopMaket]

// random stuff
var randFunction = Math.floor(Math.random() * allFunction.length)
var price
var quantity
var base
// finishing up the bot
function run () {
    randFunction = Math.floor(Math.random() * allFunction.length)
    random = Math.floor(Math.random() * coins.length)
    price = 100000 + Math.random() * (200000 - 100000)  
    price = Math.round(price)
    quantity = Math.floor(1 + Math.random() * (100 - 1))
    base = 100000 + Math.random() * (200000 - 100000)
    base = Math.round(base)
    setTimeout(() => {
        if(randFunction <= 1)
            allFunction[randFunction](coins[random], price, quantity) // buy sell limit
        if (randFunction > 1 && randFunction <= 3)        
            allFunction[randFunction](coins[random], quantity) // buy sell market
        if (randFunction > 3 && randFunction <= 5)        
            allFunction[randFunction](coins[random], base, price, quantity) // buy sell stop limit
        if (randFunction > 5 && randFunction <= 7)        
            allFunction[randFunction](coins[random], base, quantity) // buy sell stop market
        run()    
    },300)
}

module.exports = run()