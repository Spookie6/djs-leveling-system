const { Schema, model } = require('mongoose');

module.exports = model(
	'users',
	new Schema({
		guildId: String,
		userId: String,
		rankCardImage: String,
		levelUpString: String,
		level: {
			type: Number,
			default: 0,
		},
		totalExp: {
			type: Number,
			default: 0,
		},
		exp: {
			type: Number,
			default: 0,
		},
		messageCount: {
			type: Number,
			default: 0,
		},
		createdAt: {
			type: Number,
			default: Date.now(),
		},
	})
);
