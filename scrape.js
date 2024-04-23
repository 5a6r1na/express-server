const puppeteer = require("puppeteer");


async function scrapeWebsite(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector(".flight-list-item")

    const flightSingleData = await page.evaluate(() => {
      const carrier = document.querySelector(".flight-list-item .el-popover__reference").innerText
      const prices = document.querySelector(".flight-list-item .amount").innerText

      return {
        carrier:carrier,
        prices:prices
      }

  });
    await browser.close();
    return flightSingleData;
  } catch (error) {
    console.error("Error during scraping:", error);
    return [];
  }
}

// Example usage:
const requestData = {
  depa: "TPE",
  dest: "OKA",
  OUT_DATE: "01%2F05%2F2024",
  IN_DATE: "30%2F05%2F2024",
  adults: "1",
};
const websiteUrl = `https://flight.eztravel.com.tw/tickets-roundtrip-${requestData.depa}-${requestData.dest}/?outbounddate=${requestData.OUT_DATE}&inbounddate=${requestData.IN_DATE}&dport=&aport=&adults=${requestData.adults}&children=0&infants=0&direct=true&cabintype=tourist&airline=&searchbox=t`
console.log(websiteUrl)
scrapeWebsite(websiteUrl)
  .then((flightData) => {
    console.log("Flight data:");
    console.log(flightData);
  })
  .catch((error) => {
    console.error("Error during scraping:", error);
  });
