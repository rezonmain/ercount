import { Collector } from "../interfaces/Collector.js";

class TwitchCollector extends Collector {
  constructor(channelName: string) {
    super(channelName);
  }

  start(): void {
    console.log(`Starting Twitch collector for ${this.channelName}`);
  }

  stop(): void {
    console.log(`Stopping Twitch collector for ${this.channelName}`);
  }
}

export { TwitchCollector };
