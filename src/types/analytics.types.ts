/**
 * Glossary:
 * - Chatter: Users who have sent at least one chat message during the period of data collection
 * - Viewer: A unit of the reported viewer count
 * - Chat: Message sent by a chatter
 * - Total chats: The total number of chat messages sent during the period of data collection
 * - Total viewers: The maximum number of viewers reported during the period of data collection
 */

/**
 * Stats of the duration of the data collection
 * in different units for calculation convenience
 */
interface DurationStats {
  durationInSeconds: number;
  durationInHours: number;
}

/**
 * Stats of the viewer count samples
 */
interface ViewCountStats {
  min: number;
  max: number;
  avg: number;
}

/**
 * General stats of the chatters
 */
interface ChattersStats {
  /**
   * The number of unique chatters
   */
  unique: number;

  /**
   * The total number of chat messages sent
   */
  totalChats: number;
}

/**
 * Tally of the chatters, and their ratio of contribution to the total chats and viewers
 */
interface Tally {
  /**
   * The name of the chatter that show in chat
   */
  displayName: string;

  /**
   * The number of chat messages sent by the chatter
   */
  chats: number;

  /**
   * The ratio of the number of chat messages sent by the chatter to the total number of chat messages sent
   *
   * `Tally.chats / ChattersStats.totalChats`
   */
  ratioOfTotalChats: number;
}

/**
 * Stats of the engagement
 */
interface EngagementStats {
  /**
   * The ratio between the number of unique chatters and the number of average viewers
   *
   * `ChatterStats.unique / ViewCountStats.avg`
   */
  engagement: number;

  /**
   * The ratio between the number of unique chatters and the number of average viewers, per duration in hours
   *
   * `EngagementStats.engagement / DurationStats.durationInHours`
   */
  engagementPerHour: number;
}

export type {
  ViewCountStats,
  ChattersStats,
  Tally,
  EngagementStats,
  DurationStats,
};
