import { Analytics } from "@/services/Analytics";
import { Helpers } from "@/services/Helpers";

const base = process.argv[2];

if (!base) {
  console.error("No base provided");
  process.exit(1);
}

if (!(await Helpers.file.exists(base + ".meta.json"))) {
  console.error("No meta file found for the provided base");
  process.exit(1);
}

const analytics = new Analytics(base);
analytics.log();
