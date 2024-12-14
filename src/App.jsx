import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [board, setBoard] = useState(Array(4).fill(Array(4).fill('')));
  const [isEnded, setIsEnded] = useState(false);

  function startGame() {

    const [firstStartingRol, firstStartingCol] = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];

    const emptyCells = [];
    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (!cell) emptyCells.push([rIndex, cIndex]);
      });
    }); 

    const [secondStartingRol, secondStartingCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => 
        ((rIndex === firstStartingRol && cIndex === firstStartingCol) || 
        (rIndex === secondStartingRol && cIndex === secondStartingCol) 
        ? '2' : cell)
      )
    );

    setBoard(newBoard);

  }


  return (
    <> 
      <div className={`${isStarted ? 'hidden' : ''} ${isEnded ? 'hidden' : ''}`}>
        <h1>2048</h1>
        <button className='startButton' onClick={() => startGame()}>
          Start
        </button>
      </div>

      <div className='board'>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((symbol, colIndex) => (
              <div key={colIndex} className="col"
              >
                {symbol}
              </div>
            ))}      
          </div>
        ))}
      </div>
    </>
  )
}

export default App
