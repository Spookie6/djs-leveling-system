const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'blacklistedchannels-add',
	description: 'Add a blacklisted channel',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Channel,
			name: 'channel',
			description: 'Channel to blacklist',
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const guildSettings = await settingsSchema.findOne({
			guildId: interaction.guild.id,
		});

		const foundChannel = guildSettings.blacklistChannels.includes(args[0]);
		if (foundChannel)
			return interaction.followUp(`This channel is already blacklisted!`);

		const channel = await interaction.guild.channels.fetch(args[0]);
		if (![4, 0].includes(channel.type))
			return interaction.followUp(
				`Only text channels or categories can be blacklisted!`
			);
		let channels;
		if (channel.type == 4) {
			const guildChannels = await interaction.guild.channels.fetch();
			const filteredChannels = guildChannels.filter(
				(x) => x.parentId == channel.id
			);
			channels = filteredChannels.map((x) => x.id);
		} else {
			channels = channel.id;
		}

		const blacklistChannels = [
			...guildSettings.blacklistChannels,
			channels,
		].flat();

		guildSettings.blacklistChannels = [...new Set(blacklistChannels)];

		console.log(guildSettings.blacklistChannels);
		guildSettings.save();

		interaction.followUp(
			`Blacklisted ${
				channel.type == 4
					? `all channels from the ${channel.name} category.`
					: `<#${channel.id}>`
			}`
		);
	},
};
