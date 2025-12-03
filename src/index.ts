import "dotenv/config";
import bot from "./bot.js";
import { loadCommands } from "./utils/loadCommands.js";

console.log("Bot is starting...");

(async () => {
  await loadCommands(bot);

  // Generic message listener
  bot.on("message", async (ctx) => {
    if (!ctx.message.text?.startsWith("/")) {
      await ctx.reply(
        "Welcome to WebGhoulBot 👋, \n type /start to view all commands "
      );
    }
  });

  bot.start({
    onStart: (info) => console.log(`Bot running as @${info.username}`),
  });
})();
