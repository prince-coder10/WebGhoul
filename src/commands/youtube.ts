import axios from "axios";
import { InputFile, type Bot, type Context } from "grammy";

export default function youtubeCommand(bot: Bot) {
  bot.command("youtube", async (ctx: Context) => {
    const msg = ctx.message?.text;
    if (!msg) return;

    const args = msg.split(" ").splice(1);
    const url = args[0];

    if (!url) {
      await ctx.reply(
        "Provide a YouTube URL, e.g.:\n/youtube https://youtu.be/xyz"
      );
      return;
    }

    await ctx.reply("Downloading your YouTube video… ⏳");

    try {
      // Call external downloader API
      const api = `https://api.akuari.my.id/downloader/ytmp4?link=${encodeURIComponent(
        url
      )}`;
      const res = await axios.get(api);

      if (!res.data?.url) {
        await ctx.reply("Failed to fetch download link. Try another URL.");
        return;
      }

      const downloadUrl = res.data.url;

      // Download the actual video file
      const videoFile = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(videoFile.data);

      if (buffer.length < 5000) {
        await ctx.reply(
          "❌ Failed to download the video (empty file). Try another link."
        );
        return;
      }

      await ctx.replyWithVideo(new InputFile(buffer, "youtube.mp4"));
    } catch (err) {
      console.error(err);
      await ctx.reply("❌ Error downloading video. The link may be invalid.");
    }
  });
}
