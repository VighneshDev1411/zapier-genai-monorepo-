from pydantic import BaseModel, EmailStr
from pydantic import BaseModel,  field_validator
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str



class UserOut(BaseModel):
    id: str
    email: EmailStr

    @field_validator("id", mode="before")
    @classmethod
    def convert_uuid(cls, v):
        return str(v)

    model_config = {
        "from_attributes": True  # replaces `orm_mode = True` in Pydantic v2
    }

        