import {
  ChatterMessageLog,
  TimesLog,
  ViewCountLog,
} from "@/types/logger.types.js";
import { ChattersLogger } from "@/services/ChattersLogger";
import { OutLogger } from "@/services/OutLogger";
import { ViewsLogger } from "@/services/ViewsLogger";
import { MetaLogger } from "@/services/MetaLogger";

abstract class Collector {
  private OUT_FILE_DIR = "./data";
  private CHATTER_LOG_EXT = "chatters.log";
  private VIEW_COUNT_LOG_EXT = "views.log";
  private OUT_FILE_EXT = "json";
  private META_FILE_EXT = "meta.json";
  private VIEW_COUNT_SAMPLE_RATE = 1000 * 60 * 5; // 5 minutes
  protected logTimes: TimesLog = { init: new Date(), end: new Date() };
  protected loggers?: {
    out: OutLogger;
    chatters: ChattersLogger;
    views: ViewsLogger;
    meta: MetaLogger;
  };
  stats = {
    viewerCount: 0,
    streamTitle: "",
    lastMessage: {
      displayName: "",
      message: "",
      ts: "",
    },
  };

  constructor(protected channelName: string) {}

  abstract _start(): void;
  abstract _stop(): void;
  abstract getCurrentViewerCount(): Promise<ViewCountLog>;
  abstract getStreamTitle(): Promise<string>;

  start(): void {
    this.logTimes.init = new Date();

    const logFilePaths = this.getLogFilePaths({
      base: `${this.channelName}_${this.logTimes.init.toISOString()}`,
    });

    this.loggers = {
      out: new OutLogger(logFilePaths.out),
      chatters: new ChattersLogger(logFilePaths.chatters),
      views: new ViewsLogger(logFilePaths.views),
      meta: new MetaLogger(logFilePaths.out),
    };

    this._start();
  }

  async stop() {
    this.logTimes.end = new Date();
    this.loggers?.out.log({
      fileMeta: await this.loggers.meta.parseLogFile(),
      viewerCounts: await this.loggers.views.parseLogFile(),
      chatters: await this.loggers.chatters.parseLogFile(),
    });
    Object.values(this.loggers!).forEach((logger) => logger.end());
    this._stop();
  }

  private getLogFilePaths = ({ base }: { base: string }) => ({
    out: `${this.OUT_FILE_DIR}/${base}.${this.OUT_FILE_EXT}`,
    chatters: `${this.OUT_FILE_DIR}/${base}.${this.CHATTER_LOG_EXT}`,
    views: `${this.OUT_FILE_DIR}/${base}.${this.VIEW_COUNT_LOG_EXT}`,
    meta: `${this.OUT_FILE_DIR}/${base}.${this.META_FILE_EXT}`,
  });

  protected onChatterMessage(chatter: ChatterMessageLog): void {
    this.loggers?.chatters.log(chatter);
    this.stats.lastMessage = chatter;
  }
}

export { Collector };
