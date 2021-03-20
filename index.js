require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const PORT = process.env.PORT || 5000;
const app = express();
const scrapeProductLinks = require("./scraper");

// do i even need the express server?
app.listen(PORT, startCronJob); // is this the best way to do this

function startCronJob() {
  cron.schedule('*/3 * * * *', async function ()  {
      console.log("Scraping product list...")
    await scrapeProductLinks();
  });
}
