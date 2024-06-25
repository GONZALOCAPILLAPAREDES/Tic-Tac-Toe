import { useState, useEffect } from "react";
import Square from "./Square";
import {httpHandler} from "../utils/http-handler"

const INITIAL_STATE = ["", "", "", "", "", "", "", "", ""]

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

  /** useStates initialization
   *  useState(INITIAL_STATE) is for keeping the board status during a match
   *  useState("X") is for keeping the turn status during a match 
   *  useState(INITIAL_MATCH_ID) is for keeping the matchId during a match
   * **/
  const [gameState, setGameState] = useState(INITIAL_STATE)
  const [currentPlayer, setCurrentPlayer] = useState("X")
  const [currentMatch, setCurrentMatch] = useState(INITIAL_MATCH_ID)


  /**
   * function to communicate with the back-end for creating a new match  via API
   * @returns matchId of the new tictactoe match
   */
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

  /**
   * function to communicate with the back-end for updating a existing match via API
   * @returns true/false depending if the movement wa successful
   */
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

  /**
   * function to communicate with the back-end for checking status of a existing match via API
   * @returns the tictactoe match object in JSON format
   */
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

  /**
   * function to set game parameters to default values
   * @returns void
   */
  const resetBoard = () => {
    setCurrentMatch(INITIAL_MATCH_ID);
    setGameState(INITIAL_STATE);
    setCurrentPlayer('X');
    console.log('[resetBoard] Done!!');
  }



  /**
   * function to change players  turn
   * @returns void
   */
  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    console.log('[changePlayer] Done!!');

  };



  /**
   * for detecting when the currentMatch has changed  
   */
  useEffect(()=> {
    if(currentMatch === "")
       apiMatchCreate().then((newMatchId) => {
        setCurrentMatch(newMatchId);
        console.log('CURRENT_MATCH: ', newMatchId)

      })

    }, [currentMatch])


    /**
   * for checking winner everytime the player turn changes
   */
  useEffect(()=> {
    console.log('CHECKING WINNER FOR MATCH: ', currentMatch)
    checkWinner()
    }, [currentPlayer])

  /**
   * function to handle the game status for every turn
   */
  const checkWinner = () => {

    let roundWon = false; 

    console.log('BOARD Status', gameState)

    // if we are currently playing
    if (currentMatch != ""){

      // we check if the match has already a winner
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

    /**
   * function to handle the square component onClick
   */
  const handleSquareClicked = (event: any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"))

    console.log('CHECKING STATUS OF MATCH: ', currentMatch);

    // checking if the game status allows to continue playing
    apiMatchStatus().then((match?) => {

      if (match.turn != currentPlayer || match.board[coordinatesDict[cellIndex]['x']][coordinatesDict[cellIndex]['y']] != -1 || match.current_result.status != "on-going"){

        console.error('[handleSquareClicked] Trying to do a forbiden move')

        setTimeout(()=> {
          window.alert(`Follow the rules!!`);
          return;
        }, 450)

      }else {

        // if the move is correct
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
