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
  const url = msg.message?.text ?? "";

  if (!url) return;
  if (url && !url.includes("tiktok")) {
    await ctx.reply(
      "Please provide a valid TikTok video URL. Example:\n https://www.tiktok.com/@username/video/123456 \n type /tiktok to restart"
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

  await ctx.reply(`Download complete ✅`);
}
