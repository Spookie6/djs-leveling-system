const {
	ApplicationCommandType,
	EmbedBuilder,
	ApplicationCommandOptionType,
} = require('discord.js');

const userSchema = require('./../../../database/models/users');

module.exports = {
	name: 'levelup_message',
	description: 'Levelup message commands',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'info',
			description: 'Information about string variables',
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'set',
			description: 'Set your level up message',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'string',
					description: 'Message string',
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, args) => {
		const subCommandName = interaction.options._subcommand;
		console.log(subCommandName);
		if (subCommandName == 'info') {
			const embed = new EmbedBuilder()
				.setTitle(`Level up message variables`)
				.setColor(client.config.embedColor)
				.setAuthor({
					name: `${interaction.user.username}#${interaction.user.discriminator}`,
					iconURL: interaction.user.avatarURL(),
				})
				.setFooter({
					text: `${client.config.clientName}`,
					iconURL: client.config.clientAvatar,
				})
				.setTimestamp()
				.setDescription(
					[
						`**Variables**`,
						`${client.config.emojis.arrowRight} \`\${user.tag}\` *example*: ${interaction.user.tag}`,
						`${client.config.emojis.arrowRight} \`\${user.mention}\` *example*: <@${interaction.user.id}>`,
						`${client.config.emojis.arrowRight} \`\${user.level}\` *example*: 10`,
						`${client.config.emojis.arrowRight} \`\${user.exp}\` *example*: 10`,
						`${client.config.emojis.arrowRight} \`\${emoji.levelup}\` *example*: ${client.config.emojis.levelup}`,
						`**Templates**`,
						`${client.config.emojis.arrowRight} \`\${emoji.levelup} \${user.metion} had leveled up to level \${user.level} \${emoji.levelup}\``,
						`${client.config.emojis.levelup} <@${interaction.user.id}> has leveled up to level 10 ${client.config.emojis.levelup}`,
						`${client.config.emojis.arrowRight} \`GG! \${user.tag} has leveled up to level \${user.level} and has \${user.exp} exp!\``,
						`GG! ${interaction.user.tag} has leveled up to level 10 and has 10 exp!`,
					].join('\n')
				);

			interaction.followUp({ embeds: [embed] });
		}

		if (subCommandName == 'set') {
			const foundUser = await userSchema.findOne({
				guildId: interaction.guild.id,
				userId: interaction.user.id,
			});
			const user =
				foundUser ||
				new userSchema({
					guildId: interaction.guild.id,
					userId: interaction.user.id,
				});

			const string = interaction.options?._hoistedOptions[0].value;
			user.levelUpString = string;
			user.save();
			interaction.followUp(`Set level up string!`);
		}
	},
};
