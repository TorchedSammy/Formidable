const Firework = require('@luvella/firework');
const nhentai = require('nhentai');
const fetch = require('node-fetch')
const { Command } = require('commander');
const nh = new nhentai.API();

class UploadCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
			name: 'upload'
		});
	}

	async run({msg, args, str}) {
		if(!args[0]) {
			msg.channel.createMessage('❌ Missing arguments.');
			return;
		}

		const program = new Command();

		program
  		  .option('-t, --tags <tags...>', 'specify numbers')
  		  .option('-s, --source <source>', 'specify letters');

		program.parse(['', '', ...args]);
		const m = await msg.channel.createMessage('Processing upload to channels...')

		const opts = program.opts();
		const arg = program.args[0];
		const digits = parseInt(arg);
		const id = this.bot.genID();
		let tags = opts.tags || []
		let source = opts.source
		let entries = {};
		let nhDoujin;

		if(!isNaN(digits) && opts.source == 'nh') {
			source = 'nhentai'
			nhDoujin = await nh.fetchDoujin(digits)
			tags.push(...nhDoujin.tags.all.map(t => t.name.replace(' ', '-').replace('big-breasts', 'big-boobs')))
		}

		const sourcechan = msg.channel.guild.channels.find(c => c.name === source)
		if(sourcechan) entries[source] = [sourcechan.id]

		for(let i = tags.length - 1; i >= 0; i--) {
			const tagchan = msg.channel.guild.channels.find(c => c.name === tags[i])
			if(!tagchan) continue;
			entries[tags[i]] = [tagchan.id]
		}
		// i need to store channel name, channel id and msg id
		// like: {'tag': [chanid, msgid]}
		if(msg.attachments[0]) {
			const r = await fetch(msg.attachments[0].url)
			//for (let i = channels.length - 1; i >= 0; i--) {
			//	this.bot.getChannel(channels[i]).sendMessage()
			//}
		} else {
			const thumb = await nhDoujin.thumbnail.fetch()
			const entryids = Object.values(entries)
			for (let i = entryids.length - 1; i >= 0; i--) {
				const tagchan = this.bot.getChannel(entryids[i][0])
				const m = await tagchan.createMessage(`
UID: **${id}**
Source: ${source || 'None provided'}
${nhDoujin.titles.pretty}
<${this.sourceSite(source, digits)}>
Tags/categories: ${entryids.map(idsarr => `<#${idsarr[0]}>`).join(' ')}
${tags.filter(t => t === 'certified').length !== 0 ? '\n🌟 Certified masterpiece.' : ''}`, {file: thumb, name: `thumb.${nhDoujin.thumbnail.extension}`})
				entries[tagchan.name][1] = m.id
			}
		}
		this.bot.logger.debug('Adding entry', id, 'to database. Entry channel data:\b\n', JSON.stringify(entries))
		await this.bot.db.put(id, JSON.stringify({postids: entries, source, digits}))
		m.edit({content: `✅ Posted to all channels! UID is **${id}**`})
	}

	sourceSite(source, id) {
		switch(source) {
			case 'nhentai':
				return `https://nhentai.net/g/${id}`
		}
	}

	// ill use this function when i need to replace more than 1 tag
	mapReplace(str, map) {
		const matchStr = Object.keys(map).join('|');
		if (!matchStr) return str;

		const regexp = new RegExp(matchStr, 'g');
		return str.replace(regexp, match => map[match]);
	}
}

module.exports = UploadCommand;
