import { NotLiveError } from "@/interfaces/Errors";
import { TwitchCollector } from "@/services/TwitchCollector";

const channelName = process.argv[2];
const skipAnalysis = process.argv[3] === "--skip-analysis";

if (!channelName) {
  console.error("No channel name provided");
  console.info("Usage: bun log <channel name>");
  process.exit(0);
}

const twitchCollector = new TwitchCollector(channelName);

try {
  await twitchCollector.start();
} catch (e) {
  if (e instanceof NotLiveError) {
    console.error(e.message);
    process.exit(0);
  }
}

console.info(
  `Enter 'stop' or Ctrl+C to stop logging${
    skipAnalysis ? ":" : " and run analysis:"
  }`
);

const runAnalysis = async () => {
  if (skipAnalysis) {
    process.exit(0);
  }
  console.log("Running analysis...");
  await twitchCollector.analytics.log();
  console.log("Done!");
};

process.on("SIGINT", async () => {
  await twitchCollector.stop();
  await runAnalysis();
  process.exit(0);
});

for await (const line of console) {
  if (line === "stop") {
    await twitchCollector.stop();
    await runAnalysis();
    break;
  }
}
