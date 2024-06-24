import { useState, useEffect } from "react";

import Square from "./components/Square";

const INITIAL_STATE = ["", "", "", "", "", "", "", "", ""]
const WINNING_COMBOS= [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Game() {
  const [gameState, setGameState] = useState(INITIAL_STATE)
  const [currentPlayer, setCurrentPlayer] = useState("O")


  const resetBoard = () => setGameState(INITIAL_STATE)

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  useEffect(()=> {
    checkWinner()
    }, [gameState])


  const checkWinner = () => {

    let roundWon = false; 

    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes("")) {
        continue;
      }

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if(roundWon){
      setTimeout(()=> {
        window.alert(`Congrats player ${currentPlayer}, you won!!`);
        resetBoard();
        return;
      }, 450)
    }

    if(!gameState.includes("")){
      setTimeout(()=> {
        window.alert(`Draw here!!`);
        resetBoard()
        return;
      }, 450)
    }

    changePlayer();
    
  }

  const handleSquareClicked = (event: any) => {
    console.log("CLICKEDDDD", event.target.getAttribute("data-cell-index"));
    const cellIndex = Number(event.target.getAttribute("data-cell-index"))

    const currentValue = gameState[cellIndex];
    console.log('CURRENT', currentValue)

    if (currentValue) {
      return;
    }

    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  }




  return (
  <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-zinc-800 to-zinc-900">
    <h1 className="text-center text-5xl mb-4 font-display text-white">
      Tic Tac Toe
    </h1>
    <div>

        <div className="grid grid-cols-3 gap-3 mx-auto w-96">
          {gameState.map((player, index) => (
            <Square 
              key={index}
              index={index}
              onClick={handleSquareClicked}
              player= {player}            
            />
          ))}
        </div>
    </div>
  </div>
    );
  }


export default Game
