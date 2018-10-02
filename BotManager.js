var Bot = require('./Bot')

class BotManager {
    constructor () {
        this._bots = {}
    }

    addBot (email, password) {
        var bot = new Bot(email, password)
        bot._startBot(email, password)
    }
    
}

var instance = new BotManager()

module.exports = instance