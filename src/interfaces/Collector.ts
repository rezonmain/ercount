import { init as cuid2 } from "@paralleldrive/cuid2";
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
  private getCuid2: () => string = cuid2({ length: 4 });
  protected VIEW_COUNT_SAMPLE_RATE = 1000 * 60 * 10; // 10 minutes
  protected logTimes: TimesLog = { init: new Date(), end: new Date() };
  protected loggers?: {
    out: OutLogger;
    chatters: ChattersLogger;
    views: ViewsLogger;
    meta: MetaLogger;
  };
  base: string = "";
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

  /**
   * Collector implementation start method
   */
  abstract _start(): void;

  /**
   * Collector implementation stop method
   */
  abstract _stop(): void;

  /**
   * Get the current viewer count
   */
  abstract getCurrentViewerCount(): Promise<ViewCountLog>;

  /**
   * Get the current stream title
   */
  abstract getStreamTitle(): Promise<string>;

  /**
   * Start the collector, initialize data logging
   */
  async start(): Promise<void> {
    // Set the start time
    this.logTimes.init = new Date();

    this.base = `${this.getCuid2()}_${
      this.channelName
    }_${this.logTimes.init.toISOString()}`;

    // Get the log file paths
    const logFilePaths = this.getLogFilePaths({
      base: this.base,
    });

    const streamTitle = await this.getStreamTitle();
    this.stats.streamTitle = streamTitle;

    // Initialize the loggers
    this.loggers = {
      out: new OutLogger(logFilePaths.out),
      chatters: new ChattersLogger(logFilePaths.chatters),
      views: new ViewsLogger(logFilePaths.views),
      meta: new MetaLogger(logFilePaths.meta),
    };

    // Log the initial meta data
    this.loggers.meta.log({
      channelName: this.channelName,
      logTimes: this.logTimes,
      streamTitles: [this.stats.streamTitle],
      viewerCountSampleIntervalMs: this.VIEW_COUNT_SAMPLE_RATE,
    });

    // Execute collector implementation start method
    this._start();
  }

  /**
   * Stop the collector, finalize data logging, clean up write stream
   */
  async stop() {
    // Set the stop time
    this.logTimes.end = new Date();

    // Complete the meta log with the end time
    this.loggers?.meta.overwrite({
      ...(await this.loggers?.meta.parseLogFile()),
      logTimes: this.logTimes,
    });

    // Log the final stats
    this.loggers?.out.log({
      fileMeta: await this.loggers.meta.parseLogFile(),
      viewerCounts: await this.loggers.views.parseLogFile(),
      chatters: await this.loggers.chatters.parseLogFile(),
    });

    // End all the logger's write streams
    Object.values(this.loggers!).forEach((logger) => logger.end());

    // Execute collector implementation stop method
    this._stop();
  }

  private getLogFilePaths = ({ base }: { base: string }) => ({
    out: `${this.OUT_FILE_DIR}/${base}.${this.OUT_FILE_EXT}`,
    chatters: `${this.OUT_FILE_DIR}/${base}.${this.CHATTER_LOG_EXT}`,
    views: `${this.OUT_FILE_DIR}/${base}.${this.VIEW_COUNT_LOG_EXT}`,
    meta: `${this.OUT_FILE_DIR}/${base}.${this.META_FILE_EXT}`,
  });

  /**
   * Handle when a chatter sends a message
   */
  protected onChatterMessage(chatter: ChatterMessageLog): void {
    this.loggers?.chatters.log(chatter);
    this.stats.lastMessage = chatter;
  }
}

export { Collector };
