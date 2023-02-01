const { Events } = require('discord.js');
const client = require('./../index');
const voiceClient = require('./../Client/VoiceClient');
const schema = voiceClient.schemas.timer;
const settingsSchema = require('./../../database/models/settings');
const userSchema = require('./../../database/models/users');

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
	const guildSettings = await settingsSchema.findOne({
		guildId: newState.guild.id,
	});

	const foundUser = await userSchema.findOne({
		guildId: newState.guild.id,
		userId: newState.member.user.id,
	});
	const user = foundUser
		? foundUser
		: new userSchema({
				guildId: newState.guild.id,
				userId: newState.member.user.id,
		  });

	const foundVoiceTimer = await schema.findOne({
		Guild: newState.guild.id,
		User: newState.member.id,
	});

	if (oldState.channelId && newState.channelId) {
		foundVoiceTimer.Start = Date.now();
		foundVoiceTimer.save();
		addExp();
	}

	if (!newState.channelId) {
		if (!newState.guild || newState.member.user.bot) return;
		if (oldState.channel.id == newState.guild.afkChannel?.id) return;

		addExp();
	}

	voiceClient.startListener(oldState, newState);

	async function addExp() {
		let requiredExp = 5 * Math.pow(user.level, 2) + 50 * user.level + 100;
		let expValue = 0;
		const time = Date.now() - foundVoiceTimer.Start;
		const dividedTime = Math.floor(time / (1000 * 60 * 10));
		for (let i = 0; i < dividedTime; i++) {
			expValue += Math.floor(
				randomInt(15, 25) * guildSettings.expMultiplier
			);
		}

		user.totalExp += expValue;
		user.exp += expValue;

		while (user.exp >= requiredExp) {
			user.level++;
			user.exp = user.exp - requiredExp;
			requiredExp = 5 * Math.pow(user.level, 2) + 50 * user.level + 100;
			await levelupMessage();
		}
		user.save();
	}

	async function levelupMessage() {
		const channel = await newState.guild.channels.fetch(
			guildSettings.levelUpChannel ||
				oldState.channel.id ||
				newState.guild.systemChannel.id
		);
		console.log(newState.guild.systemChannel.id);
		if (!channel) return;

		let string = user.levelUpString || '';
		String.prototype.interpolate = function (params) {
			const names = Object.keys(params);
			const vals = Object.values(params);
			return new Function(...names, `return \`${this}\`;`)(...vals);
		};

		const User = user;
		User.tag = newState.member.user.tag;
		User.mention = `<@${newState.member.user.id}>`;

		const newString = string.interpolate({
			user: User,
			emoji: client.config.emojis,
		});

		channel
			.send(
				newString ||
					`${client.config.emojis.levelup} <@${newState.member.user.id}> has leveled up to level ${user.level} ${client.config.emojis.levelup}`
			)
			.catch();
	}

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});
