const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'blacklistedchannels-remove',
	description: 'Remove a blacklisted channel',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Channel,
			name: 'channel',
			description: 'Channel to remove from blacklist',
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

		const channel = await interaction.guild.channels.fetch(args[0]);

		const foundChannel = guildSettings.blacklistChannels.includes(args[0]);
		if (!foundChannel && !foundChannel.type == 0)
			return interaction.followUp(`This channel isn't blacklisted!`);

		let channels;
		if (channel.type == 4) {
			const guildChannels = await interaction.guild.channels.fetch();
			const filteredChannels = guildChannels.filter(
				(x) => x.parentId == channel.id
			);
			channels = filteredChannels.map((x) => x.id);
		} else {
			channels = [channel.id];
		}

		guildSettings.blacklistChannels =
			guildSettings.blacklistChannels.filter(
				(x) => !channels.includes(x)
			);

		console.log(guildSettings.blacklistChannels);
		guildSettings.save();

		interaction.followUp(
			`Removed ${
				channel.type == 4
					? `all channels in the ${channel.name} category`
					: `<#${channel.id}>`
			} from the blacklisted channels.`
		);
	},
};
