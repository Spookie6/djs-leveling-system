const { Events, MessageMentions, UserFlags } = require('discord.js');
const client = require('./../index');

const settingsSchema = require('./../../database/models/settings');
const userSchema = require('./../../database/models/users');

client.on(Events.MessageCreate, async (message) => {
	// Leveling system
	if (!message.guild || message.author.bot) return;

	const guildSettings = await settingsSchema.findOne({
		guildId: message.guild.id,
	});

	const author = await message.guild.members.fetch(message.author.id);
	const filteredRoles = guildSettings.blacklistRoles.filter((x) =>
		author._roles.includes(x)
	);

	if (
		filteredRoles.length ||
		guildSettings.blacklistChannels.includes(message.channel.id)
	)
		return;

	// Checking cooldowns
	const kvKey = `exp_${message.guild.id}_${message.author.id}`;
	if (client.cooldowns.has(kvKey)) return;
	if (guildSettings.expCooldown) {
		client.cooldowns.set(
			kvKey,
			Date.now() + guildSettings.expCooldown * 1000
		);
		setTimeout(() => {
			client.cooldowns.delete(kvKey);
		}, guildSettings.expCooldown * 1000);
	}

	const foundUser = await userSchema.findOne({
		guildId: message.guild.id,
		userId: message.author.id,
	});
	const user = foundUser
		? foundUser
		: new userSchema({
				guildId: message.guild.id,
				userId: message.author.id,
		  });

	await addExp(); // Adding exp

	async function addExp() {
		let requiredExp = 5 * Math.pow(user.level, 2) + 50 * user.level + 100;
		const expValue = Math.floor(
			randomInt(15, 25) * guildSettings.expMultiplier
		);

		user.totalExp += expValue;
		user.exp += expValue;
		user.messageCount++;

		while (user.exp >= requiredExp) {
			user.level++;
			user.exp = user.exp - requiredExp;
			requiredExp = 5 * Math.pow(user.level, 2) + 50 * user.level + 100;
			await levelupMessage();
		}
		user.save();
	}

	async function levelupMessage() {
		const channel = await message.guild.channels.fetch(
			guildSettings.levelUpChannel || message.channel.id
		);
		let string = user.levelUpString || '';
		String.prototype.interpolate = function (params) {
			const names = Object.keys(params);
			const vals = Object.values(params);
			return new Function(...names, `return \`${this}\`;`)(...vals);
		};
		const User = user;
		User.tag = author.user.tag;
		User.mention = `<@${author.user.id}>`;

		const newString = string.interpolate({
			user: User,
			emoji: client.config.emojis,
		});

		channel.send(
			newString ||
				`${client.config.emojis.levelup} <@${author.id}> has leveled up to level ${user.level} ${client.config.emojis.levelup}`
		);
	}

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});
