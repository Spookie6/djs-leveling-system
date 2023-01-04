const { glob } = require('glob');
const { promisify } = require('util');
const { Client, ApplicationCommandType } = require('discord.js');
const mongoose = require('mongoose');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
  eventFiles.map((value) => require(value));

  // Slash Commands
  const slashCommands = await globPromise(
    `${process.cwd()}/commands/*/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    if (!file?.name) return;
    const splitted = value.split('/');
    const directory = splitted[splitted.length - 2];
    const properties = { directory, ...file };
    client.slashCommands.set(file.name, properties);

    if ([ApplicationCommandType.Message, ApplicationCommandType.User].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });

  client.on('ready', async () => {
    client.config.clientAvatar = client.config.clientAvatar ||
      `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`

    // Set bot activity and status
    client.user.setPresence({
      activities: [{
        name: client.config.acitivityName,
        type: client.config.activityType,
      }],
      status: client.config.activityStatus,
    });


    // Register for a single guild
    await client.guilds.cache
      .get(client.config.testServerId)
      .commands.set(arrayOfSlashCommands);

    // Register for all the guilds the bot is in
    // await client.application.commands.set(arrayOfSlashCommands);
  });

  // mongoose
  const { mongooseConnectionString } = client.config;
  if (!mongooseConnectionString) return;

  mongoose
    .connect(mongooseConnectionString)
    .then(() => console.log('Connected to mongodb'));
};