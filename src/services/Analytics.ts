import type { LoggerSuite } from "@/types/logger.types";
import { Helpers } from "./Helpers";

class Analytics {
  private _durationSeconds = 0;
  private _viewCount: Record<"max" | "min" | "avg", number> = {
    max: 0,
    min: 0,
    avg: 0,
  };
  private _chatters: Record<"unique" | "total", number> = {
    unique: 0,
    total: 0,
  };
  private _messages: Record<"total", number> = { total: 0 };
  private _tally?: Record<string, number> = {};
  private loggers?: LoggerSuite;
  done = false;

  constructor(private base: string = "default") {}

  async calculate(): Promise<void> {
    this.loggers = Helpers.logger.getAllLoggers(this.base);

    const { logTimes } = await this.loggers.meta.parseLogFile();
    console.log(logTimes);
    const viewCountLogs = await this.loggers.views.parseLogFile();
    const chatterMessages = await this.loggers.chatters.parseLogFile();

    const durationSeconds = Helpers.time.getDurationSeconds(logTimes);

    const tally = Helpers.analytics.getTally(chatterMessages);
    const messagesCount = { total: chatterMessages.length };
    const viewCount = Helpers.analytics.getViewCount(viewCountLogs);
    const chattersCount = Helpers.analytics.getChattersCount(chatterMessages);

    this._durationSeconds = durationSeconds;
    this._viewCount = viewCount;
    this._chatters = chattersCount;
    this._messages = messagesCount;
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

  get messages() {
    return this._messages;
  }

  get tally() {
    return this._tally;
  }
}

export { Analytics };
