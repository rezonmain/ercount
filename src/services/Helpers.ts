import type {
  ChatterMessageLog,
  LoggerSuite,
  ViewCountLog,
} from "@/types/logger.types";
import { ChattersLogger } from "./ChattersLogger";
import { MetaLogger } from "./MetaLogger";
import { OutLogger } from "./OutLogger";
import { ViewsLogger } from "./ViewsLogger";

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
    getViewCount: (
      viewCountLogs: ViewCountLog[]
    ): Record<"max" | "min" | "avg", number> => {
      const viewCounts = viewCountLogs.map((log) => log.count);
      return {
        max: Math.max(...viewCounts),
        min: Math.min(...viewCounts),
        avg: viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length,
      };
    },

    getChattersCount: (
      chatterMessages: ChatterMessageLog[]
    ): Record<"unique" | "total", number> => {
      return {
        unique: new Set(chatterMessages.map((log) => log.displayName)).size,
        total: chatterMessages.length,
      };
    },

    getTally: (chatterMessages: ChatterMessageLog[]): Record<string, number> =>
      chatterMessages.reduce((acc, curr) => {
        if (acc[curr.displayName]) {
          acc[curr.displayName] += 1;
        } else {
          acc[curr.displayName] = 1;
        }
        return acc;
      }, {} as Record<string, number>),
  };
}

export { Helpers };
