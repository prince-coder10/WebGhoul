import { Bot } from "grammy";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(bot: Bot) {
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
