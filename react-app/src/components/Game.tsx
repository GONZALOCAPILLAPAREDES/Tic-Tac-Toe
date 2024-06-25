import { useState, useEffect } from "react";
import Square from "./Square";
import {httpHandler} from "../utils/http-handler"

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

const coordinatesDict = {
  0:{
    'x':0, 
    'y':0
  },
  1:{
    'x':0, 
    'y':1
  },
  2:{
    'x':0, 
    'y':2
  },
  3:{
    'x':1, 
    'y':0
  },
  4:{
    'x':1, 
    'y':1
  },
  5:{
    'x':1, 
    'y':2
  },
  6:{
    'x':2, 
    'y':0
  },
  7:{
    'x':2, 
    'y':1
  },
  8:{
    'x':2, 
    'y':2
  },
  
}

const INITIAL_MATCH_ID=""

function Game() {
  const [gameState, setGameState] = useState(INITIAL_STATE)
  const [currentPlayer, setCurrentPlayer] = useState("O")
  const [currentMatch, setCurrentMatch] = useState(INITIAL_MATCH_ID)



  const apiMatchCreate = async () => {

    try{

      const response = await httpHandler("create");
      if (response.status === 200) {

        console.log("Status:", response.status);
        console.log("MatchId:", response?.data);

        setCurrentMatch(response?.data.matchId);

      } else if (response.status === 444) {
        resetBoard()
        console.error("Status", response.status, "Message:", response.data);

      }

    }catch(err){
      resetBoard()
      console.error("Status", (err as any).response.status, "Message:", (err as any).response.data);
    }
  }

  const resetBoard = () => {
    setCurrentMatch(INITIAL_MATCH_ID)
    setGameState(INITIAL_STATE)
  }

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  useEffect(()=> {
    if (currentMatch === ""){
      apiMatchCreate()
    }
    console.log('CURRENT_MATCH: ', currentMatch)
    checkWinner()
    }, [gameState])


  const checkWinner = () => {

    let roundWon = false; 

    console.log('BOARD', gameState)

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
    console.log("CLICKED", event.target.getAttribute("data-cell-index"));
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
    <div className="flex flex-col space-y-4">

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
        <div className="flex flex-col space-y-2.5 items-center justify-cente">
          <button 
            className="bg-zinc-100 font-display text-5xl text-center flex justify-center items-center rounded-lg cursor-pointer"
            onClick={resetBoard}
            >
              Re-start
          </button>
        </div>

    </div>
  </div>
    );
  }


export default Game
