const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	ApplicationCommandOptionType,
} = require('discord.js');

module.exports = {
	name: 'change_color',
	description: 'Change your role color.',
	guilds: ['1039978912110874624'],
	cooldown: 5000, // 5 seconds
	options: [
		{
			name: 'hex_code',
			type: ApplicationCommandOptionType.String,
			description: 'Hex code eg `#ff00ff`',
			required: true,
		},
	],
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const ColorCodeInput = args[0].slice(1);

		if (!ColorCodeInput.match(/[0-9A-Fa-f]{6}/g))
			return interaction.followUp({
				content: `Bruh, \`${args[0]}\` isn't a hex code!`,
				ephemeral: true,
			});

		const member = await interaction.guild.members.fetch(
			interaction.user.id
		);
		const role = await Promise.all(
			member._roles.map(async (el) => {
				const Role = await interaction.guild.roles.fetch(el);
				if (!!Role.color) return Role;
			})
		);

		if (!role.length) {
			guild.roles
				.create({
					name: interaction.user.username,
					color: parseInt(ColorCodeInput, 16),
				})
				.then((role) => {
					interaction.user.roles
						.add(role)
						.catch(() =>
							interaction.followUp(
								`Something went wrong, I might not have the permissions to create or add roles.\nComplain to leguchi.`
							)
						);
					interaction.followUp(
						`Created role: <@&${role.id}> and given it to ya!`
					);
				});
		}

		if (role.length) {
			interaction.guild.roles
				.edit(role[0].id, { color: parseInt(ColorCodeInput, 16) })
				.then(() =>
					interaction.followUp('Successfully changed role color!')
				)
				.catch(() =>
					interaction.followUp(
						`Something went wrong, I might not have the permissions to create or add roles.\nComplain to leguchi.`
					)
				);
		}
	},
};
