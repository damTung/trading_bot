var BotManager = require('./BotManager')

// setInterval(() => {
//     BotManager.addBot(`bot${Math.floor(Math.random() * 2)}@gmail.com`, '123123')
// }, 5000)

for(var i = 1; i < 3; i++){
    // setTimeout(function() {
        BotManager.addBot(`bot${i}@gmail.com`, '123123', i)
    // }, 2000)
}
//1 - 10 123123
// 1- e 1231234