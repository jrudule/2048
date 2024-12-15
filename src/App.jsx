import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [board, setBoard] = useState(Array(4).fill(Array(4).fill('')));
  // To set pressed key in keyboard
  const [keyWord, setKeyWord] = useState(null); 
  const [isEnded, setIsEnded] = useState(false);


  function startGame() {    
    const emptyCells = [];
    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (!cell) emptyCells.push([rIndex, cIndex]);
      });
    }); 

    const [firstStartingRol, firstStartingCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const [secondStartingRol, secondStartingCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => 
        ((rIndex === firstStartingRol && cIndex === firstStartingCol) || 
        (rIndex === secondStartingRol && cIndex === secondStartingCol) 
        ? 2 : cell)
      )
    );

    setBoard(newBoard);

  }

  function pushToSides(line, pressedKey) {
    var nonEmpty = line.filter((val) => val !== ''); 
    console.log(line);
    if (pressedKey === 'LEFT' || pressedKey === 'UP') {
      if(nonEmpty.length > 1){ 
        for (let i = 0; i < nonEmpty.length; i++) {
          if(nonEmpty[i] === nonEmpty[i+1]){
            console.log(i, nonEmpty[i]);
            nonEmpty[i] = nonEmpty[i] + nonEmpty[i+1];
            nonEmpty[i+1] = '';
             
          }
        }
         nonEmpty = nonEmpty.filter((val) => val !== '');    
      }
    }

    if (pressedKey === 'RIGHT' || pressedKey === 'DOWN') {
      if(nonEmpty.length > 1){ 
        for (let i = nonEmpty.length-1; i >= 0 ; i--) {
          if(nonEmpty[i] === nonEmpty[i-1]){
            nonEmpty[i] = nonEmpty[i] + nonEmpty[i-1];
            nonEmpty[i-1] = '';    
          }
        }
        nonEmpty = nonEmpty.filter((val) => val !== '');  
      }
    }

    const emptyCount = line.length - nonEmpty.length;
    var result = [];
    
    if (pressedKey === 'RIGHT' || pressedKey === 'DOWN') {
      result = Array(emptyCount).fill('').concat(nonEmpty); 

    }
    if (pressedKey === 'LEFT' || pressedKey === 'UP') {
      result = nonEmpty.concat(Array(emptyCount).fill('')); 
    }

    return result;
  }

  function newNumber(board) {
    const emptyCells = [];
    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (!cell) emptyCells.push([rIndex, cIndex]);
      });
    }); 

    const newNumbers = [2, 2, 2, 4]; // 2 appears 3 times, 4 appears once
    const randomNewNumber = Math.floor(Math.random() * newNumbers.length);
    const [newRow, newCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => 
        (rIndex === newRow && cIndex === newCol ? newNumbers[randomNewNumber] : cell)
      )
    );

    return newBoard;
  }

  function moveNumbers(board, pressedKey) {
    var newBoard = [];
    if (pressedKey === 'LEFT' || pressedKey === 'RIGHT') {
      for (let row of board) {
        newBoard.push(pushToSides(row, pressedKey));
      }
    }
    if (pressedKey === 'UP' || pressedKey === 'DOWN') {
      for (let col = 0; col < board[0].length; col++) {
        const column = board.map((row) => row[col]);
        const newColumn = pushToSides(column, pressedKey);
        newBoard = board;
        
        for (let row = 0; row < board.length; row++) {
          newBoard[row][col] = newColumn[row];
        }
      }   
    }

    newBoard = newNumber(newBoard);
    console.log(newBoard);
    setBoard(newBoard);
  }

  useEffect(() => {
    function changeDirection(event) {
      const key = event.keyCode;
      setKeyWord((prevKeyWord) => {
        if (key === 37 || key === 65) {moveNumbers(board, 'LEFT'); return 'LEFT';}
        if (key === 38 || key === 87) {moveNumbers(board, 'UP'); return 'UP';}
        if (key === 39 || key === 68) {moveNumbers(board, 'RIGHT'); return 'RIGHT';}
        if (key === 40 || key === 83) {moveNumbers(board, 'DOWN'); return 'DOWN';}
        return prevKeyWord;
      });
    }

    window.addEventListener('keydown', changeDirection);
    return () => {
      window.removeEventListener('keydown', changeDirection);
    };
  }, [board]);




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
