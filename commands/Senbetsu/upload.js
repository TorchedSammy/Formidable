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
		const program = new Command();

		program
  		  .option('-t, --tags <tags...>', 'specify numbers')
  		  .option('-s, --source <source>', 'specify letters');

		console.log(args)
		program.parse(['', '', ...args]);
		const m = await msg.channel.createMessage('Processing upload to channels...')

		const opts = program.opts();
		const arg = program.args[0];
		const digits = parseInt(arg);
		const id = this.bot.genID();
		let tags = opts.tags || []
		let source = opts.source
		let channels = [];
		let nhDoujin;

		if(!isNaN(digits) && opts.source == 'nh') {
			source = 'nhentai'
			nhDoujin = await nh.fetchDoujin(digits)
			tags.push(...nhDoujin.tags.getByType('tag').map(t => t.name.replace(' ', '_')))
		}

		const sourcechan = msg.channel.guild.channels.find(c => c.name === source)
		if(sourcechan) channels.push(sourcechan.id)

		for(let i = tags.length - 1; i >= 0; i--) {
			const tagchan = msg.channel.guild.channels.find(c => c.name === tags[i])
			if(!tagchan) continue;
			channels.push(tagchan.id)
		}
		// i need to store channel name, channel id and msg id
		// like: {channels: {'tag': [chanid, msgid]}}
		await this.bot.db.put(id, JSON.stringify({channels}))
		if(msg.attachments[0]) {
			const r = await fetch(msg.attachments[0].url)
			//for (let i = channels.length - 1; i >= 0; i--) {
			//	this.bot.getChannel(channels[i]).sendMessage()
			//}
		} else {
			const thumb = await nhDoujin.thumbnail.fetch()
			for (let i = channels.length - 1; i >= 0; i--) {
				this.bot.getChannel(channels[i]).createMessage(`
UID (for Senbetsu post idenification): **${id}**
Source: ${source || 'None provided'}
${nhDoujin.titles.pretty}
<${this.sourceSite(source, digits)}>
Tags/categories: ${channels.map(id => `<#${id}>`).join(' ')}`, {file: thumb, name: `thumb.${nhDoujin.thumbnail.extension}`})
			}
		}
		m.edit({content: `✅ Posted to all channels! UID is **${id}**`})
	}

	sourceSite(source, id) {
		switch(source) {
			case 'nhentai':
				return `https://nhentai.net/g/${id}`
		}
	}
}

module.exports = UploadCommand;
