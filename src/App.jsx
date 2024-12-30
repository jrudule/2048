import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [board, setBoard] = useState(Array(4).fill(Array(4).fill('')));
  // To set pressed key in keyboard
  const [keyWord, setKeyWord] = useState(null); 
  const [isWinner, setIsWinner] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  function getRandomNumber() {
    const random = Math.random();
    return random < 0.75 ? 2 : 4;
  }

  function startGame() {
      
    const [firstStartingRol, firstStartingCol] = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
    const emptyCells = [];
    
    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (rIndex === firstStartingRol && cIndex === firstStartingCol) {} 
        else {
          emptyCells.push([rIndex, cIndex]);
        }
      });
    }); 

    const [secondStartingRol, secondStartingCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) => (
        ((rIndex === firstStartingRol && cIndex === firstStartingCol) || 
        (rIndex === secondStartingRol && cIndex === secondStartingCol)) 
        ? getRandomNumber() : cell
      ))
    );

    setBoard(newBoard);
    setIsStarted(true);
  }

  function pushToSides(line, pressedKey) {
    var nonEmpty = line.filter((val) => val !== ''); 
    if (pressedKey === 'LEFT' || pressedKey === 'UP') {
      if(nonEmpty.length > 1){ 
        for (let i = 0; i < nonEmpty.length; i++) {
          if(nonEmpty[i] === nonEmpty[i+1]){
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

    if (emptyCells.length > 0){

      const [newRow, newCol] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const newBoard = board.map((row, rIndex) =>
        row.map((cell, cIndex) => 
          (rIndex === newRow && cIndex === newCol ? getRandomNumber() : cell)
        )
      );


      return newBoard;
    } else {
      return board;
    }
  }

  function checkEndedLine(line) {
    var nonEmpty = line.filter((val) => val !== ''); 
    if (nonEmpty.length < 4) return false;
    for (let i = 0; i < nonEmpty.length; i++) {
      if(nonEmpty[i] === nonEmpty[i+1]){
        return false;
      }
    } 
    return true;
  }

  function checkGameEnd(board) {
    var gameEnd = [];
    var cnt = 0;

    for (let row of board) {
      gameEnd.push(checkEndedLine(row));
    }
    for (let col = 0; col < board[0].length; col++) {
      const column = board.map((row) => row[col]);
      gameEnd.push(checkEndedLine(column));
    }   
   
    for (let i = 0; i < gameEnd.length; i++) {
      if(gameEnd[i] === true){
        cnt++;
      }  
    }

    if(cnt === 8) {setIsEnded(true);}
  }

  // To check if there is 2048 
  function checkWinner (board) {
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          setIsWinner(true);
          setIsEnded(true);
        }
      });
    }); 
  }

  function moveNumbers(board, pressedKey) {
    var newBoard = [];
    if (pressedKey === 'LEFT' || pressedKey === 'RIGHT') {
      for (let row of board) {
        newBoard.push(pushToSides(row, pressedKey));
      }
    }
    if (pressedKey === 'UP' || pressedKey === 'DOWN') {
      
      newBoard = board.map((row) => [...row]);
      for (let col = 0; col < board[0].length; col++) {
        const column = board.map((row) => row[col]);
        const newColumn = pushToSides(column, pressedKey);

        for (let row = 0; row < board.length; row++) {
          newBoard[row][col] = newColumn[row];
        }
      }   
    }
 
    // So that new numbers are not added if the board does not change
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      newBoard = newNumber(newBoard);
    }

    setBoard(newBoard);
    if (isWinner === false) {checkWinner(newBoard);}
    // To check if no moves are left
    checkGameEnd(newBoard);
  }

  const colorMap = {
    2: "#B0C4DE",
    4: "#D8BFD8",
    8: "#F5DEB3",
    16: "#98FB98",
    32: "#F0E68C",
    64: "#C3B1E1",
    128: "#E6A8D7",
    256: "#A2D2FF",
    512: "#FAD2E1",
    1024: "#AFDFBA",
    2048: "#B8E2D2",
    4096: "#F9E79F",
    8192: "#C6DBDA",
  };

  useEffect(() => {
    function changeDirection(event) {
      const key = event.keyCode;
      setKeyWord((prevKeyWord) => {
        if (isEnded === false) {
          if (key === 37 || key === 65) {moveNumbers(board, 'LEFT'); return 'LEFT';}
          if (key === 38 || key === 87) {moveNumbers(board, 'UP'); return 'UP';}
          if (key === 39 || key === 68) {moveNumbers(board, 'RIGHT'); return 'RIGHT';}
          if (key === 40 || key === 83) {moveNumbers(board, 'DOWN'); return 'DOWN';}
        }
        return prevKeyWord;
      });
    }

    window.addEventListener('keydown', changeDirection);
    return () => {
      window.removeEventListener('keydown', changeDirection);
    };
  }, [board]);

  // So the game can also be played with a touchscreen
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
  
    function preventDefault(event) {
      event.preventDefault();
    }
  
    function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }
  
    function handleTouchEnd(event) {
      touchEndX = event.changedTouches[0].clientX;
      touchEndY = event.changedTouches[0].clientY;
      handleSwipe();
    }
  
    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
  
      if (isEnded === false) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // Horizontal swipe
          if (diffX > 0) {
            moveNumbers(board, 'RIGHT');
            setKeyWord('RIGHT');
          } else {
            moveNumbers(board, 'LEFT');
            setKeyWord('LEFT');
          }
        } else {
          // Vertical swipe
          if (diffY > 0) {
            moveNumbers(board, 'DOWN');
            setKeyWord('DOWN');
          } else {
            moveNumbers(board, 'UP');
            setKeyWord('UP');
          }
        }
      }
    }
  
    function disableScroll() {
      document.addEventListener('touchmove', preventDefault, { passive: false });
    }
  
    function enableScroll() {
      document.removeEventListener('touchmove', preventDefault);
    }
  
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    disableScroll(); // Disable scrolling when the component mounts
  
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      enableScroll(); // Re-enable scrolling when the component unmounts
    };
  }, [board, isEnded]);
  
  

  function restartGame() {
    setIsEnded(false);
    setIsStarted(false);
    setBoard(Array(4).fill(Array(4).fill('')));
  }

  function continueGame() {
    setIsEnded(false);
  }

  return (
    <> 
      <div className={showRules ? 'rules' : 'hidden'}>
        <div className='x' onClick={() => setShowRules(false)}>x</div>
        <h2>2048 Game Rules</h2>
        <p>The goal of 2048 is to combine cells with the same number to reach the cell 2048.</p>
        <ul>
            <li><strong>Keyboard:</strong> Use the arrow keys <strong>↑ ↓ ← →</strong> or <strong>w s a d</strong> to move cells on the board.</li>
            <li><strong>Touch:</strong> Swipe in the direction you want the snake to move.</li>
            <li>When two cells with the same number collide, they merge into one.</li>
            <li>Each move adds a new cell (2 or 4) to the board.</li>
            <li>The game ends when the board is full and no more moves are possible.</li>
        </ul>
        <p>Try to strategize and combine the cells to reach 2048 or even higher!</p>
      </div>

      <div 
        className={`
          ${isEnded ? 'hidden' : 'restartWhilePlaying'}
          ${isStarted ? 'restartWhilePlaying' : 'hidden'} 
        `} 
      >
        <button className='restartButton' onClick={() => restartGame()}>
            Restart
        </button>
      </div>

      <div className={isStarted ? 'hidden' : ''}>
        <div className={isEnded ? 'hidden' : 'start'}>
          <h1>2048</h1>
          <button className='startButton' onClick={() => startGame()}>
            Start
          </button>
          <button className='howToPlay' onClick={() => setShowRules(true)}>
            HOW TO PLAY
          </button>
        </div>
      </div>

      <div className={isEnded ? '' : 'hidden'}>
        <h1>{isWinner ? 'You win' : 'Game over'}</h1>
      </div>

      <div className={isStarted ? 'board' : 'hidden'}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((number, colIndex) => (
              <div key={colIndex} className="col"
                  style={{backgroundColor: colorMap[number] || ''}}
              >
                {number}
              </div>
            ))}      
          </div>
        ))}
      </div>

      <div className={isEnded ? 'endDiv' : 'hidden'}>
        <button 
          className={isWinner ? 'continueButton' : 'hidden'} 
          onClick={() => continueGame()}
        >
          Continue
        </button>
        <button className='restartButton' onClick={() => restartGame()}>
          Restart
        </button>
      </div>
    </>
  )
}

export default App
