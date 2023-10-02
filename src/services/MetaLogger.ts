import { Logger } from "@/interfaces/Logger";
import type { FileMeta } from "@/types/logger.types";
import { Helpers } from "@/services/Helpers";

class MetaLogger extends Logger {
  constructor(base: string) {
    super({ base, logFileExtension: ".meta.json", omitWriter: true });
  }

  log(meta: FileMeta): void {
    Helpers.file.write(
      this.path,
      JSON.stringify(meta, null, this.OUT_FILE_INDENT)
    );
  }

  async parseLogFile(): Promise<FileMeta> {
    const fileContents = await Helpers.file.read(this.path);
    return JSON.parse(fileContents);
  }
}

export { MetaLogger };
