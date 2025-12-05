import { Bot, Context } from "grammy";
import {
  createConversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import { askForTkLink } from "../conversations/tiktokConvo.js";

export default function tiktokCommand(bot: Bot<ConversationFlavor<Context>>) {
  bot.use(createConversation(askForTkLink));
  bot.command("tiktok", async (ctx) => {
    await ctx.conversation.enter("askForTkLink");
  });
}
