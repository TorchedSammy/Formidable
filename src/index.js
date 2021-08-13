const Firework = require('@luvella/firework')
const bot = new Firework(require('../config.json').token);

bot.loadCommands('./commands').loadEvents('./events');

