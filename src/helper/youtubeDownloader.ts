import { YtDlp } from "ytdlp-nodejs";
import { PassThrough } from "stream";

const ytdlp = new YtDlp();

export default async function downloadYtVideo(url: string): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = new PassThrough();

      // Start downloading with yt-dlp
      const child = ytdlp.exec(url, {
        format: "mp4",
        output: "-", // stdout
      });

      child.stdout.pipe(stream);

      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
