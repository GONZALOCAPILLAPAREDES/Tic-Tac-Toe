from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS

# app initialization
app = Flask(__name__)

#enable cross origin requests
CORS(app)

#database initialization
mongoclient = MongoClient("mongodb://mongo:27017/")
tictactoe_db = mongoclient["tictactoe"]
matches_collection = tictactoe_db["matches"]

