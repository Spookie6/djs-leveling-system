const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
	InteractionCollector,
} = require('discord.js');

const settingsSchema = require('../../../database/models/settings');
const userSchema = require('./../../../database/models/users');

module.exports = {
	name: 'rewards-add',
	description: 'Add a role reward',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: 'role',
			description: 'Role to award',
			required: true,
		},
		{
			type: ApplicationCommandOptionType.Number,
			name: 'level',
			description: 'Level to give reward at',
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
		if (foundReward.length)
			return interaction.followUp(`This reward already exists!`);

		const role = await interaction.guild.roles.fetch(args[0]);
		const clientUser = await interaction.guild.members.fetch(
			client.user.id
		);

		const roles = clientUser._roles.map(async (x) => {
			const role = await interaction.guild.roles.fetch(x);
			return role.position;
		});
		const Roles = await Promise.all(roles);
		Roles.sort((a, b) => b - a);

		if (role.position >= Roles[0])
			return interaction.followUp(
				`I don't have the permissions to add this role. Make sure my highest role is above the reward role.`
			);
		if (args[1] <= 0)
			return interaction.followUp(`Level can't be a negative number!`);

		guildSettings.rewards = [
			...guildSettings.rewards,
			{
				roleId: args[0],
				level: args[1],
			},
		];

		guildSettings.save();

		const guildUsers = await userSchema.find({
			guildId: interaction.guild.id,
		});

		guildUsers.forEach(async (user) => {
			if (user.level >= args[1]) {
				const role = await interaction.options.getRole(args[0]);
				const member = await interaction.options.getMember(user.userId);
				member.roles.add(role);
			}
		});

		interaction.followUp(
			`Created role reward <@&${args[0]}> at level ${args[1]}.`
		);
	},
};
