/**
 * Glossary:
 * - Chatter: Users who have sent at least one chat message during the period of data collection
 * - Viewer: A unit of the reported viewer count
 * - Chat: Message sent by a chatter
 * - Total chats: The total number of chat messages sent during the period of data collection
 * - Total viewers: The maximum number of viewers reported during the period of data collection
 */

/**
 * Stats of the viewer count samples
 */
interface ViewCountStats {
  min: number;
  max: number;
  avg: number;
}

/**
 * Stats of the chatters
 */
interface ChattersStats {
  unique: number;
  totalChats: number;
  ratioOfTotalViewers: number;
}

/**
 * Tally of the chatters, and their ratio of contribution to the total chats and viewers
 */
interface Tally {
  displayName: string;
  chats: number;
  ratioOfTotalChats: number;
  ratioOfTotalViewers: number;
}

export type { ViewCountStats, ChattersStats, Tally };
