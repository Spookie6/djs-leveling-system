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
	name: 'edit-cooldown',
	description: 'Edit the exp earn cooldown',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Number,
			name: 'value',
			description: 'Value to change cooldown to (in seconds).',
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

		if (!args[0] || args[0] <= 0)
			return interaction.followUp(`Cooldown can't be a negative value`);

		guildSettings.expCooldown = args[0];
		guildSettings.save();

		interaction.followUp(`Changed cooldown to ${args[0]}.`);
	},
};
