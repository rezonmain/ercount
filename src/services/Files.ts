import fs from "fs/promises";

/**
 * Utility functions for file operations.
 */
export class Files {
  static async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Equivalent to `ls` in bash
   * @param path
   * @param filterOutList - list of files to filter out
   * @returns list of file names in the directory
   */
  static ls = async (
    path: string,
    filterOutList: string[] = []
  ): Promise<string[]> =>
    (await fs.readdir(path)).filter((f) => !filterOutList.includes(f));

  /**
   * Read a text file
   * @param path
   * @returns Text content of the file
   */
  static async read(path: string): Promise<string> {
    return await Bun.file(path).text();
  }

  static async write(path: string, content: string) {
    Bun.write(path, content);
  }

  static async mkdir(path: string) {
    await fs.mkdir(path, { recursive: true });
  }

  /**
   * Get a writer for a file for incremental writes
   * @param path
   * @returns A FileSink
   */
  static getFileWriter(path: string) {
    return Bun.file(path).writer();
  }
}
