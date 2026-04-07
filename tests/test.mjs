console.log('Test script started.');

import * as cheerio from 'cheerio';
import {createWriteStream} from 'node:fs';

const urls = [
'https://www.ebay.com/itm/396935065776',
'https://www.amazon.com/MONCHHICHI-Hello-Kitty-Costume-Plush/dp/B0FMCKG5QM',
'https://www.mercari.com/us/item/m41387543402/',
];

function delay(ms) {
	return new Promise(function(resolve) {
		return setTimeout(resolve, ms);
	});
}


async function scrape(urlList, filename) {
	const stream = createWriteStream(filename, {flags: 'a'});
	
	for (const url of urlList) {
		try {
			console.log(`Scraping from: ${url}...`);
			
			// Sends a request with a header for session validation
			const response = await fetch(url, {headers: {'User-Agent':'Mozilla/5.0'}});
			const html = await response.text();
			
			// Waits 3 seconds to avoid session timeout/IP block
			console.log("Loading...");
			await delay(3000);
console.log("HTML Preview:", html.substring(0, 500));
			const $ = cheerio.load(html); // what's this line doing?
			
			// Extract the metadata
			const title = $('meta[property="og:title"]').attr('content') || $('meta[name="title"]').attr('content') || 'N/A Title ';
			const desc = $('meta[property="og:description"]').attr('content') || 'N/A Title ';
			const siteName = $('meta[property="og:site_name"]').attr('content') || 'N/A Site Name ';
			const image = $('meta[property="og:image"]').attr('content') || 'N/A img link ';

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