const { ActivityType } = require('discord.js');
require('./src/bot/handler/index');

module.exports = () => {
	return {
		token: 'OTQ4MzMxMjQ2MzUyNzU2ODA2.GBm1v_.a2UihjFy_vQ_PeQ7_tGUp1HrIrbiwYI0j5VGFM', // Discord bot token. Aquired on https://discord.com/developers/applications
		mongooseConnectionString:
			'mongodb+srv://Rico:ACJDzNoJX03KlzLF@rico.qhad0.mongodb.net/level-up?authSource=admin&replicaSet=atlas-p1wmbp-shard-0&readPreference=primary&ssl=true',
		embedColor: 0x2f3136, // The color of the embeds. 0x{hex_code}
		testServerId: '869287677558673408',
		developers: ['629727156938997760'],
		clientName: 'Level Up',
		clientAvatar: ``, // Change this to any icon you want. The default is the bot's current avatar icon (./handler/index line:35)
		acitivityName: 'your messages!',
		activityType: ActivityType.Watching,
		activityStatus: 'online',
		emojis: {
			levelup: `<:levelup:1063747857007513601>`,
			info: `<:info:1063859810723966997>`,
			space: `<:space:961324719305523210>`,
			arrowRight: `<:arrowRight:1063857510227910676>`,
			arrowLeft: `<:arrowLeft:1063881417269973092>`,
			doubleLeftArrow: `1063879472404762674`,
			doubleRightArrow: `1063879440419000441`,
		},
	};
};
