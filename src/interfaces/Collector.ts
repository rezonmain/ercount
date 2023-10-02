import { init as cuid2 } from "@paralleldrive/cuid2";
import type {
  ChatterMessageLog,
  LoggerSuite,
  TimesLog,
  ViewCountLog,
} from "@/types/logger.types.js";
import { Helpers } from "@/services/Helpers";
import { Analytics } from "@/services/Analytics";
import { Debug } from "@/services/Debug";

abstract class Collector {
  private getCuid2: () => string = cuid2({ length: 4 });
  protected VIEW_COUNT_SAMPLE_RATE = 1000 * 60 * 10; // 10 minutes
  protected logTimes: TimesLog = { init: "", end: "" };
  protected loggers?: LoggerSuite;
  running = false;
  base = "";
  analytics = new Analytics();
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
    Debug.info(`Starting collector for ${this.channelName}`);
    // Set the start time
    this.logTimes.init = new Date().toISOString();

    this.base = `${this.getCuid2()}_${this.channelName}_${this.logTimes.init}`;

    this.analytics = new Analytics(this.base);

    const streamTitle = await this.getStreamTitle();
    this.stats.streamTitle = streamTitle;

    // Initialize the loggers
    this.loggers = Helpers.logger.getAllLoggers(this.base);

    // Log the initial meta data
    this.loggers.meta.log({
      channelName: this.channelName,
      logTimes: this.logTimes,
      streamTitles: [this.stats.streamTitle],
      viewerCountSampleIntervalMs: this.VIEW_COUNT_SAMPLE_RATE,
    });

    // Execute collector implementation start method
    this._start();
    this.running = true;
    Debug.success(`Collector started for ${this.channelName}`);
  }

  /**
   * Stop the collector, finalize data logging, clean up write stream
   */
  async stop() {
    if (!this.running) return;
    // Set the stop time
    this.logTimes.end = new Date().toISOString();

    // Complete the meta log with the end time
    this.loggers?.meta.log({
      ...(await this.loggers?.meta.parseLogFile()),
      logTimes: this.logTimes,
    });

    // End all the logger's write streams
    Object.values(this.loggers ?? {}).forEach((logger) => logger.end());

    // Execute collector implementation stop method
    this._stop();
    this.running = false;
    Debug.success(`Collector stopped for ${this.channelName}`);
  }

  /**
   * Handle when a chatter sends a message
   */
  protected onChatterMessage(chatter: ChatterMessageLog): void {
    this.loggers?.chatters.log(chatter);
    this.stats.lastMessage = chatter;
  }
}

export { Collector };
