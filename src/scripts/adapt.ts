import { DataAdapter } from "@/services/DataAdapter";
import { Debug } from "@/services/Debug";
import { OutLogger } from "@/services/OutLogger";

const base = process.argv[2];

const data = await new OutLogger(base).parseLogFile();

const dataAdapter = new DataAdapter(data);

// Find the number that represents 20% of the total number of chatters
const twentyPercentNumber = await dataAdapter.getNumberToPercentage(20);

// Percentage of messages sent by 20% of chatters
const ratioOf20Percent = await dataAdapter.getRatioOfPosition(
  twentyPercentNumber - 1
);

const ratioOfTop200 = await dataAdapter.getRatioOfPosition(199);
const ratioOfTop10 = await dataAdapter.getRatioOfPosition(9);

Debug.info(
  `Out of an average of ${Math.round(
    data.views.avg
  ).toLocaleString()} viewers, ${data.chatters.unique.toLocaleString()} unique chatters sent a total of ${data.chatters.totalChats.toLocaleString()} messages`
);

Debug.info(
  `Meaning only ${(data.engagement.engagement * 100).toFixed(
    2
  )}% of viewers engaged by sending a message on stream`
);

Debug.info(
  `Out of the ${data.chatters.unique.toLocaleString()} unique chatters, the top 20% are responsible of ${(
    ratioOf20Percent * 100
  ).toFixed(2)}% of all the messages sent`
);

Debug.info(
  `Meaning that 200 chatters are responsible of ${(ratioOfTop200 * 100).toFixed(
    2
  )}% of all the messages sent`
);

Debug.info(
  `And the top 10 chatters are responsible of ${(ratioOfTop10 * 100).toFixed(
    2
  )}% of all the ${data.chatters.totalChats.toLocaleString()} messages sent`
);
