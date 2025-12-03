import { Bot } from "grammy";
import "dotenv/config";

const BOT_TOKEN = process.env.TG_BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error("TG_BOT_TOKEN not set");

// Export as default so we can import it in index.ts
const bot = new Bot(BOT_TOKEN);

// async function clearUpdates() {
//   await bot.api.getUpdates({ offset: 0 }); // fetch and discard old updates
//   console.log("Cleared old updates.");
//   process.exit(0);
// }

// clearUpdates();

export default bot;
