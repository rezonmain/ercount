import { NotLiveError } from "@/interfaces/Errors";
import { TwitchCollector } from "@/services/TwitchCollector";

const channelName = process.argv[2];
const skipAnalysis = process.argv[3] === "--skip-analysis";

if (!channelName) {
  console.error("[ercount ❌] No channel name provided");
  console.info("[ercount 🚨] Usage: bun log <channel name>");
  process.exit(0);
}

const twitchCollector = new TwitchCollector(channelName);

try {
  await twitchCollector.start();
  console.info(
    `${new Date().toLocaleTimeString()} [ercount ✅]: Logging started for channel ${channelName}`
  );
} catch (e) {
  if (e instanceof NotLiveError) {
    console.error(e.message);
    process.exit(0);
  }
}

console.info(
  `${new Date().toLocaleTimeString()} [ercount 🚨] Enter 'stop' or Ctrl+C to stop logging${
    skipAnalysis ? ":" : " and run analysis:"
  }`
);

const runAnalysis = async () => {
  if (skipAnalysis) {
    process.exit(0);
  }
  console.log(
    `${new Date().toLocaleTimeString()} [ercount 🚨] Running analysis...`
  );
  await twitchCollector.analytics.log();
  console.log(
    `${new Date().toLocaleTimeString()} [ercount ✅] Analysis completed, see: ${
      twitchCollector.base
    }.out.json`
  );
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
