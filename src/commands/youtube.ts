import { InputFile, type Bot, type Context } from "grammy";
// @ts-ignore: missing type declarations for y2mate-dl
import yt from "@vreden/youtube_scraper";
import axios from "axios";

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
      const video = await yt.ytmp4(url, 360);
      console.log(video);
      const videoUrl = video.download.url;
      const fileName = video.filename;
      console.log(videoUrl);

      // download video
      const response = await axios.get(videoUrl, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data);

      const file = new InputFile(buffer, fileName);

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
