const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Invite info',
	cooldown: 5000, // 5 seconds
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const dmUrl = 'https://discordapp.com/users/629727156938997760';

		const embed = new EmbedBuilder()
			.setTitle(`Invite Info`)
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
			.setDescription(`The bot isn't public due to ram limits. However if you want to add the bot to your server, shoot me (Enrico#4371) a dm and I'll add you as an app tester, meaning you are able to add the bot to other servers.
      \n**Note, this is no garuntee since the ram might have met its limits already.**`);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Open DM')
				.setURL(dmUrl)
				.setStyle(ButtonStyle.Link)
		);

		interaction.followUp({ embeds: [embed], components: [row] });
	},
};
