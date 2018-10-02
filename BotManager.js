var Bot = require('./Bot')

class BotManager {
    constructor () {
        this._bots = {}
    }

    addBot (email, password, botId) {
        var self = this
        var bot = new Bot(email, password, botId)
        
        self._bots[email] = bot
        console.log(`Add bot ${botId}`)
        bot._startBot(email, password)
    }
    
}

var instance = new BotManager()

module.exports = instance