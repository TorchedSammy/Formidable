const Firework = require('@luvella/firework');

class DeleteCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
			name: 'delete'
		})
	}

	async run({msg, args}) {
		const dbentry = await this.bot.db.get(args[0])
		const entry = JSON.parse(dbentry)
		const entryids = Object.values(entry.postids)
		const id = args[0]
		const m = await msg.channel.createMessage('Processing deletion from all category channels...')
		for (let i = entryids.length - 1; i >= 0; i--) {
			const entrymsg = await this.bot.getMessage(entryids[i][0], entryids[i][1])
			entrymsg.delete()
		}

		await this.bot.db.del(id)
		this.bot.logger.debug('Removed entry', id, 'from database.')
		m.edit({content: `Entry ${id} has been deleted successfully.`})
	}
}

module.exports = DeleteCommand;

