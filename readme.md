# Discord.js@v14 Leveling System

## Setup

`npm install` - install all required dependencies

`node index.js` - start the project

Fill in the config.js file.

`activityType` can be `ActivityType.watching`, `ActivityType.listening` and `ActivityType.competing`,
`activityStatus` can be `online`, `invisible`, `idle` and `dnd`.

## Example
```js
const { ActivityType } = require('discord.js');
require('./src/bot/handler/index');

module.exports = () => {
	return {
		token: '', // Discord bot token. Aquired on https://discord.com/developers/applications
		mongooseConnectionString:
			'',
		embedColor: 0x2f3136, // The color of the embeds. 0x{hex_code}
		testServerId: '',
		developers: [''],
		clientName: 'Bot',
		clientAvatar: ``, // Change this to any icon you want. The default is the bot's current avatar icon (./handler/index line:35)
		acitivityName: 'your messages!',
		activityType: ActivityType.Watching,
		activityStatus: 'online',
		emojis: {
			levelup: ``,
			info: ``,
			space: ``,
			arrowRight: ``,
			arrowLeft: ``,
			doubleLeftArrow: ``,
			doubleRightArrow: ``,
		},
	};
};
```

## Features

- Exp gane (vc included)
- Multi Guild
- Flexible