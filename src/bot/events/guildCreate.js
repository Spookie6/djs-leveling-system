const { Events } = require('discord.js');
const client = require('../index');
const settingsSchema = require('./../../database/models/settings');

client.on(Events.GuildCreate, async (guild) => {
	await new settingsSchema({
		guildId: guild.id,
	}).save();
});
