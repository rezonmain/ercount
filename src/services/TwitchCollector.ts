import { ViewCountLog } from "@/types/logger.types.js";
import { Collector } from "../interfaces/Collector.js";
import tmi from "tmi.js";
import { TwitchAPI } from "./TwitchAPI.js";

class TwitchCollector extends Collector {
  private chat;
  private api;

  constructor(channelName: string) {
    super(channelName);
    this.chat = new tmi.Client({
      channels: [channelName],
    });
    this.api = new TwitchAPI();
  }

  _start(): void {
    this.chat.connect();
    this.registerChatListeners();
    this.scheduleJobs();
  }

  _stop(): void {
    this.chat.disconnect();
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

  private scheduleJobs() {}
}

export { TwitchCollector };
