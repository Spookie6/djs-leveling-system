const { VoiceClient } = require('djs-voice');
const client = require('../index');

// Setting up voice client
const voiceClient = new VoiceClient({
	allowBots: false,
	debug: true,
	mongooseConnectionString: client.config.mongooseConnectionString,
	client,
});

module.exports = voiceClient;
