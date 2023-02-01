const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
} = require('discord.js');
const voiceClient = require('../../Client/VoiceClient');
const ms = require('ms');

module.exports = {
	name: 'vc_time',
	description: 'Returns your vc time',
	type: ApplicationCommandType.ChatInput,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const userVoiceData = await voiceClient.getUserData(
			interaction.guild,
			interaction.user
		);

		const content = userVoiceData
			? `You have spent ${ms(userVoiceData.Time, {
					long: true,
			  })} in voice chats!`
			: `You haven't spent any time in voice chats :(`;
		interaction.followUp({ content });
	},
};
