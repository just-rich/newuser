const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events } = require('discord.js');
const cron = require('node-cron');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  checkRoles();
  setInterval(checkRoles, config.checkInterval);

  // Schedule the daily message at the specified time every day
  const [hour, minute] = config.dailyMessageTime.split(':');
  cron.schedule(`${minute} ${hour} * * *`, () => {
    sendDailyMessage();
  }, {
    timezone: "Etc/UTC"
  });
});

client.on('guildMemberAdd', (member) => {
  setTimeout(() => {
    if (member.roles.cache.has(config.roleId)) {
      member.roles.remove(config.roleId).catch(console.error);
    }
  }, 3 * 24 * 60 * 60 * 1000); // 3 days
});

async function checkRoles() {
  const guilds = client.guilds.cache;
  for (const [guildId, guild] of guilds) {
    const role = guild.roles.cache.get(config.roleId);
    if (!role) continue;

    const members = await guild.members.fetch();
    const now = Date.now();

    members.forEach(member => {
      if (member.roles.cache.has(config.roleId)) {
        const roleAssignedDate = member.joinedTimestamp || now;
        if (now - roleAssignedDate >= 3 * 24 * 60 * 60 * 1000) { // 3 days
          member.roles.remove(config.roleId).catch(console.error);
        }
      }
    });
  }
}

async function sendDailyMessage() {
  const channel = await client.channels.fetch(config.channelId);
  if (channel.isTextBased()) {
    // Delete the previous message if it exists
    if (config.lastMessageId) {
      try {
        const lastMessage = await channel.messages.fetch(config.lastMessageId);
        if (lastMessage) {
          await lastMessage.delete();
        }
      } catch (error) {
        console.error('Failed to delete the previous message:', error);
      }
    }

    // Create a button
    const button = new ButtonBuilder()
      .setCustomId('remove-role-button')
      .setLabel("I already know, don't remind me again!")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(button);

    // Send the new daily message with the button
    try {
      const newMessage = await channel.send({
        content: config.dailyMessage,
        components: [row]
      });

      // Update config.json with the new message ID
      config.lastMessageId = newMessage.id;
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Failed to send the daily message:', error);
    }
  }
}

// Handle button interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'remove-role-button') {
    const role = interaction.guild.roles.cache.get(config.roleId);
    if (role && interaction.member.roles.cache.has(config.roleId)) {
      try {
        await interaction.member.roles.remove(role);
        await interaction.reply({ content: 'Role removed successfully!', ephemeral: true });
      } catch (error) {
        console.error('Failed to remove role:', error);
        await interaction.reply({ content: 'Failed to remove role. Please try again later.', ephemeral: true });
      }
    } else {
      await interaction.reply({ content: 'You do not have the role to remove.', ephemeral: true });
    }
  }
});

client.login(config.token);