const Firework = require('@luvella/firework');

class MessageCreateEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'messageCreate'});
	}

	run(msg) {
		const prefix = 'senbe, ';
		if (!msg.content.startsWith(prefix)) return;
		if (msg.author.bot) return;

		const str = msg.content.slice(prefix.length).trim();
		const args = str.split(' ');
		const command = args.shift().toLowerCase();		

		try {
			const cmd = this.bot.getCommand(command);
			if (!cmd) return;

			cmd.run({ msg, args, str, prefix });
		} catch (err) {
			this.bot.logger.error(err);
		}
	}
}

module.exports = MessageCreateEvent;

