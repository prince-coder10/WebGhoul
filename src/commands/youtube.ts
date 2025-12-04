import downloadYtVideo from "../helper/youtubeDownloader.js";
import { InputFile, type Bot, type Context } from "grammy";

export default function youtubeCommand(bot: Bot) {
  bot.command("youtube", async (ctx: Context) => {
    const msg = ctx.message?.text;
    if (!msg) return;

    const args = msg.split(" ").splice(1);
    const url = args[0];

    if (!url) {
      await ctx.reply(
        "Please provide a YouTube video URL. Example:\n/youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      );
      return;
    }

    await ctx.reply("Please wait, your video is downloading ⏳!");

    try {
      // Download video as a buffer
      const buffer = await downloadYtVideo(url);

      if (!buffer) {
        await ctx.reply("Failed to download the video. Try another URL.");
        return;
      }

      const file = new InputFile(buffer, "youtube_video.mp4");

      await ctx.replyWithVideo(file);
    } catch (error) {
      console.error(error);
      await ctx.reply(
        "Failed to download the video. YouTube may have changed their system or the URL is invalid."
      );
    }
  });
}

//comment
