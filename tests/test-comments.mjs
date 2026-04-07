// [ERR_MODULE_NOT_FOUND]: Cannot find package 'cheerio' imported from (the current path)
// FIX: Downloaded cheerio via npm install cheerio
// `Failed to scrape ${url}: Attribute selector didn't terminate`
// FIX: added ` symbol at the end of piped data stream
// Current issue (not error): meta property links not displaying info

console.log('Test script started.');

import * as cheerio from 'cheerio';
import {createWriteStream} from 'node:fs';

const urls = [
'https://www.ebay.com/itm/396935065776',
'https://www.amazon.com/MONCHHICHI-Hello-Kitty-Costume-Plush/dp/B0FMCKG5QM',
'https://www.mercari.com/us/item/m41387543402/',
];

// Creates 'delay' function that accepts inputs in milliseconds and delays by a certain amount of seconds before running next code sequence.
// new Promise is the 'modern wrapper' ('await' is a newer line that can only return a Promise)
// resolve tells the Promise when to move on to the next code

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/*
This function uses an arrow function, which is basically a function with different, quicker syntax. Here's how the old function syntax would look:

function delay(ms) {
	return new Promise(function(resolve) {
		return setTimeout(resolve, ms);
	});
}
*/

async function scrape(urlList, filename) {
	const stream = createWriteStream(filename, {flags: 'a'});
	
	for (const url of urlList) {
		try {
			console.log(`Scraping from: ${url}...`);
			console.log("HTML Preview:", html.substring(0, 500));
			
			// Sends a request with a header for session validation
			const response = await fetch(url, {headers: {'User-Agent':'Mozilla/5.0'}});
			const html = await response.text();
			
			// Waits 3 seconds to avoid session timeout/IP block
			console.log("Loading...");
			await delay(3000);

			const $ = cheerio.load(html); // what's this line doing?
			
			// Extract the metadata
			const title = $('meta[property="og:title"]').attr('content') || $('meta[name="title"]').attr('content') || 'N/A Title ';
			const desc = $('meta[property="og:description"]').attr('content') || 'N/A Title ';
			const siteName = $('meta[property="og:site_name"]').attr('content') || 'N/A Site Name ';
			const image = $('meta[property="og:image"]').attr('content') || 'N/A img link ';
			/*
			Add other links later-only do three for examples' sake
			*/

			// Format the data as a single string line
			const dataLine = `Site Link: ${url} | Title: ${title} | Desc: ${desc}\n | SiteName: ${siteName} | ImageLink: ${image}`;

			// Write it to the stream
			stream.write(dataLine);

    } catch (err) {
      console.error(`Failed to scrape ${url}:`, err.message);
      stream.write(`URL: ${url} | ERROR: ${err.message}\n`);
    }
  }

  // Close the stream when finished
  stream.end();
  console.log('Finished streaming all data to file.');
}

scrape(urls, 'results.txt'); 

/*
Note: The thing with Cheerio is that it's best with static HTML metadata scraping. The console output the 'Failed to scrape' line because the script was likely blocked by the site; the script lacks the needed metadata and HTTP header that browsers send on request (lets the sites know that it's an actual visitor, not a script from a database), making it stand out to any sites and prone to malicious suspicion. This causes the site to send back a generic 'lite' version of the site that lacks the metadata. Additionally, servers track every request by its IP address If the script is running from a cloud provider like AWS, Google Cloud or Azure, the server knows that the IP ranges belong to data centers rather than residential homes, making them likely to send back an HTML 'skeleton' or CAPTCHA to the IPs. And if a single IP requests, for example, 50 pages in 2 seconds (faster than any human could), the session is automatically flagged as a bot and possibly has the IP blocked.

Puppeteer or Playwright are headless browsers that execute JS right when the dynamic code in the webpage fills in important metadata. The site is more likely to be lenient since it 'looks' like a real session and only scrapes the data exactly when it's loaded.

A Promise is a build-in JS object that represents the eventual completion or failure of an asynchronous operation and its resulting value, acting as a 'placeholder' for a result that isn't available yet (e.g. data being fetched from a server).
*/
