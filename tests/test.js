// test
console.log('Test script started.');

import * as cheerio from 'cheerio';
import {createWriteStream} from 'node:fs';

const urls = [
'https://www.ebay.com/itm/396935065776',
'https://www.amazon.com/MONCHHICHI-Hello-Kitty-Costume-Plush/dp/B0FMCKG5QM',
'https://www.mercari.com/us/item/m41387543402/',
];

async function scrape(urlList, fname) {
	const stream = createWriteStream(fname, {flags: 'a'});
	
	for (const url of urlList) {
		try {
			console.log(`Scraping from: ${url}...`);
			
			const response = await fetch(url);
			const html = await response.text();
			const $ = cheerio.load(html);
			
			// Extract the metadata you want
			const title = $('title').text().replace(/\n/g, '') || 'No Title';
			const desc = $('meta[name="description"]').attr('content') || 'No Description';

			// Format the data as a single string line
			const dataLine = `URL: ${url} | Title: ${title} | Desc: ${desc}\n`;

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

scrape(urls, 'metadata_results.txt'); 