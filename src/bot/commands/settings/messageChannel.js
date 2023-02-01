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
	name: 'levelupchannel-set',
	description: 'Sets the level up message channel',
	permissions: [PermissionsBitField.Flags.ManageGuild], // example on how to use permissions
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Channel,
			name: 'channel',
			description:
				'Channel to send the level up messages to (default to event channel)',
			required: false,
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

		const channel = args.length
			? (await interaction.guild.channels.fetch(args[0])).id
			: null;

		console.log(channel);
		guildSettings.levelUpChannel = channel;
		guildSettings.save();

		interaction.followUp(`Set level up message channel.`);
	},
};
