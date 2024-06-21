import traceback
from utils.responses import Response

from flask import current_app

def err_handler(exception: Exception):

    if hasattr(exception,"description") and hasattr(exception,"code"):
        current_app.logger.error(f"{type(exception).__name__} - {exception.code}: {exception.description}")
        return Response(exception.code, data={"error":exception.description})

    current_app.logger.error(f"{type(exception).__name__} - {exception}")
    if current_app.debug:
        current_app.logger.error(f"{type(exception).__name__} - {traceback.format_exc()}")

    return Response(500, data={"error":"Something went wrong"})