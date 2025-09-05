import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GuessGame from './Guess-game'
function App() {
    const [wordSize, setWordSize] = useState(2)
    console.log('wordSize', wordSize, parseInt(wordSize, 10))
    const [gameStarted, setGameStarted] = useState(false)
    if (gameStarted) {
        return <GuessGame wordSize={parseInt(wordSize, 10)} />
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
            <h1>Vite + React</h1>
            <div className="card">
                Play Evil Hangman, choose wordsize and get started

                <input type="number" id="wordSize" name="wordSize" min="2" max="15" value={wordSize} onChange={(e) => {
                    setWordSize(e.target.value)
                }} />
                <button disabled={isNaN(parseInt(wordSize, 10))} onClick={() => setGameStarted(true)}>
                    Get Started
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
