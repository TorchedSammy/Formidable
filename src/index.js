const Level = require('level')
const Firework = require('@luvella/firework')

const db = Level('formidabledb')
const bot = new Firework(require('../config.json').token);
bot.db = db
bot.genID = () => [...Array(8)].map(() => Math.random().toString(36)[2]).join('')

bot.loadCommands('./commands').loadEvents('./events');

process.stdin.resume();

function exitHandler() {
    db.close()
    bot.logger.log('Shutting down..')
    process.exit();
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
