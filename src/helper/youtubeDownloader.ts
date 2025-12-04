import { YtDlp } from "ytdlp-nodejs";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const ytdlp = new YtDlp();

export default async function downloadYtVideo(url: string): Promise<Buffer> {
  const tempFile = join(tmpdir(), `video_${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    const child = ytdlp.exec(url, { format: "mp4", output: tempFile });
    child.on("error", (err) => reject(err));
    child.on("close", async (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}`));
      }
      try {
        const buffer = await fs.readFile(tempFile);
        await fs.unlink(tempFile); // clean up
        resolve(buffer);
      } catch (err) {
        reject(err);
      }
    });
  });
}
