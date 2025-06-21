from fastapi import FastAPI
import auth.auth_api
app = FastAPI(
    title="Daily Sales API", # Add a title for your API
    description="A FastAPI application for daily sales management, including user authentication.",
    version="0.1.0"
)
app.include_router(auth.auth_api.router)

@app.get("/")
def hello_world():
    return {"message": "Hello World from Main API!"}