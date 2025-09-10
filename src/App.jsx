import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GuessGame from './Guess-game'
function App() {
    const [wordSize, setWordSize] = useState(2)
    const [mode, setMode] = useState('classic')
    const [gameStarted, setGameStarted] = useState(false)
    if (gameStarted) {
        return <GuessGame wordSize={parseInt(wordSize, 10)} mode={mode} />
    }
    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Worst Hangman</h1>
            <div className="card">
                Play Evil Hangman, choose wordsize and decide between 'classic mode' (where you have to guess all the letters) vs fast mode (where you just have to make your opponet narrow it down to one possible word).
                <select onChange={(e) => {
                    console.log('e', e.target.value)
                    setMode(e.target.value)
                }} value={mode}>
                    <option value='classic'>Classic Mode</option>
                    <option value='fast'>Fast Mode</option>
                </select>
                <input type="number" id="wordSize" name="wordSize" min="2" max="15" value={wordSize} onChange={(e) => {
                    setWordSize(e.target.value)
                }} />
                <button disabled={isNaN(parseInt(wordSize, 10))} onClick={() => setGameStarted(true)}>
                    Get Started
                </button>
                <p>
                    Imagine the worst game of hangman, where instead of picking a word your opponent just wings it, every time you guess a letter, your opponent looks at the possible results (no letter or letter in one or more spots) and picks the one that leaves the most possible choices left.
                </p>
            </div>
        </>
    )
}

export default App
