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

const coordinatesDict: any = {
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
  const [currentPlayer, setCurrentPlayer] = useState("X")
  const [currentMatch, setCurrentMatch] = useState(INITIAL_MATCH_ID)



  const apiMatchCreate = async () => {

    try{

      const response = await httpHandler("create");
      if (response.status === 200) {

        console.log("[/create] Status:", response.status);
        console.log("[/create] MatchId:", response?.data);

        return response?.data.matchId;

      } else if (response.status === 444) {
        resetBoard()
        console.error("[/create] Status", response.status, "Message:", response.data);

      }

    }catch(err){
      resetBoard()
      console.error("[/create] Status", (err as any).response.status, "Message:", (err as any).response.data);
    }
  }


  const apiMatchMove = async (cellClicked: number) => {

    try{

      const body: any = {
        "matchId": currentMatch,
        "playerId": currentPlayer,
        "square": coordinatesDict[cellClicked]
      }

      const response = await httpHandler("move", body);
      if (response.status === 200) {

        console.log("[/move] Status:", response.status);
        //console.log("[/move] MatchId:", response?.data);
        return true;

      } else if (response.status === 444) {
        resetBoard()
        console.error("[/move] Status", response.status, "Message:", response.data);
        return false;

      }

    }catch(err){
      resetBoard()
      console.error("[/move] Status", (err as any).response.status, "Message:", (err as any).response.data);
    }
  }


  const apiMatchStatus = async () => {

    try{

      let body2: any = {
        "matchId":currentMatch
      }

      console.log('/status body:', body2)

      const response = await httpHandler("status", body2);
      if (response.status === 200) {

        console.log("[/status] Status:", response.status);
        console.log("[/status] Match state:", response?.data);

        return response?.data;

      } else if (response.status === 444) {
        resetBoard()
        console.error("[/status] Status", response.status, "Message:", response.data);
        return false;

      }

    }catch(err){
      resetBoard()
      console.error("[/status] Status", (err as any).response.status, "Message:", (err as any).response.data);
    }
  }


  const resetBoard = () => {
    console.log('[resetBoard] Done!!')
    setCurrentMatch(INITIAL_MATCH_ID)
    setGameState(INITIAL_STATE)
    setCurrentPlayer('X')
  }

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };


  useEffect(()=> {
    if(currentMatch === "")
       apiMatchCreate().then((newMatchId) => {
        setCurrentMatch(newMatchId);
        console.log('CURRENT_MATCH: ', newMatchId)

      })

    }, [currentMatch])


  useEffect(()=> {
    console.log('CHECKING WINNER FOR MATCH: ', currentMatch)
    checkWinner()
    }, [currentPlayer])


  const checkWinner = () => {

    let roundWon = false; 

    console.log('BOARD Status', gameState)
    if (currentMatch != ""){
      apiMatchStatus().then((match?) => {

        console.log('Is there a winner?', match.current_result.winner);

        if(match.current_result.winner != ""){
          roundWon = true;
        }

        if(roundWon){
          setTimeout(()=> {
            window.alert(`Congrats player ${match.current_result.winner}, you won!!`);
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

      }).catch((err: Error) => {
      
        console.error('[checkWinner] Something went wrong when /status', err)
        return;

      });

    }
    
  }

  const handleSquareClicked = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"))

    console.log('CHECKING STATUS OF MATCH: ', currentMatch);

    apiMatchStatus().then((match?) => {

      console.log('Board position value:', match.board[coordinatesDict[cellIndex]['x']][coordinatesDict[cellIndex]['y']])

      if (match.turn != currentPlayer || match.board[coordinatesDict[cellIndex]['x']][coordinatesDict[cellIndex]['y']] != -1 || match.current_result.status != "on-going"){

        console.error('[handleSquareClicked] Trying to do a forbiden move')

        setTimeout(()=> {
          window.alert(`Follow the rules!!`);
          return;
        }, 450)

      }else {

        apiMatchMove(cellIndex).then( (updateOK) =>{

          if (updateOK){
            const newValues = [...gameState];
            newValues[cellIndex] = currentPlayer;
            setGameState(newValues);
            changePlayer();
    
          }else{
            console.error('[handleSquareClicked] Failed because of DB updation')
          }
    
        }).catch((err: Error) => {
    
          console.error('[handleSquareClicked] Something went wrong when /move', err)
          return;
    
        });


      }
    }).catch((err: Error) => {

      console.error('[handleSquareClicked] Something went wrong when /status', err)
      return;

    });


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
