abstract class Counter {
  abstract start(): void;
  abstract stop(): void;

  abstract get tally(): Record<string, number>;
  abstract get chatterCount(): number;
  abstract get messageCount(): number;
  abstract get viewerCount(): number;
}

export { Counter };
