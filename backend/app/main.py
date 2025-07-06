# app/main.py
from fastapi import FastAPI
from app.api.auth import auth_router
from app.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.api.flows import flow_router
from fastapi.openapi.models import APIKey, APIKeyIn, SecuritySchemeType
from fastapi.openapi.utils import get_openapi
# from app.api import gmail_auth
import os

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # only allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.include_router(auth_router)
app.include_router(flow_router)
# app.include_router(gmail_auth.router)



def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Zapier GenAI API",
        version="1.0.0",
        description="Backend for GenAI Workflow Builder",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi



@app.get("/")
def read_root():
    return {"message": "Zapier GenAI Backend Running 🚀"}


Base.metadata.create_all(bind=engine)
