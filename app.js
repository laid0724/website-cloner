// Downloads all the crawlable files of a website.
// The files are saved in the same structure as the structure of the website, by using the `bySiteStructure` filenameGenerator.
// Links to other websites are filtered out by the urlFilter

const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const path = require('path');

const config = {
  urls: ['http://www.utsi.com.tw'],
  websiteName: 'utsi',
  // Enable recursively download all pages from the website
  recursive: true,
  // Levels of pages to scrape
  maxDepth: Infinity
}

const { urls, websiteName, recursive, maxDepth } = config;

scrape({
  urls,
  directory: path.resolve(__dirname, `./scraped-results/${websiteName}`),
  recursive,
  maxDepth,
  urlFilter: function(url) {
    // For preventing external sites being scraped in the process
    // If url contains the domain of the website, then continue:
    // https://nodejs.org with https://nodejs.org/en/example.html
    return url.indexOf(urls) === 0 ? true : false;
  },
  prettifyUrls: true,
  filenameGenerator: 'bySiteStructure',
  // Load the Puppeteer plugin
  plugins: [
    new PuppeteerPlugin({
      launchOptions: {
        // If you set  this to true, the headless browser will show up on screen
        headless: true,
      } /* optional */,
      scrollToBottom: {
        timeout: 10000,
        viewportN: 10,
      } /* optional */,
    }),
  ],
}).then((result) => {
  console.log("Webpages succesfully downloaded");
}).catch((err) => {
  console.log("An error ocurred", err);
});
