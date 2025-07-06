# from fastapi import APIRouter, Request
# from fastapi.responses import RedirectResponse
# from google_auth_oauthlib.flow import Flow
# import os
# import pathlib
# from dotenv import load_dotenv


# load_dotenv()
# router = APIRouter()

# # OAuth2 client configuration
# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# # Scopes
# SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

# # Credentials location (client_secret.json file — not needed if using env vars directly)
# BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
# CLIENT_CONFIG = {
#     "web": {
#         "client_id": GOOGLE_CLIENT_ID,
#         "project_id": "zapier-genai",
#         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#         "token_uri": "https://oauth2.googleapis.com/token",
#         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#         "client_secret": GOOGLE_CLIENT_SECRET,
#         "redirect_uris": [GOOGLE_REDIRECT_URI]
#     }
# }

# # ✅ Step 1: Redirect to Google OAuth
# @router.get("/gmail/auth")
# def gmail_auth():
#     flow = Flow.from_client_config(
#         client_config=CLIENT_CONFIG,
#         scopes=SCOPES,
#         redirect_uri=GOOGLE_REDIRECT_URI
#     )
#     auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline', include_granted_scopes='true')
#     return RedirectResponse(auth_url)

# # ✅ Step 2: Google Redirects Here — We Capture Token
# @router.get("/gmail/callback")
# def gmail_callback(request: Request):
#     flow = Flow.from_client_config(
#         client_config=CLIENT_CONFIG,
#         scopes=SCOPES,
#         redirect_uri=GOOGLE_REDIRECT_URI
#     )

#     flow.fetch_token(authorization_response=str(request.url))

#     credentials = flow.credentials
#     access_token = credentials.token
#     refresh_token = credentials.refresh_token

#     # ✅ TODO: Save securely in DB or a session
#     return {
#         "access_token": access_token,
#         "refresh_token": refresh_token,
#         "expires_in": credentials.expiry.isoformat()
#     }
