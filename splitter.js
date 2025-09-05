import { createReadStream, writeFileSync } from 'fs'
import { Writable } from 'stream'
import { pipeline } from 'stream/promises'
import split from 'split'
const splitBySize = async (size) => {
    const set = new Set();
    const readStream = createReadStream('./dict.txt');
    let i = 0;
    await pipeline(readStream, split(), new Writable({
        objectMode: true,
        write(chunk, _, next) {
            if (chunk.length !== size) {
                return next();
            }
            if (!set.has(chunk)) {
                set.add(chunk);
                i++;
            }
            next();
        }
    }))
    console.log('inserted', i, 'words')
    writeFileSync(`words-${size}.json`, JSON.stringify(Array.from(set)))
}

export default splitBySize;