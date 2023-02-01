const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ComponentType,
	ButtonStyle,
} = require('discord.js');
const voiceClient = require('../../Client/VoiceClient');
const ms = require('ms');

module.exports = {
	name: 'vc_leaderboard',
	description: 'Returns vc leaderboard',
	cooldown: 5000, // 5 seconds
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const allUsers = await voiceClient.sortUsers(interaction.guild);

		if (!allUsers.length)
			return interaction.followUp(`The leaderboard is empty!`);

		let page = 0;
		const amountOfPages = Math.ceil(allUsers.length / 10);
		const pages = [];
		for (let i = 0; i < amountOfPages; i++) {
			const arr = allUsers.slice(0 + i * 10, 10 + 10 * i);

			// const pageData = arr.map((x, index) => );
			const pageData = arr.map((x, index) => {
				let data = `${index + 1 + 10 * i} <@${x.User}> - ${ms(x.Time, {
					long: true,
				})}`;
				if (x.User == interaction.user.id) data = `**${data}**`;
				return data;
			});
			pages.push(pageData);
		}

		const components = (state1, state2) => [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('previous')
					.setDisabled(state1)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(
						client.config.emojis.arrowLeft.match(/[0-9]{19}/g)[0]
					),
				new ButtonBuilder()
					.setCustomId('next')
					.setDisabled(state2)
					.setStyle(ButtonStyle.Secondary)
					.setEmoji(
						client.config.emojis.arrowRight.match(/[0-9]{19}/g)[0]
					)
			),
		];

		let msg;
		const embed = async (state = null) => {
			const Embed = new EmbedBuilder()
				.setTitle(`${interaction.guild.name} Voice Leaderboard`)
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
				.setDescription(pages[page].join('\n'));

			if (!msg) {
				msg = await interaction.followUp({
					embeds: [Embed],
					components: components(
						state || page == 0,
						state || page + 1 == amountOfPages
					),
				});
			} else
				msg.edit({
					embeds: [Embed],
					components: components(
						state || page == 0,
						state || page + 1 == amountOfPages
					),
				});
		};

		embed();

		const filter = (i) =>
			i.message.id == msg.id && i.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({
			time: 60000,
			ComponentType: ComponentType.Button,
			filter,
		});

		collector.on('collect', (i) => {
			if (i.customId == 'previous') {
				i.deferUpdate();
				page--;
				embed();
			}
			if (i.customId == 'next') {
				i.deferUpdate();
				page++;
				embed();
			}
		});

		collector.on('end', () => {
			embed(true);
		});
	},
};
