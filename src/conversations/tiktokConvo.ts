import type { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { type Context, InputFile } from "grammy";
import Tiktok from "@tobyg74/tiktok-api-dl";
import axios from "axios";

export async function askForTkLink(
  conversation: Conversation<Context>,
  ctx: Context
) {
  await ctx.reply(
    "Please type in the link of the video you want to download 🔗!"
  );

  const msg = await conversation.wait();
  const raw = (msg.message?.text ?? "").trim();
  if (!raw) return;

  // extract a URL-like substring if the user pasted extra text
  const urlMatch = raw.match(
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(vm\.tiktok\.com\/[^\s]+)|(m\.tiktok\.com\/[^\s]+)|(tiktok\.com\/[^\s]+)/i
  );
  let candidate = urlMatch ? urlMatch[0] : raw;
  // remove surrounding punctuation that users sometimes include
  candidate = candidate.replace(/^[<\("']+|[>\)\."']+$/g, "");

  // ensure the candidate has a scheme so URL() works
  const normalizedUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(candidate)
    ? candidate
    : `https://${candidate}`;

  const isTikTokUrl = (u: string) => {
    try {
      const parsed = new URL(u);
      const host = parsed.hostname.toLowerCase();
      // accept official domains and short-link hosts
      return (
        host === "tiktok.com" ||
        host.endsWith(".tiktok.com") || // covers www.tiktok.com, m.tiktok.com, vm.tiktok.com, etc.
        host.endsWith("tiktokcdn.com")
      );
    } catch {
      return false;
    }
  };

  if (!isTikTokUrl(normalizedUrl)) {
    await ctx.reply(
      "Please provide a valid TikTok video URL. Example:\nhttps://www.tiktok.com/@username/video/123456\nType /tiktok to restart."
    );
    return;
  }

  await ctx.reply("Please wait, your video is downloading ⏳!");

  try {
    const videoResponse = await Tiktok.Downloader(normalizedUrl, {
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

  await ctx.reply(`Download complete ✅`);
}
