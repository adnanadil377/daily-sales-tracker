from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth.auth_api
from api import api,sales_api,daily

app = FastAPI(
    title="Daily Sales API",
    description="A FastAPI application for daily sales management, including user authentication.",
    version="0.1.0"
)

# CORS origins: Add your frontend URLs here
origins = [
    "http://localhost:5173",  # Corrected the CORS URL
    # Add more origins if needed, like a deployed frontend
]

# Middleware: Allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allowed frontend origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

# Include routers
app.include_router(auth.auth_api.router)
app.include_router(api.router)    
app.include_router(sales_api.router)
app.include_router(daily.router)

# Root route
@app.get("/")
def hello_world():
    return {"message": "Hello World from Main API!"}
