import { FileSink } from "bun";
import { LogTypes } from "@/types/logger.types";
import { Files } from "@/services/Files";

abstract class Logger {
  protected OUT_FILE_INDENT = 2;
  protected writer: FileSink | undefined;

  constructor(protected path: string, omitWriter = false) {
    this.writer = omitWriter ? undefined : Files.getFileWriter(path);
  }

  end = () => this.writer?.end();

  abstract log(payload: LogTypes): void;
}

export { Logger };
