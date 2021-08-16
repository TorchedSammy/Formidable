const Firework = require('@luvella/firework');

class DeleteCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
			name: 'delete'
		})
	}

	async run({msg, args}) {
		const m = await msg.channel.createMessage('Processing deletion from all category channels...')
		for (let i = args.length - 1; i >= 0; i--) {
			this.deleteEntry(args[i])
			m.edit({content: `${args.length === 1 ? 'Entry' : 'Entries'} ${args.join(', ')} ${args.length === 1 ? 'has' : 'have'} been deleted successfully.`})
		}
	}
	async deleteEntry(id) {
		const dbentry = await this.bot.db.get(id)
		const entry = JSON.parse(dbentry)
		const entryids = Object.values(entry.postids)
		for (let i = entryids.length - 1; i >= 0; i--) {
			const entrymsg = await this.bot.getMessage(entryids[i][0], entryids[i][1])
			entrymsg.delete()
		}

		await this.bot.db.del(id)
		this.bot.logger.debug('Removed entry', id, 'from database.')
	}
}

module.exports = DeleteCommand;

