from flask import request, jsonify
from config import app, matches_collection
from models import createMatch, getMatchStatus, execPlayerMove
from utils.exceptions import APIError
from utils.responses import Response


@app.route("/hello")
def hello_world():
    return 'Hello, World!'

@app.route("/create", methods=["POST"])
def post_create():
    app.logger.info("[API] New POST /create request")
    match_id = createMatch()
    app.logger.info("[API] POST /create went fine")
    return Response(200, data={"matchId": match_id})


@app.route("/status", methods=["GET"])
def get_status():
    app.logger.info("[API] New GET /status request")

    matchId = request.json.get("matchId")

    if not matchId or not isinstance(matchId, str):
        app.logger.error("[API] GET /status missing correct matchId")
        raise APIError(code=400, description="Bad Request")

    result = getMatchStatus(matchId)

    app.logger.info("[API] GET /status went fine")
    return Response(200, data=result)


@app.route("/move", methods=["POST"])
def post_move():
    app.logger.info("[API] New POST /move request")

    matchId = request.json.get("matchId")
    playerId = request.json.get("playerId")
    x = request.json.get("square").get("x")
    y = request.json.get("square").get("y")

    if not matchId or not isinstance(matchId, str):
        app.logger.error("[API] POST /move missing correct matchId "+ matchId)
        raise APIError(code=400, description="Bad Request")
    

    if not playerId or (playerId != "O" and playerId != "X"):
        app.logger.error("[API] POST /move missing correct playerId " + playerId)
        raise APIError(code=400, description="Bad Request")


    if not isinstance(x, int) or not isinstance(y, int):
        app.logger.error("[API] POST /move missing correct x or y")
        raise APIError(code=400, description="Bad Request")
    
    result = execPlayerMove(matchId, playerId, x, y)

    app.logger.info("[API] POST /move went fine")
    return Response(200, data="")


if __name__== "__main__":
    app.run(debug=False,host='0.0.0.0')