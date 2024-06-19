from flask import request, jsonify
from config import app, matches_collection
from models import createMatch, getMatchStatus
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

if __name__== "__main__":
    app.run(debug=False,host='0.0.0.0')