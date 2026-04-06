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

async function scrape(urlList, filename) {
	const stream = createWriteStream(filename, {flags: 'a'});
	
	for (const url of urlList) {
		try {
			console.log(`Scraping from: ${url}...`);
			
			const response = await fetch(url);
			const html = await response.text();
			const $ = cheerio.load(html); // what's this line doing?
			
			// Extract the metadata
			const title = $('meta[property="og:title"]').attr('content') || 'N/A Title ';
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