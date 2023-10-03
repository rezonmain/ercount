import fs from "fs/promises";
import type {
  ChatterMessageLog,
  LoggerSuite,
  ViewCountLog,
} from "@/types/logger.types";
import { ChattersLogger } from "@/services/ChattersLogger";
import { MetaLogger } from "@/services/MetaLogger";
import { OutLogger } from "@/services/OutLogger";
import { ViewsLogger } from "@/services/ViewsLogger";
import type {
  ChattersStats,
  Tally,
  ViewCountStats,
} from "@/types/analytics.types";

class Helpers {
  static logger = {
    getAllLoggers: (base: string): LoggerSuite => ({
      out: new OutLogger(base),
      chatters: new ChattersLogger(base),
      views: new ViewsLogger(base),
      meta: new MetaLogger(base),
    }),
  };

  static time = {
    getDurationSeconds: ({
      init,
      end,
    }: {
      init: string;
      end: string;
    }): number => (new Date(end).getTime() - new Date(init).getTime()) / 1000,
  };

  static analytics = {
    getViewCount: (viewCountLogs: ViewCountLog[]): ViewCountStats => {
      const viewCounts = viewCountLogs.map((log) => log.count);
      return {
        max: Math.max(...viewCounts),
        min: Math.min(...viewCounts),
        avg: viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length,
      };
    },

    getChattersCount: (
      chatterMessages: ChatterMessageLog[]
    ): Omit<ChattersStats, "ratioOfTotalViewers"> => {
      return {
        unique: new Set(chatterMessages.map((log) => log.displayName)).size,
        totalChats: chatterMessages.length,
      };
    },

    getTally: (chatterMessages: ChatterMessageLog[]): Tally[] => {
      const tally: Tally[] = [];
      const chatters = new Set(chatterMessages.map((log) => log.displayName));

      chatters.forEach((chatter) => {
        const chats = chatterMessages.filter(
          (log) => log.displayName === chatter
        ).length;
        const ratioOfTotalChats = chats / chatterMessages.length;

        tally.push({
          displayName: chatter,
          chats,
          ratioOfTotalChats,
        });
      });

      return tally.sort((a, b) => b.chats - a.chats);
    },

    /**
     * Returns an array of ratios where the
     * last position
     * is the sum of all ratios,
     * each position in the array is the sum
     * of the ratios up to that position
     * @param sortedRatios must sum up to 1
     */
    getPositionalSumOfRatios: (sortedRatios: number[]): number[] => {
      const distribution: number[] = [];

      for (let i = 0; i < sortedRatios.length; i++) {
        if (i === 0) {
          distribution.push(sortedRatios[i]);
          continue;
        }
        const sum = sortedRatios[i] + distribution[i - 1];
        distribution.push(sum);
      }

      return distribution.map((d) => parseFloat(d.toFixed(6)));
    },
  };

  static file = {
    exists: async (path: string): Promise<boolean> =>
      await Bun.file(path).exists(),

    /**
     * Equivalent to `ls` in bash
     * @param path
     * @param filterOutList - list of files to filter out
     * @returns list of file names in the directory
     */
    ls: async (path: string, filterOutList: string[] = []): Promise<string[]> =>
      (await fs.readdir(path)).filter((f) => !filterOutList.includes(f)),

    /**
     * Read a text file
     * @param path
     * @returns Text content of the file
     */
    read: async (path: string): Promise<string> => {
      return await Bun.file(path).text();
    },

    write: async (path: string, content: string) => {
      Bun.write(path, content);
    },

    mkdir: async (path: string) => {
      await fs.mkdir(path, { recursive: true });
    },

    /**
     * Get a writer for a file for incremental writes
     * @param path
     * @returns A FileSink
     */
    getFileWriter: (path: string) => {
      return Bun.file(path).writer();
    },
  };

  static debug = {
    getLogEmoji: (type: "info" | "error" | "success" = "info"): string => {
      switch (type) {
        case "info":
          return "➡️";
        case "error":
          return "❌";
        case "success":
          return "✅";
        default:
          return "➡️";
      }
    },
  };
}

export { Helpers };
