const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
	InteractionCollector,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'blacklistedroles-add',
	description: 'Add a blacklisted role',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: 'role',
			description: 'Role to blacklist',
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

		const foundRole = guildSettings.blacklistRoles.includes(args[0]);
		if (foundRole)
			return interaction.followUp(`This role is already blacklisted!`);

		guildSettings.blacklistRoles = [
			...guildSettings.blacklistRoles,
			args[0],
		];

		guildSettings.save();

		interaction.followUp(`Blacklisted <@&${args[0]}>.`);
	},
};
