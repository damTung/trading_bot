require('dotenv').config()
const _axios = require('axios')
const axios = _axios.default

var config = {
    headers: {
        "Accept": "application/json",
        "Authorization": ""
    }
}

class Bot {
    constructor (email, password) {
        this.email = email
        this.password = password
        this.access_token = null
        this.token_type = null
        this.coins = []
        this.allFunction = [this.buyLimit, this.sellLimit, this.buyMarket, this.sellMarket, this.buyStopLimit, this.sellStopLimit, this.buyStopMaket, this.sellStopMaket]
        this.execute = false
        // random stuff

        this.randFunction = 0
        this.random = 0
        this.priceBuy = 0
        this.priceSell = 0
        this.quantity = 0
        this.base = 0
        
        this.minQuantities = {
            'bch': 0.01,
            'btc': 0.01,
            'dash': 0.01,
            'etc': 0.1,
            'eth': 0.1,
            'knc': 0.1,
            'ltc': 0.1,
            'neo': 0.01,
            'tomo': 0.01,
            'xrp': 1
        }
        
    }

    _login () {
        axios.post("http://xchainos.com/oauth/token", {
            "grant_type": "password",
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "scope": "",
            "username": this.email,
            "password": this.password
        })
        .then(data => {
            this.access_token = data.data.access_token
            this.token_type = data.data.token_type
            config.headers.Authorization = this.token_type + " " + this.access_token
            // console.log(data.data)
            console.log("Logged in")
        })      
    }

    _getPairs () {
        axios.get('http://xchainos.com/api/masterdata')
        .then(data => {
            data.data.data.coin_settings.forEach(object => {
                this.coins.push(object.coin + "-" + object.currency)
            });
        })
        .catch(err => console.log)
    }

    _getDataBinance(pair) {
        axios.get(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${pair}`)
        .then(data => {               
            console.log(data.data)  
            this.priceBuy = data.data.bidPrice
            this.priceSell = data.data.askPrice
            this.execute = true
        })               
        .catch(err => {
            console.log("Don't have pair " + pair)
            this.priceBuy = 0
            this.priceSell = 0
            this.execute = false
        })
    }

    _randomNumber() {
            this.randFunction = Math.floor(Math.random() * this.allFunction.length)
            this.random = Math.floor(Math.random() * this.coins.length)
            this.temps = Math.floor(1 + Math.random() * (100 - 1))
            this.base = 100000 + Math.random() * (200000 - 100000)
            this.base = Math.round(this.base)
           console.log("quantity: " + this.quantity)
        setTimeout(() => {
            this.quantity = this.calulateQuantity(this.temps, this.coins[this.random])
        },400)
       
    }

    calulateQuantity(amount, coin) {
        var temp = coin.split('-')
        console.log("coin: " + temp[0])
        var minQuantity = this.minQuantities[temp[0]];
        // // var minQuantity = 0.01
        // console.log(this.minQuantities)
        console.log('min quantity: ' + minQuantity)
        var quantity = amount;
        if (quantity > 200 * minQuantity) {
          quantity = quantity / 20;
        }
        if (coin == 'xrp') {
          quantity = Math.random() * 10
        }
        quantity = Math.round(quantity / minQuantity) * minQuantity;
        console.log('here')
        console.log(Math.max(quantity, minQuantity))
        return Math.max(quantity, minQuantity);
      }

    _startBot () {
        if (!this.access_token){
            this._login()   
            this._getPairs()
        }

        setTimeout(() => {
            setTimeout(() => {
                // console.log("here" + this.random)
                var temp = this.coins[this.random]
                var pairTemp = temp.split('-')
                temp = pairTemp.join("").toUpperCase()
                setTimeout(() => {
                    this._getDataBinance(temp)
                },1000)
            }, 2000)
            this._randomNumber()

            // this.randFunction = Math.floor(Math.random() * this.allFunction.length)
            // this.random = Math.floor(Math.random() * this.coins.length)
            // this.quantity = Math.floor(1 + Math.random() * (100 - 1))
            // this.base = 100000 + Math.random() * (200000 - 100000)
            // this.base = Math.round(this.base)
        }, 4000)

        setTimeout(() => {
            // if(this.execute){
            //     if (this.randFunction <= 1){
            //         this.allFunction[this.randFunction](this.coins[this.random], this.quantity, this.priceBuy, this.priceSell) // buy sell limit
            //     }
            //     if (this.randFunction > 1 && this.randFunction <= 3) {
            //         this.allFunction[this.randFunction](this.coins[this.random], this.quantity) // buy sell market
            //     }
            //     if (this.randFunction > 3 && this.randFunction <= 5) {
            //         this.allFunction[this.randFunction](this.coins[this.random], this.base, this.quantity, this.priceBuy, this.priceSell) // buy sell stop limit
            //     }        
            //     if (this.randFunction > 5 && this.randFunction <= 7) {
            //         this.allFunction[this.randFunction](this.coins[this.random], this.base, this.quantity) // buy sell stop market
            //     }  
            // }
            
            this._startBot()
        },10000)
    } 


//----------------------------------------------------------------------------------------------------------------

    buyLimit(pairs, quantity, priceBuy, priceSell){
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "coin":	pair[0],
            "currency":	pair[1],
            "price": priceBuy,
            "quantity":	quantity,
            "trade_type": "buy",
            "type": "limit"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }

    sellLimit(pairs, quantity, priceBuy, priceSell){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "coin":	pair[0],
            "currency":	pair[1],
            "price": priceSell,
            "quantity":	quantity,
            "trade_type": "sell",
            "type": "limit"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }
//----------------------------------------------------------------------------------------------------------------
    buyMarket(pairs, quantity){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "coin": pair[0],
            "currency": pair[1],
            "quantity": quantity,
            "trade_type": "buy",
            "type": "market"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }

    sellMarket(pairs, quantity){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "coin": pair[0],
            "currency": pair[1],
            "quantity": quantity,
            "trade_type": "sell",
            "type": "market"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }
//----------------------------------------------------------------------------------------------------------------

    buyStopLimit(pairs, base_price, quantity, priceBuy, priceSell){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "base_price": base_price,
            "coin": pair[0],
            "currency": pair[1],
            "price": priceBuy,
            "quantity": quantity,
            "stop_condition": "le",
            "trade_type": "buy",
            "type": "stop_limit"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }

    sellStopLimit(pairs, base_price, quantity, priceBuy, priceSell){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "base_price": base_price,
            "coin": pair[0],
            "currency": pair[1],
            "price": priceSell,
            "quantity": quantity,
            "stop_condition": "le",
            "trade_type": "sell",
            "type": "stop_limit"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }
//---------------------------------------------------------------------------------------------------------------- 

    buyStopMaket(pairs, base_price, quantity){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "base_price": base_price,
            "coin": pair[0],
            "currency": pair[1],
            "quantity": quantity,
            "stop_condition": "le",
            "trade_type": "buy",
            "type": "stop_market"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }

    sellStopMaket(pairs, base_price, quantity){
        // console.log(config)
        var pair = pairs.split('-')
        axios.post("http://xchainos.com/api/v1/orders", {
            "base_price": base_price,
            "coin": pair[0],
            "currency": pair[1],
            "quantity": quantity,
            "stop_condition": "le",
            "trade_type": "sell",
            "type": "stop_market"
        }, config)
        .then(data => console.log(data.data))
        .catch(err => console.log(err))
    }
}

module.exports = Bot


// missing  .../vnd and some pairs