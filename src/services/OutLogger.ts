import { Logger } from "@/interfaces/Logger";
import { OutFileSchema } from "@/types/logger.types";
import { Files } from "./Files";

class OutLogger extends Logger {
  constructor(path: string) {
    super(path, true);
  }

  log({ viewerCounts, chatters, fileMeta }: OutFileSchema): void {
    Files.write(
      this.path,
      JSON.stringify(
        { fileMeta, viewerCounts, chatters },
        null,
        this.OUT_FILE_INDENT
      )
    );
  }

  async parseLogFile(): Promise<OutFileSchema[]> {
    const fileContents = await Files.read(this.path);
    return [JSON.parse(fileContents)];
  }
}

export { OutLogger };
