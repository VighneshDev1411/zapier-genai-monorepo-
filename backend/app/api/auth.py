from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/signup", response_model=UserOut)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing: 
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(email=data.email, password_hash = hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@auth_router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user