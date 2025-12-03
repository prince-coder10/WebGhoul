import { Bot, InlineKeyboard } from "grammy";

export default function startCommand(bot: Bot) {
  bot.command("start", async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text("📹 YouTube Downloader", "youtube_info")
      .row()
      .text("🎵 TikTok Downloader", "tiktok_info");

    await ctx.reply(
      `👋 Hello! Welcome to WebGhoul **Multipurpose Media Bot** 🎉

I can help you download videos from TikTok without watermark and YouTube quickly and easily. Tap a button below to see how it works:`,
      { reply_markup: keyboard, parse_mode: "Markdown" }
    );
  });

  // Handle button callbacks
  bot.callbackQuery("youtube_info", async (ctx) => {
    await ctx.answerCallbackQuery(); // Acknowledge button press
    await ctx.reply(`🎬 **YouTube Downloader**
- Command: /youtube
- Usage: Send a YouTube video link after the command to download it`);
  });

  bot.callbackQuery("tiktok_info", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(`🎵 **TikTok Downloader**
- Command: /tiktok
- Usage: Send a TikTok video link after the command to download it`);
  });
}
