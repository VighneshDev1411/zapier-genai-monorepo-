from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret")
ALGORITHM = "HS256"


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    print("🔑 Raw token received:", token)

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("📦 Decoded JWT payload:", payload)

        user_id: str = payload.get("sub")
        if user_id is None:
            print("❌ No 'sub' in token payload")
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        print("❌ JWT Decode error:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user: 
        print("❌ User not found in DB for ID:", user_id)
        raise HTTPException(status_code=404, detail="User not found")

    return user
