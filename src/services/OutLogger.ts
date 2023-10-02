import { Logger } from "@/interfaces/Logger";
import type { OutFileSchema } from "@/types/logger.types";
import { Helpers } from "@/services/Helpers";

class OutLogger extends Logger {
  constructor(base: string) {
    super({ base, logFileExtension: ".out.json", omitWriter: true });
  }

  log(outFile: OutFileSchema): void {
    Helpers.file.write(
      this.path,
      JSON.stringify(outFile, null, this.OUT_FILE_INDENT)
    );
  }

  async parseLogFile(): Promise<OutFileSchema> {
    const fileContents = await Helpers.file.read(this.path);
    return JSON.parse(fileContents);
  }
}

export { OutLogger };
