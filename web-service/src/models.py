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
'''
def createMatch():
    document={
        "_id": ''.join([random.choice(string.ascii_letters + string.digits) for n in range(32)]),
        "board":[[-1,-1,-1], [-1,-1,-1], [-1,-1,-1]],
        "turn": "X"
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