import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import tmi from "tmi.js";
import type { ViewCountLog } from "@/types/logger.types";
import { Collector } from "@/interfaces/Collector";
import { TwitchAPI } from "@/services/TwitchAPI";
import type { LiveChecker } from "@/interfaces/LiveChecker";
import { TwitchLiveChecker } from "./TwitchLiveChecker";

class TwitchCollector extends Collector {
  private chat;
  private api;
  private scheduler: ToadScheduler;
  private liveChecker: LiveChecker;

  constructor(channelName: string) {
    super(channelName);

    this.chat = new tmi.Client({
      channels: [channelName],
    });

    this.api = new TwitchAPI();
    this.scheduler = new ToadScheduler();
    this.liveChecker = new TwitchLiveChecker({
      channelName,
      onStreamOffline: this.stop.bind(this),
    });
  }

  _start(): void {
    this.chat.connect();
    this.registerChatListeners();
    this.scheduleJobs();
    this.liveChecker.start();
  }

  _stop(): void {
    this.chat.disconnect();
    this.scheduler.stop();
    this.liveChecker.stop();
  }

  async getCurrentViewerCount(): Promise<ViewCountLog> {
    const [viewerCount] = await this.api.getStreams(this.channelName);
    return {
      ts: new Date().toISOString(),
      count: viewerCount.viewer_count,
    };
  }

  async getStreamTitle(): Promise<string> {
    const [streamTitle] = await this.api.getStreams(this.channelName);
    return streamTitle.title;
  }

  private registerChatListeners() {
    this.chat.on("message", (channel, tags, message) => {
      this.onChatterMessage({
        displayName: tags["display-name"] ?? "anonymous",
        message,
        ts: new Date().toISOString(),
      });
    });
  }

  private scheduleJobs() {
    const viewsTask = new AsyncTask(this.base + "_views", async () => {
      const views = await this.getCurrentViewerCount();
      this.loggers?.views.log(views);
      this.stats.viewerCount = views.count;
    });

    const viewsJob = new SimpleIntervalJob(
      { milliseconds: this.VIEW_COUNT_SAMPLE_RATE, runImmediately: true },
      viewsTask
    );

    this.scheduler.addSimpleIntervalJob(viewsJob);
  }
}

export { TwitchCollector };
