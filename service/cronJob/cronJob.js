const cron = require("node-cron");
const { syncRestock } = require("./restockScheduler");

const reSyncRestock = cron.schedule("59 23 * * *", async () => {
  //this job will run every 24 hours
  await syncRestock("SYSTYEM");
});

module.exports = {
  reSyncRestock,
};
