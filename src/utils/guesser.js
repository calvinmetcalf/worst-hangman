const blank = '________________'
const NULL = Symbol('null');
const findOccences = (word, letter) => {
    const out = [];
    let pos = 0;

    while (true) {
        const thisPos = word.indexOf(letter, pos);
        // console.log('word', word);
        // console.log('letter', letter);
        // console.log('pos', thisPos);
        if (thisPos === -1) {
            return out;
        }
        out.push(thisPos);
        console.log('out', out)
        pos = thisPos + 1;
    }
}
class Guesser {
    constructor(wordlist) {
        this.list = wordlist;
        this.excluded = [];
        this.included = [];
        this.length = this.list[0].length;
        this.pattern = blank.slice(0, this.length);
        this.done = false;
    }
    guess(_letter) {
        if (this.done) {
            return;
        }

        const letter = _letter.toUpperCase()
        if (this.excluded.includes(letter)) {
            return;
        }
        if (this.included.includes(letter)) {
            return;
        }
        const patterns = new Map();
        patterns.set(NULL, []);
        for (const word of this.list) {
            const pattern = findOccences(word, letter);
            let key;
            if (pattern.length) {
                key = pattern.join('-')
            } else {
                key = NULL;
            }
            if (!patterns.has(key)) {
                patterns.set(key, []);
            }
            const list = patterns.get(key);
            list.push(word);
            patterns.set(key, list);
        }
        let maxSize = -Infinity;
        let maxPattern, maxList;
        for (const [pattern, list] of patterns) {
            console.log(pattern, list.length)
            if (list.length >= maxSize) {// change this to just a > if we want it to always default to null
                maxPattern = pattern;
                maxList = list;
                maxSize = list.length;
            }
        }
        // console.log('patterns', patterns)
        // console.log('maxPattern', maxPattern);
        // console.log('maxSize', maxSize);

        if (maxPattern === NULL) {
            this.excluded.push(letter);
        } else {
            this.included.push(letter);
            const positions = maxPattern.split('-').map(item => parseInt(item, 10));
            this.pattern = this.pattern.split('').map((item, index) => {
                if (positions.indexOf(index) !== -1) {
                    return letter;
                }
                return item;
            }).join('');
        }
        this.list = maxList;
        if (this.pattern.indexOf('_') === -1) {
            this.done = true;
        }
    }
}
export default Guesser;
