from flask import request, jsonify
from config import app, matches_collection
from models import createMatch

@app.route("/hello")
def hello_world():
    return 'Hello, World!'

@app.route("/create", methods=["POST"])
def post_create():
    match_id = createMatch()
    return jsonify({"matchId": match_id})

if __name__== "__main__":
    app.run(debug=True,host='0.0.0.0')