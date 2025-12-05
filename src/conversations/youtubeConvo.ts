import { InputFile, type Context } from "grammy";
// @ts-ignore: missing type declarations for y2mate-dl
import yt from "@vreden/youtube_scraper";
import axios from "axios";
import type { Conversation } from "@grammyjs/conversations";

export async function askForYtLink(
  conversation: Conversation<Context>,
  ctx: Context
) {
  await ctx.reply(
    "Please type in the link of the video you want to download 🔗!"
  );

  const msg = await conversation.wait();
  const text = (msg.message?.text ?? "").trim();

  if (!text) return;

  // extract first URL-like substring if user pasted extra text
  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  const candidate = urlMatch ? urlMatch[0] : text;

  // helper to validate common YouTube host patterns (allows youtu.be short links)
  const isYouTubeUrl = (u: string) => {
    try {
      const parsed = new URL(u);
      const host = parsed.hostname.toLowerCase();
      return (
        host === "youtu.be" ||
        host.endsWith("youtube.com") ||
        host.endsWith("youtube-nocookie.com")
      );
    } catch {
      return false;
    }
  };

  if (!isYouTubeUrl(candidate)) {
    await ctx.reply(
      "Please provide a valid YouTube video URL. Example:\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\nType /youtube to restart."
    );
    return;
  }

  await ctx.reply("Please wait, your video is downloading ⏳!");

  try {
    const video = await yt.ytmp4(candidate, 360);
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
  await ctx.reply(`Download complete ✅`);
}
