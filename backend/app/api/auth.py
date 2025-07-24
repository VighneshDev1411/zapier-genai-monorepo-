from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user
import os
from fastapi import Request
from fastapi.responses import RedirectResponse
from app.services.auth_service import oauth
import logging
from datetime import timedelta

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/signup", response_model=UserOut)
def signup(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing: 
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(email=data.email, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@auth_router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(
    data={
        "sub": str(user.id),
        "name": user.name  # ✅ INCLUDE THIS
    },
    expires_delta=timedelta(hours=1)
)
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@auth_router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = request.url_for('google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@auth_router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        # Get the authorization code and exchange it for tokens
        
        token = await oauth.google.authorize_access_token(request)
        
        print("Full token", token)

        # Parse the ID token to get user information
        # user_info = await oauth.google.parse_id_token(request, token)
        
        # if not user_info:
        #     raise HTTPException(status_code=400, detail="Failed to get user information from Google")
        
        user_info = token.get("userinfo")  # Already parsed by Authlib
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to extract user info from token")


        email = user_info.get("email")
        name = user_info.get("name", "")  # Provide default if name is missing
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user for Google OAuth
            user = User(
                email=email, 
                name=name, 
                password_hash=None  # Google users don't have password
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user's name if it's empty and Google provides one
            if not user.name and name:
                user.name = name
                db.commit()
        
        # Create access token - use user.id for consistency with regular login
        access_token = create_access_token({"sub": str(user.id)})
        
        # Redirect to frontend with token
        frontend_redirect = f"http://localhost:3000/login/success?token={access_token}"
        return RedirectResponse(url=frontend_redirect)
        
    except Exception as e:
        logging.error(f"Google OAuth error: {str(e)}")
        # Redirect to frontend with error
        error_redirect = f"http://localhost:3000/login/error?message={str(e)}"
        return RedirectResponse(url=error_redirect)