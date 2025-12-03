import Tiktok from "@tobyg74/tiktok-api-dl";
import axios from "axios";
import { InputFile, type Bot, type Context } from "grammy";

export default function tiktokCommand(bot: Bot) {
  bot.command("tiktok", async (ctx: Context) => {
    const msg = ctx.message?.text;
    if (!msg) return;

    const args = msg.split(" ").splice(1);
    const url = args[0];

    if (!url) {
      await ctx.reply(
        "Please provide a TikTok video URL. Example:\n/tiktok https://www.tiktok.com/@username/video/123456"
      );
      return;
    }

    await ctx.reply("Please wait, your video is downloading ⏳!");

    try {
      const videoResponse = await Tiktok.Downloader(url, {
        version: "v3",
      });
      const videoUrl = videoResponse.result?.videoSD;
      if (!videoUrl) return;
      // download video
      const response = await axios.get(videoUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data);

      // wrap buffer in InputFile

      const file = new InputFile(buffer, "tiktok_vid.mp4");

      // send to telegram
      await ctx.replyWithVideo(file);
    } catch (error) {
      console.log(error);
      console.log(error);
      await ctx.reply(
        "Failed to download the video. Make sure the URL is correct."
      );
    }
  });
}
