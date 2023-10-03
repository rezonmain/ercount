class NotLiveError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotLiveError";
  }
}

class OutOfRangeError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "OutOfRangeError";
  }
}

export { NotLiveError, OutOfRangeError };
