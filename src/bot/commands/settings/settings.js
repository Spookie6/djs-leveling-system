const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	EmbedBuilder,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require('discord.js');
const ms = require('ms');

const settingsSchema = require('../../../database/models/settings');

module.exports = {
	name: 'settings',
	description: 'Settings overview',
	permissions: [PermissionFlagsBits.ManageGuild],
	cooldown: 60000,
	type: ApplicationCommandType.ChatInput,
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
		const arrow = client.config.emojis.arrowRight;

		const embed = new EmbedBuilder()
			.setTitle(
				`${client.config.emojis.info}  Guild settings for ${interaction.guild.name}`
			)
			.setColor(client.config.embedColor)
			.setAuthor({
				name: `${interaction.user.username}#${interaction.user.discriminator}`,
				iconURL: interaction.user.avatarURL(),
			})
			.setFooter({
				text: `${client.config.clientName} • page 1/2`,
				iconURL: client.config.clientAvatar,
			})
			.setTimestamp()
			.setThumbnail(interaction.guild.iconURL())
			.setDescription(
				[
					`**Level-up Message Channel**`,
					`${arrow} ${
						guildSettings.levelUpChannel
							? `<#${guildSettings.levelUpChannel}>`
							: 'Event channel'
					}\n`,
					`**Exp Multiplier**`,
					`${arrow} x${guildSettings.expMultiplier}\n`,
					`**Exp Cooldown**`,
					`${arrow} ${ms(guildSettings.expCooldown * 1000, {
						long: true,
					})}\n`,
					`**Blacklisted Roles**`,
					`${arrow} ${
						guildSettings.blacklistRoles.length
							? guildSettings.blacklistRoles
									.map((x) => `<@&${x}>`)
									.join(', ')
							: 'No blacklisted roles'
					}\n`,
					`**Blacklisted Channels**`,
					`${arrow} ${
						guildSettings.blacklistChannels.length
							? guildSettings.blacklistChannels
									.map((x) => `<#${x}>`)
									.join(', ')
							: 'No blacklisted channels'
					}`,
				].join('\n')
			);

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
					.setEmoji(arrow.match(/[0-9]{19}/g)[0])
			),
		];

		const msg = await interaction.followUp({
			embeds: [embed],
			components: components(true, false),
		});

		const filter = (x) =>
			x.message.id == msg.id && x.user.id == interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			ComponentType: ComponentType.ActionRow,
			time: 60000,
		});

		collector.on('collect', (i) => {
			switch (i.customId) {
				case 'previous':
					i.deferUpdate();
					msg.edit({
						embeds: [embed],
						components: components(true, false),
					});
					break;
				case 'next':
					i.deferUpdate();
					const rewards = guildSettings.rewards.length
						? guildSettings.rewards.sort(
								(a, b) => b.level - a.level
						  )
						: null;
					const embed2 = new EmbedBuilder()
						.setTitle(
							`${client.config.emojis.info}  Guild settings for ${interaction.guild.name}`
						)
						.setColor(client.config.embedColor)
						.setAuthor({
							name: `${interaction.user.username}#${interaction.user.discriminator}`,
							iconURL: interaction.user.avatarURL(),
						})
						.setFooter({
							text: `${client.config.clientName} • page 2/2`,
							iconURL: client.config.clientAvatar,
						})
						.setTimestamp()
						.setThumbnail(interaction.guild.iconURL())
						.setDescription(
							`**Role Rewards**
              ${
					rewards
						? rewards
								.map(
									(x) =>
										`*Level* \`${x.level}\`: <@&${x.roleId}>`
								)
								.join('\n')
						: 'No role rewards. Use </rewards_add:1065641394636603450> to add a reward.'
				}
                `
						);
					msg.edit({
						embeds: [embed2],
						components: components(false, true),
					});
			}
		});

		collector.on('end', () => {
			msg.edit({ components: [] });
		});
	},
};
