import { Logger } from "@/interfaces/Logger";
import type { ViewCountLog } from "@/types/logger.types";
import { Files } from "@/services/Files";

class ViewsLogger extends Logger {
  constructor(base: string) {
    super({ base, logFileExtension: ".views.log" });
  }

  log({ ts, count }: ViewCountLog): void {
    const line = `${ts} ${count}\n`;
    this.writer?.write(line);
    this.writer?.flush();
  }

  async parseLogFile(): Promise<ViewCountLog[]> {
    const fileContents = await Files.read(this.path);
    const lines = fileContents.trim().split("\n");
    return lines.map((line) => {
      const [ts, count] = line.split(" ");
      return { ts, count: parseInt(count) };
    });
  }
}

export { ViewsLogger };
