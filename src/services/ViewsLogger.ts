import { Logger } from "@/interfaces/Logger";
import { ViewCountLog } from "@/types/logger.types";
import { Files } from "./Files";

class ViewsLogger extends Logger {
  constructor(path: string) {
    super(path);
  }

  log({ ts, count }: ViewCountLog): void {
    const line = `${ts} ${count}\n`;
    this.writer?.write(line);
    this.writer?.flush();
  }

  async parseLogFile(): Promise<ViewCountLog[]> {
    const fileContents = await Files.read(this.path);
    const lines = fileContents.split("\n");
    return lines.map((line) => {
      const [ts, count] = line.split(" ");
      return { ts, count: parseInt(count) };
    });
  }
}

export { ViewsLogger };
