const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
	PermissionsBitField,
} = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Returns websocket ping',
	cooldown: 5000, // 5 seconds
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		interaction.followUp({ content: `${client.ws.ping}ms!` });
	},
};
