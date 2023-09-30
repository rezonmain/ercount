type LogFileType = "chatters" | "views" | "out";

interface ViewCountLog {
  count: number;
  ts: string;
}

interface ChatterMessageLog {
  displayName: string;
  message: string;
  ts: string;
}

interface TimesLog {
  init: Date;
  end: Date;
}

interface FileMeta {
  channelName: string;
  logTimes: TimesLog;
  streamTitles: string[];
  viewerCountSampleIntervalMs?: number;
}

interface OutFileSchema {
  viewerCounts: ViewCountLog[];
  chatters: ChatterMessageLog[];
  fileMeta?: FileMeta;
}

type LogTypes = ViewCountLog | ChatterMessageLog | OutFileSchema | FileMeta;

export type {
  ViewCountLog,
  ChatterMessageLog,
  OutFileSchema,
  FileMeta,
  TimesLog,
  LogFileType,
  LogTypes,
};
