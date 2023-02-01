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
	name: 'blacklistedroles-remove',
	description: 'Remove a blacklisted role',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: 'role',
			description: 'Role to remove from blacklist',
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
		if (!foundRole)
			return interaction.followUp(`This role isn't blacklisted!`);

		guildSettings.blacklistRoles = guildSettings.blacklistRoles.filter(
			(x) => x !== args[0]
		);

		guildSettings.save();

		interaction.followUp(
			`Removed <@&${args[0]}> from the blacklisted roles.`
		);
	},
};
