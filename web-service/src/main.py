from flask import request, jsonify
from config import app, matches_collection

@app.route("/hello")
def hello_world():
    return 'Hello, World!'

if __name__== "__main__":
    app.run(debug=True,host='0.0.0.0')