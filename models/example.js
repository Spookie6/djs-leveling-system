const { Schema, model } = require('mongoose');

module.exports = model(
  'collection_name',
  new Schema({
    guildId: String,
    channelId: String,
    timestamp: {
      type: Number,
      default: () => Date.now(),
    },
    date: {
      type: String,
      default: () => new Date().toDateString(),
    },
  })
);
