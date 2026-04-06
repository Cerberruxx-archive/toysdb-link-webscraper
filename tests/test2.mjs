// WORKING 100%
// import {createWriteStream} from 'node:fs';
/*
Above command generated a 'ReferenceError: require is not defined in ES module scope'. Commented out the 'import' code and it runs smoothly; this is for CommonJS (opposite of ES Module).
*/

// Note: fs needs to be called first in order to access the method 'createWriteStream' inside
import fs from 'node:fs';
import {createWriteStream} from 'node:fs';

console.log('Script started.');

// Calls the 'fs' module and links it with 'createWriteStream' method. Note: The module names don't need to be declared again.
const writer = fs.createWriteStream('testoutput.txt');

// For debug
writer.write('This is filler text', (err) => {
	if (err) console.error('Write failed...', err);
	else console.log('Data buffered.');
});

writer.on('finish', () => {
	console.log('Finished.');
});

// Close the stream
writer.end()

/*
Explained:

When a stream is used, Node.js opens a buffer (small memory chunk) and waits until the buffer is full before writing and saving to the hard drive. If the script is short then the script ends before buffer ends.

This is why you must explicitly tell node to close the stream. It's allowing the data to go from the RAM to disk space.
*/
