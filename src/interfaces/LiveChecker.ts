import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";

abstract class LiveChecker {
  protected channelName: string;
  protected onStreamOffline: () => void;
  private LIVE_CHECK_INTERVAL = 1000 * 15; // 15 seconds
  private scheduler: ToadScheduler = new ToadScheduler();

  constructor({
    channelName,
    onStreamOffline,
  }: {
    channelName: string;
    onStreamOffline: () => void;
  }) {
    this.channelName = channelName;
    this.onStreamOffline = onStreamOffline.bind(this);
  }

  start() {
    const liveCheckTask = new AsyncTask(
      `live-check-${this.channelName}`,
      this.check.bind(this)
    );

    const liveCheckJob = new SimpleIntervalJob(
      { milliseconds: this.LIVE_CHECK_INTERVAL },
      liveCheckTask
    );

    this.scheduler.addSimpleIntervalJob(liveCheckJob);
  }

  stop() {
    this.scheduler.stop();
  }

  protected abstract check(): Promise<void>;
}

export { LiveChecker };
