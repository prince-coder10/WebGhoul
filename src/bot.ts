import { Bot, Context } from "grammy";
import "dotenv/config";
import {
  conversations,
  type ConversationFlavor,
} from "@grammyjs/conversations";

// ConversationFlavor now requires a type argument
type MyContext = Context & ConversationFlavor<Context>;

const TOKEN = process.env.TG_BOT_TOKEN!;
if (!TOKEN) throw new Error("TG_BOT_TOKEN missing");

const bot = new Bot<MyContext>(TOKEN);

// must come before createConversation()
bot.use(conversations());

export default bot;

// async function clearUpdates() {
//   await bot.api.getUpdates({ offset: 0 }); // fetch and discard old updates
//   console.log("Cleared old updates.");
//   process.exit(0);
// }

// clearUpdates();
