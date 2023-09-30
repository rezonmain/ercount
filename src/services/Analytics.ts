class Analytics {
  private _durationSeconds = 0;
  private _viewCount: Record<"max" | "min" | "avg", number> = {
    max: 0,
    min: 0,
    avg: 0,
  };
  private _chatters: Record<"unique" | "total", number> = {
    unique: 0,
    total: 0,
  };
  private _messages: Record<"total", number> = { total: 0 };
  private _tally?: Record<string, number> = {};
  private done = false;

  constructor(private baseFilePath: string) {}

  get durationSeconds() {
    return this._durationSeconds;
  }

  get viewCount() {
    return this._viewCount;
  }

  get chatters() {
    return this._chatters;
  }

  get messages() {
    return this._messages;
  }

  get tally() {
    return this._tally;
  }
}

export { Analytics };
