import { Analytics } from "@/services/Analytics";
import { Files } from "@/services/Files";

const base = process.argv[2];

if (!base) {
  console.error("No base provided");
  process.exit(1);
}

if (!Files.exists(base + ".meta.json")) {
  console.error("No meta file found for the provided base");
  process.exit(1);
}

const analytics = new Analytics(base);
analytics.log();
