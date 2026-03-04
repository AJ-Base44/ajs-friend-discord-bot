const { Client, GatewayIntentBits } = require("discord.js");
const { createClient } = require("@base44/sdk");

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const BASE44_APP_ID = process.env.BASE44_APP_ID;
const BASE44_SERVICE_TOKEN = process.env.BASE44_SERVICE_TOKEN;
const BASE44_API_URL = process.env.BASE44_API_URL || "https://app.base44.com";
const CHANNEL_ID = "1472657978594431008"; // #💬-chat in SeeByond
const BOT_ID = "1478813832477671457";

// One conversation per Discord user (keyed by Discord user ID)
const conversations = {};

const base44 = createClient({
  appId: BASE44_APP_ID,
  token: BASE44_SERVICE_TOKEN,
  serverUrl: BASE44_API_URL,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.channelId !== CHANNEL_ID) return;
  if (message.author.bot) return;

  const userMessage = message.content;
  const username = message.author.username;
  const userId = message.author.id;

  console.log(`📨 ${username}: ${userMessage}`);

  await message.channel.sendTyping();

  try {
    // Get or create a conversation for this Discord user
    let convId = conversations[userId];
    if (!convId) {
      const conv = await base44.asServiceRole.agents.createConversation("AJ's Friend", {
        metadata: { discord_user: username, discord_user_id: userId },
      });
      convId = conv.id;
      conversations[userId] = convId;
      console.log(`🆕 Created conversation ${convId} for ${username}`);
    }

    // Send the message and get AI response
    const result = await base44.asServiceRole.agents.addMessage(convId, {
      role: "user",
      content: `[Discord user: ${username}] ${userMessage}`,
    });

    // Get the latest assistant message
    const messages = result.messages || [];
    const assistantMsg = messages.filter(m => m.role === "assistant").pop();
    const reply = assistantMsg?.content || "Sorry, I couldn't get a response right now.";

    // Discord has a 2000 char limit
    const trimmed = typeof reply === "string" ? reply.slice(0, 1999) : JSON.stringify(reply).slice(0, 1999);
    await message.reply(trimmed);
    console.log(`✅ Replied to ${username}`);
  } catch (err) {
    console.error("Error:", err);
    await message.reply("Something went wrong, try again in a sec!");
  }
});

client.login(DISCORD_TOKEN);
