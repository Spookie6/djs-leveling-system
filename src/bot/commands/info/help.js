const {
	Client,
	CommandInteraction,
	ActionRowBuilder,
	StringSelectMenuBuilder,
	ApplicationCommandType,
	EmbedBuilder,
	ComponentType,
} = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Sends the help menu',
	cooldown: 60000,
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const directories = [
			...new Set(client.slashCommands.map((cmd) => cmd.directory)),
		];

		function formatString(str) {
			return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
		}

		const categories = directories.map((dir) => {
			const getCommands = client.slashCommands
				.filter((cmd) => cmd.directory === dir)
				.map((cmd) => {
					return {
						name: cmd.name ? cmd.name : 'No command name!',
						description: cmd.description
							? cmd.description
							: 'No command description!',
					};
				});

			return {
				directory: formatString(dir),
				commands: getCommands,
			};
		});

		const embed = new EmbedBuilder()
			.setTitle(`${client.config.clientName || 'Bot'}'s Commands`)
			.setDescription(
				'Please choose one of the options in the dropdown below!'
			)
			.setColor(client.config.embedColor)
			.setAuthor({
				name:
					interaction.user.username +
					'#' +
					interaction.user.discriminator,
				iconURL: interaction.user.avatarURL(),
			})
			.setFooter({
				text: client.config.clientName,
				iconURL: client.config.clientAvatar,
			})
			.setTimestamp();

		const components = (state) => [
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('help-menu')
					.setPlaceholder('Please select a category!')
					.setDisabled(state)
					.addOptions(
						categories.map((cmd) => {
							return {
								label: `${cmd.directory}`,
								value: `${cmd.directory.toLowerCase()}`,
								description:
									`Commands from ` +
									`${cmd.directory}` +
									' category',
							};
						})
					)
			),
		];

		const inMessage = await interaction.followUp({
			embeds: [embed],
			components: components(false),
		});

		const collector = interaction.channel.createMessageComponentCollector({
			ComponentType: ComponentType.ActionRow,
			time: 60000,
		});

		console.log(await interaction.channel.messages.fetch(inMessage.id));

		collector.on('collect', (i) => {
			if (i.user.id !== interaction.user.id || i.customId !== 'help-menu')
				return;
			i.deferUpdate();

			const [directory] = i.values;
			const category = categories.find(
				(x) => x.directory.toLowerCase() === directory
			);

			const commandType = (cmd) =>
				cmd.type == ApplicationCommandType.User
					? ' [User Command]'
					: cmd.type == ApplicationCommandType.Message
					? ' [Message Command]'
					: '';
			const embed2 = embed
				.setTitle(
					`${directory.charAt(0).toUpperCase()}${directory
						.slice(1)
						.toLowerCase()}`
				)
				.setDescription(
					'' +
						category.commands
							.map(
								(cmd) =>
									`${
										cmd.guilds
											? cmd.guilds.includes(i.guild.id)
												? `\`${cmd.name}\`${commandType(
														cmd
												  )} (*${cmd.description}*)`
												: ``
											: `\`${cmd.name}\`${commandType(
													cmd
											  )} (*${cmd.description}*)`
									}`
							)
							.join('\n ') || 'No Commands'
				);

			inMessage.edit({ embeds: [embed2] });
		});

		collector.on('end', () => {
			inMessage.edit({ components: components(true) });
		});
	},
};
