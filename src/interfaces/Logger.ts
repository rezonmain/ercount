import type { FileSink } from "bun";
import type { LogTypes } from "@/types/logger.types";
import { Files } from "@/services/Files";

abstract class Logger {
  private LOG_FILE_DIR = "./data";
  protected OUT_FILE_INDENT = 2;
  protected logFileExtension: string;
  protected writer: FileSink | undefined;
  protected path;
  protected base;

  constructor({
    base,
    logFileExtension,
    omitWriter = false,
  }: {
    base: string;
    logFileExtension: string;
    omitWriter?: boolean;
  }) {
    this.base = base;
    this.logFileExtension = logFileExtension;
    this.path = this.getFilePath();
    this.writer = omitWriter ? undefined : Files.getFileWriter(this.path);
  }

  protected getFilePath = (): string =>
    `${this.LOG_FILE_DIR}/${this.base}${this.logFileExtension}`;

  /**
   * Close the file writer
   */
  end = () => this.writer?.end();

  /**
   * Parses the payload and writes it to the file
   * @param payload - The data to log
   */
  abstract log(payload: LogTypes): void;
}

export { Logger };
