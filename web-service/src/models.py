from config import matches_collection
import random
import string
from config import app
from utils.exceptions import APIError
import traceback


'''
function used to start a new match on the database
    _id: corresponds to the future matchId
    board: 2-D array used to represnt the tic-tact-toe board
    turn: represents the user (X or O), starting with the convention that X plays first
    overall_status: if the match is on-going, finished+ who won
'''
def createMatch():
    document={
        "_id": ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)]),
        "board":[[-1,-1,-1], [-1,-1,-1], [-1,-1,-1]],
        "turn": "X",
        "current_result":{
            "status": "on-going",
            "winner": ""
        }
    }

    try: 

        app.logger.info("[DB] Creating new match with id: "+ document["_id"])

        result = matches_collection.insert_one(document)

        if (result.inserted_id == document["_id"]):
            return result.inserted_id
    
    except Exception as exception:
        app.logger.error(f"{type(exception).__name__} - {exception}")
        if app.debug:
            app.logger.error(f"{type(exception).__name__} - {traceback.format_exc()}")
        raise APIError(500,"Something went wrong")

'''
function used to check a match status on the database

Parameters: 
    matchId: identificator of the match

Returns:
    _id: corresponds to the future matchId
    board: 2-D array used to represnt the tic-tact-toe board
    turn: represents the user (X or O), starting with the convention that X plays first
'''
def getMatchStatus(matchId):
    try: 

        app.logger.info("[DB] Reading match status with id: "+ matchId)

        result = matches_collection.find_one({"_id":matchId})

        app.logger.info(f"[DB] Result find_one: {result}")

        return result

    except Exception as exception:
        app.logger.error(f"{type(exception).__name__} - {exception}")
        if app.debug:
            app.logger.error(f"{type(exception).__name__} - {traceback.format_exc()}")
        raise APIError(500,"Something went wrong")


'''
function used to start a new match on the database
    _id: corresponds to the future matchId
    board: 2-D array used to represnt the tic-tact-toe board
    turn: represents the user (X or O), starting with the convention that X plays first
'''
def execPlayerMove(matchId, playerId, x, y):

        players_turn_switch={
            "X":"O",
            "O":"X"
        }

        app.logger.info("[DB] Checking if match with id: "+ matchId+ "exists and is still on-going")
        current_match = matches_collection.find_one({"_id":matchId})

        if(not current_match):
            app.logger.error(f"[DB] The match {matchId} does not exist")
            raise APIError(code=400, description="Bad request")
        
        if current_match['current_result']['status'] == 'finished':
            app.logger.error(f"[DB] The match {matchId} is already finished!!")
            raise APIError(code=400, description="Bad request")

        if current_match["turn"] != playerId:
            app.logger.error(f"[DB] Not user {playerId} turn")
            raise APIError(code=400, description="Bad request")

        if current_match["board"][x][y] != -1:
            app.logger.error(f"[DB] The position [{x},{y}]user {playerId} tries to ocupy is not available")
            raise APIError(code=400, description="Bad request")

        
        current_match["board"][x][y] = playerId

        app.logger.info(f"[DB] Evaluating new board status")

        if not evalBoard(current_match["board"]):
            app.logger.info(f"[DB] The match is finished!! Player {playerId} wins")
            current_match["current_result"]["status"]= "finished"
            current_match["current_result"]["winner"]= playerId

        current_match["turn"] = players_turn_switch[playerId]

        try: 

            newvalues = {"$set": current_match}
            match_updated = matches_collection.update_one({"_id":matchId}, newvalues)

    
        except Exception as exception:
            app.logger.error(f"{type(exception).__name__} - {exception}")
            if app.debug:
                app.logger.error(f"{type(exception).__name__} - {traceback.format_exc()}")
            raise APIError(500,"Something went wrong")

'''
private function to evaluate the board status
'''
def evalBoard(board):
    if board[0][0] == board[1][1] == board[2][2] != -1:
        return False
    
    if board[2][2] == board[1][1] == board[0][0] != -1:
        return False

    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] != -1:
            return False
        
        if board[0][i] == board[1][i] == board[2][i] != -1:
            return False

    return True
