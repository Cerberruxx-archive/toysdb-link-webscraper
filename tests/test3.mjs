// WORKING 100%
// TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string or an instance of Buffer or URL. Received an instance of Array
/*
Error fix: added 'filename' to 'const stream = createWriteStream({flags: 'a'});'
*/
// Another note: The 'a' in {flags} stands for 'append', or add to file.

import fs from 'node:fs';
import {createWriteStream} from 'node:fs';

console.log('Script started.');

const fruitList = ['apple', 'peach', 'orange', 'banana'];

async function add(f_array, filename) {
	const stream = createWriteStream(filename, {flags: 'a'});

	for (const i of f_array) {
		try {
			console.log(`Appending ${i}...`);
			stream.write(`${i}\n`);
		} catch (err) {
			console.error(`Failed to append ${i}`, err.message);
			stream.write(`${i}`, err.message);
		}
	}
	stream.end();
	console.log('Done appending data.');
};

add(fruitList, 'test_output3.txt');
