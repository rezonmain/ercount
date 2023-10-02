import { LiveChecker } from "@/interfaces/LiveChecker";
import { TwitchAPI } from "./TwitchAPI";
import { NotLiveError } from "@/interfaces/Errors";
import { Debug } from "@/services/Debug";

class TwitchLiveChecker extends LiveChecker {
  private OFFLINE_RETRY_LIMIT = 3;
  private offlineCount = 0;
  private api: TwitchAPI;

  constructor(params: { channelName: string; onStreamOffline: () => void }) {
    super(params);
    this.api = new TwitchAPI();
  }

  protected async check(): Promise<void> {
    try {
      await this.api.getStreams(this.channelName);
    } catch (e) {
      if (e instanceof NotLiveError) {
        this.onNotLive();
      }
    }
  }

  private onNotLive() {
    /**
     * Check if stream is still offline after a few tries,
     * just to make sure it's not a temporary issue
     */
    this.offlineCount++;
    Debug.info(`${this.channelName} went offline, count: ${this.offlineCount}`);
    if (this.offlineCount >= this.OFFLINE_RETRY_LIMIT) {
      this.onStreamOffline();
    }
  }
}

export { TwitchLiveChecker };
