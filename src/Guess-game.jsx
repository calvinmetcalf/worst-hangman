import { useState, useEffect } from 'react'
const blank = '________________'
const NULL = Symbol('null');
const findOccences = (word, letter) => {
    const out = [];
    let pos;
    if (!letter) {
        return out;
    }
    while (true) {
        const thisPos = word.indexOf(letter, pos);
        if (thisPos === -1) {
            return out;
        }
        out.push(thisPos);
        pos = thisPos + 1;
    }
}
const updateGuess = (letter, excluded, included, wordList, pattern) => {
    if (!letter) { throw new Error('no letter!') }
    const patterns = new Map();
    let newPattern = pattern;
    patterns.set(NULL, []);
    for (const word of wordList) {
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
        if (list.length > maxSize) {
            maxPattern = pattern;
            maxList = list;
            maxSize = list.length;
        }
    }

    if (maxPattern === NULL) {
        excluded.push(letter);
    } else {
        included.push(letter);
        const positions = maxPattern.split('-').map(item => parseInt(item, 10));
        newPattern = pattern.split('').map((item, index) => {
            if (positions.indexOf(index) !== -1) {
                return letter;
            }
            return item;
        }).join('');
    }
    return [excluded, included, maxList, newPattern]
}

export default ({ wordSize }) => {
    const [wordList, setWordList] = useState(false);
    const [loadingWordlist, setLoadingWordList] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [pattern, setPattern] = useState(false);
    const [excluded, setExcluded] = useState([]);
    const [included, setIncluded] = useState([]);
    const [done, setDone] = useState(false)
    const [message, setMessage] = useState(false);
    const [currentGuess, setCurrentGuess] = useState('');
    const [valid, setValid] = useState(false);
    useEffect(() => {
        const func = async () => {
            if (!wordList && !loadingWordlist) {
                setLoadingWordList(true);
                const resp = await fetch(`/words-${wordSize}.json`);
                if (!resp.ok) {
                    setLoadingError(resp.statusText);
                    setLoadingWordList(false);
                }
                const list = await resp.json();
                setLoadingWordList(false);
                setWordList(list);
                setPattern(blank.slice(0, wordSize))
            }
        }
        func().catch((e) => {
            console.log('on noes!', e.message)
        });
    }, [wordSize]);
    if (loadingWordlist) {
        return <div>Loading, please wait</div>;
    }
    if (loadingError) {
        return <div>{`Error: ${loadingError}`}</div>;
    }
    const validate = (rawLetter) => {
        if (!rawLetter) {
            return;
        }
        if (typeof rawLetter !== 'string' || rawLetter.length > 1 || !rawLetter.match(/[A-Za-z]/)) {
            setMessage('not a letter');
            return false;
        }
        const letter = rawLetter.toUpperCase();
        if (excluded.includes(letter) || included.includes(letter)) {
            setMessage(`already guessed ${letter}`);
            return false;
        }
        return letter;
    }
    const guessLetter = () => {
        const [newExcluded, newIncluded, newWordlist, newPattern] = updateGuess(currentGuess, excluded, included, wordList, pattern);
        setExcluded(newExcluded)
        setIncluded(newIncluded);
        setWordList(newWordlist);
        setPattern(newPattern);
        if (newPattern.indexOf('_') === -1) {
            setDone(true)
        }
        setCurrentGuess('');
        setValid(false)
    }
    return <div>
        <h1 style={{
            letterSpacing: '1px',
            fontSize: '3em'
        }}>{pattern}{done ? '🎉' : ''}</h1>
        <p>guesses: <>{excluded.map(item => <span style={{ color: 'red' }} key={item}>{item}</span>)}</><>{included.map(item => <span style={{ color: 'green' }} key={item}>{item}</span>)}</></p>

        {!done && <form onSubmit={(e) => {
            e.preventDefault();
            if (valid) {
                guessLetter();
            }
        }}>
            <label htmlFor="guess">Guess A Letter ({wordList.length} possible guesses)</label>
            <input type="text"
                id='guess'
                name='guess'
                maxLength='1'
                value={currentGuess}
                onChange={(e) => {
                    setMessage(false)
                    const rawValue = e.target.value;
                    const letter = validate(rawValue);
                    if (letter) {
                        setCurrentGuess(letter)
                        setValid(true);
                    } else {
                        setCurrentGuess(rawValue)
                        setValid(false)
                    }
                }}
            />
            <input type='submit' disabled={!valid} onClick={guessLetter} value='Submit Guess' />
            {message && <div><p>{message}</p></div>}
        </form>}
        {done && <div>
            Success, only {excluded.length + included.length} guesses!
        </div>}
    </div >
}