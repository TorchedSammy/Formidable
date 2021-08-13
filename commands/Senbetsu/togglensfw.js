const Firework = require('@luvella/firework');

class ToggleNSFWCommand extends Firework.Command {
	constructor(bot) {
		super(bot, {
			name: 'togglensfw',
			aliases: ['nsfwtog', 'tn']
		});
	}

	run({msg, args}) {
		for(let i = 0; i < msg.channelMentions.length; i++) {
			this.toggle(this.bot.getChannel(msg.channelMentions[i]))
		}
		msg.channel.createMessage(`Toggled NSFW for ${msg.channelMentions.length} channels.`)
	}

	toggle(channel) {
		const nsfwchan = channel.nsfw
		this.bot.logger.debug('togglensfw -', nsfwchan, channel.name)
		channel.edit({nsfw: !nsfwchan})
	}
}

module.exports = ToggleNSFWCommand;

