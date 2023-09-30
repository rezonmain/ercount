import { Logger } from "@/interfaces/Logger";
import {
  ChatterMessageLog,
  OutFileSchema,
  ViewCountLog,
} from "@/types/logger.types";
import { Files } from "./Files";

class ChattersLogger extends Logger {
  constructor(path: string) {
    super(path);
  }

  log({ displayName, message, ts }: ChatterMessageLog): void {
    const line = `${ts} ${displayName}: ${message.replaceAll(" ", "")}\n`;
    this.writer?.write(line);
    this.writer?.flush();
  }

  async parseLogFile(): Promise<ChatterMessageLog[]> {
    const fileContents = await Files.read(this.path);
    const lines = fileContents.split("\n");
    return lines.map((line) => {
      const [ts, displayName, message] = line.split(" ");
      return { ts, displayName, message };
    });
  }
}

export { ChattersLogger };
