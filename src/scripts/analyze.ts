import { Analytics } from "@/services/Analytics";
import { Debug } from "@/services/Debug";
import { Helpers } from "@/services/Helpers";

const base = process.argv[2];

if (!base) {
  Debug.error("No base provided");
  process.exit(1);
}

if (!(await Helpers.file.exists(base + ".meta.json"))) {
  Debug.error("No meta file found for the provided base");
  process.exit(1);
}

const analytics = new Analytics(base);
analytics.log();
