import { Helpers } from "./Helpers";

class Debug {
  public static info(message: string) {
    Debug.log(message, "info");
  }

  public static error(message: string) {
    Debug.log(message, "error");
  }

  public static success(message: string) {
    Debug.log(message, "success");
  }

  public static log(
    message: string,
    type: "info" | "error" | "success" = "info"
  ) {
    console.log(
      `${new Date().toLocaleTimeString()} [ercount ${Helpers.debug.getLogEmoji(
        type
      )}] ${message}`
    );
  }
}

export { Debug };
