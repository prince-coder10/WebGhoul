import { Bot, Context } from "grammy";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { ConversationFlavor } from "@grammyjs/conversations";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(bot: Bot<ConversationFlavor<Context>>) {
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

  for (const file of commandFiles) {
    const { default: registerCommand } = await import(
      path.join(commandsPath, file)
    );
    if (typeof registerCommand === "function") {
      registerCommand(bot);
    }
  }
}
