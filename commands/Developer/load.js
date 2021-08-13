const Firework = require('@luvella/firework')

class LoadCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
				name: "load",
				aliases: ["rl"],
		})
	}

	async run({msg, args}) {
		if(!args[0]) return msg.channel.createMessage("You have to say what command to load!")
		if(this.bot.getCommand(args[0])) return msg.channel.createMessage("That command is already loaded.")
		let props;

		try {
			props = new (require(`../${args[0]}.js`))(this.bot)
			props.settings.category = args[0].split('/')[0]
		} catch(e) {
			msg.channel.createMessage(`An error occurred trying to reload ${args[0]}\n\n${e}`)
			return
		}

   	    this.bot.addCommand(props);
		msg.channel.createMessage(`The command ${args[0]} has been loaded successfully.`);
	}
}

module.exports = LoadCommand;
