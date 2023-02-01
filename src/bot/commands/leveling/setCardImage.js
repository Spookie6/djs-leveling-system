const { default: axios } = require('axios');
const {
	ApplicationCommandType,
	ApplicationCommandOptionType,
	RequestMethod,
} = require('discord.js');

const userSchema = require('./../../../database/models/users');

module.exports = {
	name: 'set_card_image',
	description: 'Set your rank card image',
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'url',
			description: 'Url to set image to',
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		function isImgUrl(url) {
			return axios
				.get(url, { method: 'HEAD' })
				.then((res) => {
					return res.headers.get('Content-Type').startsWith('image');
				})
				.catch(() => {
					return false;
				});
		}

		const url = args[0].trim();
		const isValidImage = await Promise.resolve(isImgUrl(url));

		if (isValidImage) {
			const user = await userSchema.findOne({
				guildId: interaction.guild.id,
				userId: interaction.user.id,
			});
			user.rankCardImage = url;
			user.save();
			interaction.followUp(`Saved image!`);
		} else {
			interaction.followUp(`Invalid url!`);
		}
	},
};
