import type {
  ChatterMessageLog,
  LoggerSuite,
  ViewCountLog,
} from "@/types/logger.types";
import { ChattersLogger } from "./ChattersLogger";
import { MetaLogger } from "./MetaLogger";
import { OutLogger } from "./OutLogger";
import { ViewsLogger } from "./ViewsLogger";
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
    ): Omit<ChattersStats, "ratioOfTotalViewers"> => {
      return {
        unique: new Set(chatterMessages.map((log) => log.displayName)).size,
        totalChats: chatterMessages.length,
      };
    },

    getTally: (
      chatterMessages: ChatterMessageLog[],
      viewCount: ViewCountStats
    ): Tally[] => {
      const tally: Tally[] = [];
      const chatters = new Set(chatterMessages.map((log) => log.displayName));

      chatters.forEach((chatter) => {
        const chats = chatterMessages.filter(
          (log) => log.displayName === chatter
        ).length;
        const ratioOfTotalChats = chats / chatterMessages.length;
        const ratioOfTotalViewers = chats / viewCount.max;

        tally.push({
          displayName: chatter,
          chats,
          ratioOfTotalChats,
          ratioOfTotalViewers,
        });
      });

      return tally.sort((a, b) => b.chats - a.chats);
    },
  };
}

export { Helpers };
