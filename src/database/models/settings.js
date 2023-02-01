const { Schema, model } = require('mongoose');

module.exports = model(
	'settings',
	new Schema({
		guildId: String,
		levelUpChannel: String,
		rewards: {
			type: Array,
			default: [],
		},
		blacklistChannels: {
			type: Array,
			default: [],
		},
		blacklistRoles: {
			type: Array,
			default: [],
		},
		expCooldown: {
			type: Number,
			default: 60,
		},
		expMultiplier: {
			type: Number,
			default: 1,
		},
	})
);
