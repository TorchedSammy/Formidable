const Firework = require('@luvella/firework');
const nhentai = require('nhentai');
const nh = new nhentai.API();

class ReadyEvent extends Firework.Event {
	constructor(bot) {
		super(bot, {name: 'ready'})
	}

	async run() {
		this.bot.logger.log('I am online!')
		this.syncNHentai()
		setInterval(() => this.syncNHentai(), 300000)
	}

	// Posts new nhentai doujinshi to #nhentai-unfiltered
	// It's basically a hentai feed in discord!
	async syncNHentai() {
		const homepage = await nh.fetchHomepage()
		const ids = homepage.doujins.map(d => d.id)
		try {
			const lastid = await this.bot.db.get('__nh-last')
		} catch {
			this.bot.db.put('__nh-last', ids[0])
		}

		const lastid = await this.bot.db.get('__nh-last')
		if(lastid < ids[0]) {
			let latestid;
			for (let i = (ids[0] - lastid) - 1; i >= 0; i--) {
				const doujin = homepage.doujins.filter(d => d.id === ids[i])[0]
				const thumb = await doujin.thumbnail.fetch()
				this.bot.getChannel('876621266784772096').createMessage(`
Source: nhentai
${doujin.titles.pretty}
<${this.sourceSite('nhentai', ids[i])}>`, {file: thumb, name: `thumb.${doujin.thumbnail.extension}`})
				latestid = ids[i]
			}
			this.bot.db.put('__nh-last', latestid)
			this.bot.logger.debug(`Synced ${ids[0] - lastid} nhentai doujinshi!`)
		}
	}

	sourceSite(source, id) {
		switch(source) {
			case 'nhentai':
				return `https://nhentai.net/g/${id}`
		}
	}
}

module.exports = ReadyEvent;

