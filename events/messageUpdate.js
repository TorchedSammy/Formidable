const Firework = require('@luvella/firework');

class MessageUpdateEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'messageUpdate'})
	}

	run(msg) {
		this.bot.emit('messageCreate', msg)
	}
}

module.exports = MessageUpdateEvent;
