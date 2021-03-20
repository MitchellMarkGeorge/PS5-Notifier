const productList = require("./product-links");
const sendMessage = require("./send-message");
const puppeteer = require("puppeteer");

async function scrapeProductLinks() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  for (const product of productList) {
    try {
      const page = await browser.newPage();
      await page.goto(product.link); // disable time out?
      let AVALIBILITY_SELECTOR;
      let text;
      switch (product.retailer) {
        case "Best Buy":
          AVALIBILITY_SELECTOR = ".availabilityMessage_ig-s5.container_3LC03"; // confirm

          text = await scrapeAvalibility(page, AVALIBILITY_SELECTOR);
          text = text.trim();
          //   console.log(text); // for now
          await page.close();
          if (text !== "Coming soon") {
            // for testing
            sendMessage("Best Buy");
          } else {
            console.log(`No PS5 at ${product.retailer}`);
          }
          break;

        //WALMART REFUSES TO WORK
        // case "Walmart": // NOT SURE ABOUT THIS
        //   AVALIBILITY_SELECTOR =
        //     "body > div.js-content.privacy-open > div > div:nth-child(4) > div > div > div.css-0.eewy8oa0 > div.css-12rl50h.eewy8oa2 > div.css-18f77yw.eewy8oa4 > div > div.cta.css-t5h6pw.e61xtbo0 > div:nth-child(2) > div > button";

        //   text = await scrapeAvalibility(page, AVALIBILITY_SELECTOR);
        //   console.log(text); // for now
        //   await page.close();
        //   break;

        case "Newegg":
          AVALIBILITY_SELECTOR =
            "#app > div.page-content > div.page-section > div > div > div.row-body > div.product-main.display-flex > div.product-wrap > div.product-info-group > div.product-inventory > strong";
          text = await scrapeAvalibility(page, AVALIBILITY_SELECTOR);
          text = text.trim();
          //   console.log(text); // for now
          await page.close();
          if (text !== "OUT OF STOCK.") {
            sendMessage("Newegg");
          } else {
            console.log(`No PS5 at ${product.retailer}`);
          }
          break;

        case "Amazon":
          AVALIBILITY_SELECTOR = "#availability > span";
          text = await scrapeAvalibility(page, AVALIBILITY_SELECTOR);
          text = text.trim();
          //   console.log(text); // for now
          await page.close();
          if (text !== "Currently unavailable.") {
            sendMessage("Amazon");
          } else {
            console.log(`No PS5 at ${product.retailer}`);
          }
          break;
        case "EB Games":
          const hasError = false;

          AVALIBILITY_SELECTOR =
            "#prodMain > div.mainInfo > div.addCartBar > div.prodRightBlock > div.buySection > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > a.megaButton.buyDisabled";
          try {
            // IS ANY OF THIS NESSECCARY
            text = await scrapeAvalibility(page, AVALIBILITY_SELECTOR); // if the item is avalible, the element might not exist
            
        } catch {
            hasError = true;
          }
          
          //   console.log(text, hasError); // for now
          text = text.trim();
          await page.close();
          
          if (text !== "OUT OF STOCK" && !hasError) {
            sendMessage("EB Games");
          } else {
            console.log(`No PS5 at ${product.retailer}`);
          }
          break;
        default:
          throw new Error("Unknown retailer");
      }
    } catch (error) {
      console.log(error.message);
      console.log("Caused error", product.retailer);
    }
  }

  await browser.close();
}

async function scrapeAvalibility(page, selector) {
  await page.waitForSelector(selector);
  const result = await page.$(selector);
  const text = await result.evaluate((element) => element.innerText); // should throw an error if does not exist

  //   const text = await page.evaluate(() => document.querySelector(selector).innerText  ); // should throw an error if does not exist
  return text;
}

module.exports = scrapeProductLinks;
