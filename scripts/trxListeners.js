// import from .production instead if you run this in production mode
const { default: context } = require("../.development/server.js");
const fcl = require("@onflow/fcl");

const latestBlock = () => {
  return fcl.send([fcl.getBlock(true)]).then(fcl.decode);
};

const persistedBlock = {};

const poll = async () => {
  await context.start();

  const { database, secrets } = context;
  const addr = fcl.sansPrefix(secrets.adminAddress);
  let key = `A.${addr}.MyNFT.Deposit`;
  let hwm = (await latestBlock()).height - 1;

  while (1) {
    await new Promise((r) => setTimeout(r, 1_000));
    var end = (await latestBlock()).height;

    if (hwm >= end) {
      console.log("hwm is the same", hwm, end);
      continue;
    }

    var events = await fcl
      .send([fcl.getEvents(key, hwm, end)])
      .then(fcl.decode);

    if (events && events.length) {
      events.forEach(async (event) => {
        if (!persistedBlock[event.blockId]) {
          console.log(`Events from ${hwm} to ${end}`, event);
          const existingEvent = await database.collection("events").findOne({
            type: event.type,
            transactionId: event.transactionId,
            data: event.data,
          });

          if (!existingEvent) {
            await database.collection("events").insertOne(event);
            persistedBlock[event.blockId] = 1;
          }
        }
      });
    }
  }
};

poll();
