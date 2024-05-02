// https://blog.typeart.cc/using-puppeteer-crawler-common-skills/

const puppeteer = require("puppeteer");

async function scrapeWebsite(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector(".flight-list-item");

    const flightSingleData = await page.evaluate(() => {
      const carrier = document.querySelector(
        ".flight-list-item .el-popover__reference"
      ).innerText;
      const prices = document.querySelector(
        ".flight-list-item .amount"
      ).innerText;

      return {
        carrier: carrier,
        prices: prices,
      };
    });
    await browser.close();
    return flightSingleData;
  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  }
}

module.exports = { scrapeWebsite };
