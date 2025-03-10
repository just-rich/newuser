# New User: Discord Role Removal and Daily Message Bot

## Overview

This is a simple Discord bot that performs two main functions:
1. Automatically removes a specified role from users after they have had it for 3 days or after 3 days of joining the server.
2. Sends a daily message to a specified channel at a specified time.

## Features

1. **Role Removal**: The bot checks all users in the server and removes a specific role if they have had it for 3 days or more.
2. **Daily Reminder Message**: The bot sends a daily reminder message to a specified channel at a specified time. It also deletes the previous day's message before sending a new one.

## How It Works

### Role Removal

- The bot periodically checks all users in the server who have the specified role.
- If a user has had the role for 3 days or more, the bot removes the role from the user.
- When a new user joins the server, the bot sets a timeout to remove the role after 3 days if the user still has it.

### Daily Reminder Message

- The bot sends a daily message to a specified channel at a specified time.
- Before sending the new message, it deletes the message it sent the previous day.
- The message content and the channel ID are specified in the `config.json` file.

## Configuration (`config.json`)

The bot is configured using a `config.json` file, rename `config.json.example` to it. Below is an example of the `config.json` file and an explanation of each field:

```json
{
  "token": "discord_bot_token_here",
  "roleId": "134862535106809449",
  "checkInterval": 3600000, // 1 hour in milliseconds
  "channelId": "872294229240598548",
  "dailyMessage": "Hey <@&134862535106809449>! Just a friendly reminder, **BEWARE of scammers & impersonators** in your friend requests & DMs! Our team will **__never__** send you a friend request or DM you first. Please protect yourself! Learn about our scam prevention guidelines here https://discord.com/channels/872241427063668767/1181602885650370615/1181602941380075600",
  "lastMessageId": null,
  "dailyMessageTime": "07:00" // Time in HH:MM format (24-hour clock, UTC)
}
```

### Fields

- `token`: Your Discord bot token. Replace `discord_bot_token_here` with your actual bot token.
- `roleId`: The ID of the role that should be removed after 3 days.
- `checkInterval`: The interval at which the bot checks for users with the role. Specified in milliseconds (3600000 ms = 1 hour).
- `channelId`: The ID of the channel where the daily message should be sent.
- `dailyMessage`: The content of the daily message.
- `lastMessageId`: **Do not change this.** The ID of the last message sent by the bot. This is used to delete the previous day's message before sending a new one.
- `dailyMessageTime`: The time at which the daily message should be sent. Specified in `HH:MM` format (24-hour clock, UTC).

## Installation and Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/just-rich/newuser.git
   cd newuser
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure the bot**:
   - Open the `config.json` file and update the fields with your bot token, role ID, channel ID, and desired message content and time.

4. **Run the bot**:
   ```sh
   npm start
   ```

## Usage

- The bot will automatically start checking for users with the specified role and remove it if they have had it for 3 days or more.
- The bot will send a daily message to the specified channel at the configured time and delete the previous day's message before sending a new one.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

slapped together by [rich](https://richw.xyz) for [NVSTly](https://nvstly.com)'s Discord [community](https://nvstly.com/go/discord)
