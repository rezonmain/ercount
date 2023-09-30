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
  static ls = async (
    path: string,
    filterOutList: string[] = []
  ): Promise<string[]> =>
    (await fs.readdir(path)).filter((f) => !filterOutList.includes(f));

  static async read(path: string): Promise<string> {
    return await Bun.file(path).text();
  }

  static async write(path: string, content: string) {
    Bun.write(path, content);
  }

  static async mkdir(path: string) {
    await fs.mkdir(path, { recursive: true });
  }

  static getFileWriter(path: string) {
    return Bun.file(path).writer();
  }
}
