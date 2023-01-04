const { Client, Collection } = require('discord.js');

const client = new Client({
  intents: 32767,
});
module.exports = client;

// Global Variables
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.config = require('./config')();

// Initializing the project
require('./handler')(client);

client.login(client.config.token || process.env.TOKEN);
