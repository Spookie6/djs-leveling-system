const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'rewards-remove',
	description: 'Remove a role reward',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: 'role',
			description: 'Role reward to remove',
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

		const foundReward = guildSettings.rewards.filter(
			(x) => x.roleId == args[0]
		);
		if (!foundReward.length)
			return interaction.followUp(`This reward doesn't exists!`);

		guildSettings.rewards = guildSettings.rewards.filter(
			(x) => x.roleId !== args[0]
		);

		guildSettings.save();

		interaction.followUp(`Removed role reward <@&${args[0]}>.`);
	},
};
