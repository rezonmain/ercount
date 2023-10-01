import type { LoggerSuite } from "@/types/logger.types";
import { Helpers } from "./Helpers";
import type {
  ChattersStats,
  DurationStats,
  EngagementStats,
  Tally,
  ViewCountStats,
} from "@/types/analytics.types";

class Analytics {
  private _duration: DurationStats = {
    durationInHours: 0,
    durationInSeconds: 0,
  };
  private _viewCountStats: ViewCountStats = {
    max: 0,
    min: 0,
    avg: 0,
  };
  private _chattersStats: ChattersStats = {
    unique: 0,
    totalChats: 0,
  };
  private _engagement: EngagementStats = {
    engagement: 0,
    engagementPerHour: 0,
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

    const durationInSeconds = Helpers.time.getDurationSeconds(logTimes);
    const durationInHours = durationInSeconds / 3600;

    const viewCountStats = Helpers.analytics.getViewCount(viewCountLogs);
    const chattersStats = Helpers.analytics.getChattersCount(chatterMessages);
    const tally = Helpers.analytics.getTally(chatterMessages);

    const engagement = chattersStats.unique / viewCountStats.avg;
    const engagementPerHour = engagement / durationInHours;

    this._duration = {
      durationInHours,
      durationInSeconds,
    };
    this._viewCountStats = viewCountStats;
    this._chattersStats = chattersStats;
    this._tally = tally;
    this._engagement = {
      engagement,
      engagementPerHour,
    };
    this.done = true;
  }

  get duration() {
    return this._duration;
  }

  get views() {
    return this._viewCountStats;
  }

  get chatters() {
    return this._chattersStats;
  }

  get tally() {
    return this._tally;
  }

  get engagement() {
    return this._engagement;
  }
}

export { Analytics };
