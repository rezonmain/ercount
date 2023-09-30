import { Logger } from "@/interfaces/Logger";
import type { ChatterMessageLog } from "@/types/logger.types";
import { Files } from "@/services/Files";

class ChattersLogger extends Logger {
  constructor(base: string) {
    super({ base, logFileExtension: ".chatters.log" });
  }

  log({ displayName, message, ts }: ChatterMessageLog): void {
    const line = `${ts} ${displayName} ${message}\n`;
    this.writer?.write(line);
    this.writer?.flush();
  }

  async parseLogFile(): Promise<ChatterMessageLog[]> {
    const fileContents = await Files.read(this.path);
    const lines = fileContents.trim().split("\n");
    return lines.map((line) => {
      const [ts, displayName, ...message] = line.split(" ");
      return { ts, displayName, message: message.join(" ") };
    });
  }
}

export { ChattersLogger };
