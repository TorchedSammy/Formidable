const Firework = require('@luvella/firework')

class PingCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {name: 'ping'});
	}

	async run({ msg }) {
		const m = await msg.channel.createMessage("Pong...?")
		m.edit({content: "🏓 Pong!", embed: {
			color: 0x47aef0,
			description: `💗 Websocket: \`${this.bot.shards.get(0).latency}ms\`
		📬 Message: \`${m.timestamp - msg.timestamp}ms\``
		}})	
	}
}

module.exports = PingCommand;

