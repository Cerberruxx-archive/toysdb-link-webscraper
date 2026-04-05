// Note: edit tags to fetch others like 'desc', 'brand', 'material', 'country of origin', 'character', 'condition', 'seller notes', 'year manufactured'

import * as cheerio from 'cheerio';
import {createWriteStream} from 'node:fs';

const urls = [
'https://www.ebay.com/itm/396935065776',
'https://www.ebay.com/itm/227021758979',
'https://www.ebay.com/itm/297818160704',
'https://www.ebay.com/itm/406366411924',
'https://www.amazon.com/MONCHHICHI-Hello-Kitty-Costume-Plush/dp/B0FMCKG5QM',
'https://www.mercari.com/us/item/m20349458381/?ref=search_results',
'https://www.mercari.com/us/item/m43594946935/?ref=search_results',
'https://www.mercari.com/us/item/m63442084283/?ref=search_results',
'https://www.mercari.com/us/item/m10586885853/',
'https://www.mercari.com/us/item/m87084266647/',
'https://www.mercari.com/us/item/m67113578375/',
'https://www.mercari.com/us/item/m45037952205/',
'https://www.mercari.com/us/item/m40910156067/',
'https://www.mercari.com/us/item/m59428577654/',
'https://www.mercari.com/us/item/m89387201673/',
'https://www.mercari.com/us/item/m60094108962/',
'https://www.mercari.com/us/item/m60525636056/',
'https://www.mercari.com/us/item/m39275804694/',
'https://www.mercari.com/us/item/m52460340331/',
'https://www.mercari.com/us/item/m53536042994/',
'https://www.mercari.com/us/item/m24528056878/',
'https://www.mercari.com/us/item/m73595626388/',
'https://www.mercari.com/us/item/m65361043420/',
'http://mercari.com/us/item/m49903005339/',
'https://www.mercari.com/us/item/m29149448551/',
'https://www.mercari.com/us/item/m41387543402/',
'https://www.mercari.com/us/item/m23428039621/',
'https://www.mercari.com/us/item/m69194876464/',
'https://www.mercari.com/us/item/m53927030390/',
'https://www.mercari.com/us/item/m54021964218/',
'https://www.mercari.com/us/item/m15030095966/'
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

scrapeAndStream(urls, 'metadata_results.txt');