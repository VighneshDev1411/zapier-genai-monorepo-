from pydantic import BaseModel

class RunInput(BaseModel):
    input: str
