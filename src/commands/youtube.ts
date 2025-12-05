import { Bot, Context } from "grammy";
import {
  createConversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import { askForYtLink } from "../conversations/youtubeConvo.js";

export default function youtubeCommand(bot: Bot<ConversationFlavor<Context>>) {
  bot.use(createConversation(askForYtLink));
  bot.command("youtube", async (ctx) => {
    await ctx.conversation.enter("askForYtLink");
  });
}
