const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
} = require('discord.js');

module.exports = {
	name: 'shutdown',
	description: 'Shuts down the bot',
	cooldown: 5000, // 5 seconds
	developerOnly: true,
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		try {
			interaction.followUp('Shutting down...').then(() => {
				process.exit();
			});
		} catch (err) {
			interaction.followUp('Something went wrong.');
		}
	},
};
