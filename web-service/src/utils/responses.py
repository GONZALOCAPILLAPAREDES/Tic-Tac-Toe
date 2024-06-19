from typing import Any 
from flask import make_response, jsonify

class Response:
    def __new__(self, status_code: int, data: Any):
        return make_response(jsonify(data), status_code)