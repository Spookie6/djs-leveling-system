const {
	Client,
	CommandInteraction,
	ApplicationCommandType,
} = require('discord.js');
const canvafy = require('canvafy');

const userSchema = require('./../../../database/models/users');

module.exports = {
	name: 'Rank',
	description: 'Returns user rank',
	cooldown: 5000,
	type: ApplicationCommandType.User,
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const foundUser = await userSchema.findOne({
			guildId: interaction.guild.id,
			userId: args[0],
		});

		const user = await interaction.guild.members.fetch(args[0]);

		if (user.user.bot)
			return interaction.followUp({
				content: `Bots don't count lol.`,
				ephemeral: true,
			});
		if (!foundUser)
			return interaction.followUp({
				content: 'User has not yet send any messages in this server.',
				ephemeral: true,
			});

		const allUsers = await userSchema.find({
			guildId: interaction.guild.id,
		});
		const sorted = allUsers.sort((a, b) => b.totalExp - a.totalExp);
		const rank = sorted.findIndex((x) => x.userId == user.id);

		const requiredExp =
			5 * Math.pow(foundUser.level, 2) + 50 * foundUser.level + 100;
		const rankCard = await new canvafy.Rank()
			.setAvatar(
				user.user.displayAvatarURL({
					forceStatic: true,
					extension: 'png',
				})
			)
			.setBackground(
				'image',
				foundUser.rankCardImage ||
					'https://media.discordapp.net/attachments/923888368025239562/1063832593084190881/2c68681f473d1e50b0a85f869341118704364fd9.png'
			)
			.setUsername(user.user.username)
			.setDiscriminator(user.user.discriminator)
			.setStatus(user.presence?.status || 'dnd')
			.setLevel(foundUser.level)
			.setRank(rank + 1)
			.setCurrentXp(foundUser.exp)
			.setRequiredXp(requiredExp)
			.build();

		interaction.followUp({
			files: [
				{
					attachment: rankCard.toBuffer(),
					name: `rank-${interaction.user.id}.png`,
				},
			],
		});
	},
};
