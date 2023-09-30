import { Logger } from "@/interfaces/Logger";
import { FileMeta } from "@/types/logger.types";
import { Files } from "@/services/Files";

class MetaLogger extends Logger {
  constructor(path: string) {
    super(path);
  }

  log(meta: FileMeta): void {
    this.writer?.write(JSON.stringify(meta, null, this.OUT_FILE_INDENT));
    this.writer?.flush();
  }

  async parseLogFile(): Promise<FileMeta> {
    const fileContents = await Files.read(this.path);
    return JSON.parse(fileContents);
  }
}

export { MetaLogger };
