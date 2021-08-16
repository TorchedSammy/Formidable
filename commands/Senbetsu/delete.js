const Firework = require('@luvella/firework');

class DeleteCOmmand extends Firework.Command {
	constructor(bot) {
		super(bot, {
			name: 'delete'
		})
	}

	async run({msg, args}) {
		const dbentry = await this.bot.db.get(args[0])
		const entry = JSON.parse(dbentry)
		const entryids = Object.values(entry)
		const id = args[0]
		for (let i = entryids.length - 1; i >= 0; i--) {
			const entrymsg = await this.bot.getMessage(entryids[i][0], entryids[i][1])
			entrymsg.delete()
		}

		await this.bot.db.del(id)
		this.bot.logger.debug('Removed entry', id, 'from database.')
		msg.channel.createMessage(`Entry ${id} has been deleted.`)
	}
}

module.exports = DeleteCOmmand;

