import type { LoggerSuite } from "@/types/logger.types";
import { Helpers } from "./Helpers";
import type {
  ChattersStats,
  Tally,
  ViewCountStats,
} from "@/types/analytics.types";

class Analytics {
  private _durationSeconds = 0;
  private _viewCount: ViewCountStats = {
    max: 0,
    min: 0,
    avg: 0,
  };
  private _chatters: ChattersStats = {
    unique: 0,
    totalChats: 0,
    ratioOfTotalViewers: 1,
  };
  private _tally: Tally[] = [];
  private loggers?: LoggerSuite;
  done = false;

  constructor(private base: string = "default") {}

  async calculate(): Promise<void> {
    this.loggers = Helpers.logger.getAllLoggers(this.base);

    const { logTimes } = await this.loggers.meta.parseLogFile();
    const viewCountLogs = await this.loggers.views.parseLogFile();
    const chatterMessages = await this.loggers.chatters.parseLogFile();

    const durationSeconds = Helpers.time.getDurationSeconds(logTimes);

    const viewCount = Helpers.analytics.getViewCount(viewCountLogs);
    const chattersCount = Helpers.analytics.getChattersCount(chatterMessages);
    const tally = Helpers.analytics.getTally(chatterMessages, viewCount);

    this._durationSeconds = durationSeconds;
    this._viewCount = viewCount;
    this._chatters = {
      ...chattersCount,
      ratioOfTotalViewers: chattersCount.totalChats / viewCount.max,
    };
    this._tally = tally;
    this.done = true;
  }

  get durationSeconds() {
    return this._durationSeconds;
  }

  get viewCount() {
    return this._viewCount;
  }

  get chatters() {
    return this._chatters;
  }

  get tally() {
    return this._tally;
  }
}

export { Analytics };
