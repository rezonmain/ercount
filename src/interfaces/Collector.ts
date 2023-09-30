import {
  ChatterMessageLog,
  TimesLog,
  ViewCountLog,
} from "@/types/logger.types.js";
import { ChattersLogger } from "@/services/ChattersLogger";
import { OutLogger } from "@/services/OutLogger";
import { ViewsLogger } from "@/services/ViewsLogger";

abstract class Collector {
  private OUT_FILE_DIR = "./data";
  private CHATTER_LOG_EXT = "chatters.log";
  private VIEW_COUNT_LOG_EXT = "views.log";
  private OUT_FILE_EXT = "json";
  private VIEW_COUNT_SAMPLE_RATE = 1000 * 60 * 5; // 5 minutes
  protected logTimes: TimesLog = { init: new Date(), end: new Date() };
  protected loggers?: {
    out: OutLogger;
    chatters: ChattersLogger;
    views: ViewsLogger;
  };

  constructor(protected channelName: string) {}

  abstract _start(): void;
  abstract getCurrentViewerCount(): Promise<ViewCountLog>;
  abstract onChatterMessage(chatter: ChatterMessageLog): void;
  abstract getStreamTitle(): Promise<number>;

  start(): void {
    this.logTimes.init = new Date();

    const logFilePaths = this.getLogFilePaths({
      base: `${this.channelName}_${this.logTimes.init.toISOString()}`,
    });

    this.loggers = {
      out: new OutLogger(logFilePaths.out),
      chatters: new ChattersLogger(logFilePaths.chatters),
      views: new ViewsLogger(logFilePaths.views),
    };

    this._start();
  }

  async stop() {
    this.logTimes.end = new Date();
    this.loggers?.out.log({
      fileMeta: {
        channelName: this.channelName,
        logTimes: this.logTimes,
        viewerCountSampleIntervalMs: this.VIEW_COUNT_SAMPLE_RATE,
      },
      viewerCounts: await this.loggers.views.parseLogFile(),
      chatters: await this.loggers.chatters.parseLogFile(),
    });
    Object.values(this.loggers!).forEach((logger) => logger.end());
  }

  private getLogFilePaths = ({ base }: { base: string }) => ({
    out: `${this.OUT_FILE_DIR}/${base}.${this.OUT_FILE_EXT}`,
    chatters: `${this.OUT_FILE_DIR}/${base}.${this.CHATTER_LOG_EXT}`,
    views: `${this.OUT_FILE_DIR}/${base}.${this.VIEW_COUNT_LOG_EXT}`,
  });
}

export { Collector };
