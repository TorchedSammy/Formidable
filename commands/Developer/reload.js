const Firework = require('@luvella/firework')

class ReloadCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
				name: "reload",
				aliases: ["rl"],
		})
	}

	async run({msg, args}) {
		if(!args[0]) return msg.channel.createMessage("You have to say what command to reload!")
		if(!this.bot.getCommand(args[0])) return msg.channel.createMessage("Sorry, I could not find that command.")

		const category = this.bot.getCommand(args[0]).settings.category

		delete require.cache[require.resolve(`../${category}/${args[0]}.js`)];
		this.bot.commands.delete(args[0]);
		const props = new (require(`../${category}/${args[0]}.js`))(this.bot)
		props.settings.category = category
        this.bot.commands.set(args[0], props);
		msg.channel.createMessage(`The command ${args[0]} has been reloaded successfully.`);
	}
}

module.exports = ReloadCommand;
