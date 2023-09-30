class NotLiveError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotLiveError";
  }
}

export { NotLiveError };
