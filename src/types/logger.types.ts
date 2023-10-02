import type { ChattersLogger } from "@/services/ChattersLogger";
import type { MetaLogger } from "@/services/MetaLogger";
import type { OutLogger } from "@/services/OutLogger";
import type { ViewsLogger } from "@/services/ViewsLogger";
import type {
  ChattersStats,
  DurationStats,
  EngagementStats,
  Tally,
  ViewCountStats,
} from "@/types/analytics.types";

interface ViewCountLog {
  count: number;
  ts: string; // ISO string
}

interface ChatterMessageLog {
  displayName: string;
  message: string;
  ts: string; // ISO string
}

interface TimesLog {
  init: string; // ISO string
  end: string; // ISO string
}

interface FileMeta {
  channelName: string;
  logTimes: TimesLog;
  streamTitles: string[];
  viewerCountSampleIntervalMs?: number;
}

interface OutFileSchema {
  fileMeta: FileMeta;
  duration: DurationStats;
  chatters: ChattersStats;
  views: ViewCountStats;
  engagement: EngagementStats;
  tally: Tally[];
}

type LogTypes = ViewCountLog | ChatterMessageLog | OutFileSchema | FileMeta;

type LoggerSuite = {
  out: OutLogger;
  chatters: ChattersLogger;
  views: ViewsLogger;
  meta: MetaLogger;
};

export type {
  ChatterMessageLog,
  OutFileSchema,
  ViewCountLog,
  LoggerSuite,
  FileMeta,
  TimesLog,
  LogTypes,
};
