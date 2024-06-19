import traceback
from utils.responses import Response

from flask import current_app

def err_handler(exception: Exception):
    current_app.logger.error(f"{type(exception).__name__} - {exception}")
    if current_app.debug:
        current_app.logger.error(f"{type(exception).__name__} - {traceback.format_exc()}")

    if exception.code and exception.description:
        return Response(exception.code, data={"error":exception.description})

    return Response(500, data={"error":"Something went wrong"})