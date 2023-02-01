const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'edit-multiplier',
	description: 'Edit the exp multiplier',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Number,
			name: 'value',
			description: 'Value to change multiplier to.',
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

		console.log(!args[0]);
		if (!args[0] || args[0] <= 0)
			return interaction.followUp(`Multiplier can't be a negative value`);

		guildSettings.expMultiplier = args[0];
		guildSettings.save();

		interaction.followUp(`Changed multiplier to ${args[0]}.`);
	},
};
