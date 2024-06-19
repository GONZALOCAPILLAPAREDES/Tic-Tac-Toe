from flask import request, jsonify
from config import app, matches_collection
from models import createMatch
from utils.exceptions import APIError
from utils.responses import Response


@app.route("/hello")
def hello_world():
    return 'Hello, World!'

@app.route("/create", methods=["POST"])
def post_create():
    app.logger.info("[API] New /create request")
    match_id = createMatch()
    app.logger.info("[API] /create went fine")
    return Response(200, data={"matchId": match_id})

if __name__== "__main__":
    app.run(debug=False,host='0.0.0.0')