type ActionOf<T extends object> = {
  [k in keyof T]: { type: k; value: T[k] };
}[keyof T];

export { ActionOf };
