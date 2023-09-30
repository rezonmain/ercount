import { Logger } from "@/interfaces/Logger";
import type { FileMeta } from "@/types/logger.types";
import { Files } from "@/services/Files";

class MetaLogger extends Logger {
  constructor(base: string) {
    super({ base, logFileExtension: ".meta.json", omitWriter: true });
  }

  log(meta: FileMeta): void {
    Files.write(this.path, JSON.stringify(meta, null, this.OUT_FILE_INDENT));
  }

  async parseLogFile(): Promise<FileMeta> {
    const fileContents = await Files.read(this.path);
    return JSON.parse(fileContents);
  }
}

export { MetaLogger };
