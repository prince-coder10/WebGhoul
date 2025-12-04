import "dotenv/config";
import express from "express";
import bot from "./bot.js"; // Your main bot instance
import { loadCommands } from "./utils/loadCommands.js";

console.log("Bot is starting...");

// --------------------
// Ping Server to keep Render free tier awake
// --------------------
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get("/", (_req, res) => {
//   res.send("Bot is alive! 🤖");
// });

// app.listen(PORT, () => {
//   console.log(`Ping server running on port ${PORT}`);
// });

// --------------------
// Telegram Bot
// --------------------
(async () => {
  try {
    // Load commands dynamically
    await loadCommands(bot);

    // Generic message listener
    bot.on("message", async (ctx) => {
      if (!ctx.message.text?.startsWith("/")) {
        await ctx.reply(
          "Welcome to WebGhoulBot 👋\nType /start to view all commands"
        );
      }
    });

    // Start the bot
    bot.start({
      onStart: (info) => console.log(`Bot running as @${info.username}`),
    });
  } catch (err) {
    console.error("Error starting bot:", err);
  }
})();

console.log("Node version:", process.version);
