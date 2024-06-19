from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS
from logging.config import dictConfig
from utils.logger import logger_options
from utils.err_handler import err_handler


#logger configuration
dictConfig(logger_options)


# app initialization
app = Flask(__name__)
app.errorhandler(Exception)(err_handler)

#enable cross origin requests
CORS(app)


#database initialization
app.logger.info("Connecting to DB")
mongoclient = MongoClient("mongodb://mongo:27017/")
tictactoe_db = mongoclient["tictactoe"]
matches_collection = tictactoe_db["matches"]

