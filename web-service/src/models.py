from config import matches_collection
import uuid

'''
function used to start a new match on the database
    _id: corresponds to the future matchId
    board: 2-D array used to represnt the tic-tact-toe board
    turn: represents the user (X or O), starting with the convention that X plays first
'''
def createMatch():
    document={
        "_id": uuid.uuid4(),
        "board":[[-1,-1,-1], [-1,-1,-1], [-1,-1,-1]],
        "turn": "X"
    }
    try: 

        result = matches_collection.insert_one(document)

        if (result.inserted_id == document._id):
            return result.inserted_id
    
    except Exception as e:
        raise Exception("Unable to add the new document (match) to the collection, due to the following error: ", e)