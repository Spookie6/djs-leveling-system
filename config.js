const { ActivityType } = require('discord.js');
require('./handler/index')

module.exports = () => {
	return {
		token: 'BOT_TOKEN', // Discord bot token. Aquired on https://discord.com/developers/applications
		mongooseConnectionString: 'MONGOOSE_CONNECTION_URI',
		embedColor: 0xffffff, // The color of the embeds. 0x{hex_code}
		testServerId: 'SERVER_ID',
		developers: ['YOUR_ID'],
		clientName: 'Cool Bot',
		clientAvatar: ``, // Change this to any icon you want. The default is the bot's current avatar icon (./handler/index line:35)
		acitivityName: 'Epic Activity',
		activityType: ActivityType.Watching,
		activityStatus: 'online'
	}
}
