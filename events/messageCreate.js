const Firework = require('@luvella/firework');

class MessageCreateEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'messageCreate'});
	}

	run(msg) {
		const prefix = 'senbe, ';
		if (!msg.content.startsWith(prefix)) return;
		if (msg.author.bot) return;

		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();		

		try {
			const cmd = this.bot.getCommand(command);
			if (!cmd) return;

			cmd.run({ msg, args, prefix });
		} catch (err) {
			this.bot.logger.error(err);
		}
	}
}

module.exports = MessageCreateEvent;

