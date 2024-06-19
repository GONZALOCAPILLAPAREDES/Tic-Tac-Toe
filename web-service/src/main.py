from flask import request, jsonify
from config import app, matches_collection
from models import createMatch
from utils.exceptions import APIError

@app.route("/hello")
def hello_world():
    return 'Hello, World!'

@app.route("/create", methods=["POST"])
def post_create():
    app.logger.info("[API] New match request")
    match_id = createMatch()
    app.logger.info("[API] Match creation went fine")
    return jsonify({"matchId": match_id})

if __name__== "__main__":
    app.run(debug=False,host='0.0.0.0')