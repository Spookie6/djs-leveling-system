Skip to content
Search or jump to…
Pull requests
Issues
Codespaces
Marketplace
Explore
 
@Spookie6 
Spookie6
/
djs-handler
Public
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
djs-handler/readme.md
@Spookie6
Spookie6 Update readme.md
Latest commit 9aac4fc on Apr 11, 2022
 History
 1 contributor
30 lines (18 sloc)  835 Bytes

# Handler for discord.js version 13

## Credits

Credit where credit's due.

The base structure for this handler was a handler made by [reconlx](https://github.com/reconlx/djs-base-handler).

---

## Setup

`npm install` - install all required dependencies

`node index.js` - start the project

Fill in the config.js file.

`activityType` can be `ActivityType.watching`, `ActivityType.listening` and `ActivityType.competing`,
`activityStatus` can be `online`, `invisible`, `idle` and `dnd`.

## Notes

If you're using replit, make a global variable (secret) for the token, reples are public unless you have premium.

## Features

- Cooldowns, You can add cooldowns to commands (measured in milliseconds).
- Permissions, Makes it so only users with permissions can use the command (measured in arrays).
- Dev only, if set to true only the developers can use the command.
- Disable, the option to disable commands.
- Shutdown command, shuts down the bot.