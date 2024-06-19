
#Error Class for API
class APIError(Exception):
  def __init__(self, code, description):
    self.code = code
    self.description = description
  
#...
