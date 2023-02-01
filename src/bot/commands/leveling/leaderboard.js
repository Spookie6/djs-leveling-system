const {
	ApplicationCommandType,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ComponentType,
	ButtonStyle,
} = require('discord.js');

const userSchema = require('./../../../database/models/users');

module.exports = {
	name: 'leaderboard',
	description: 'Displays the top 10 ranked users',
	cooldown: 10000,
	type: ApplicationCommandType.ChatInput,
	run: async (client, interaction, args) => {
		const allUsers = await userSchema.find({
			guildId: interaction.guild.id,
		});

		if (!allUsers.length)
			return interaction.followUp(`The leaderboard is empty!`);

		const sorted = allUsers.sort((a, b) => b.totalExp - a.totalExp);

		let page = 0;
		const amountOfPages = Math.ceil(sorted.length / 10);
		const pages = [];
		for (let i = 0; i < amountOfPages; i++) {
			const arr = sorted.slice(0 + i * 10, 10 + 10 * i);

			const pageData = arr.map((x, index) => {
				let data = `${index + 1 + 10 * i} <@${x.userId}> - level: ${
					x.level
				} - exp: ${x.exp}`;
				if (x.userId == interaction.user.id) data = `**${data}**`;
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
				.setTitle(`${interaction.guild.name} Leaderboard`)
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
