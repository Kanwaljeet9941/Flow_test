from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.pipeline import router as pipeline_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pipeline_router)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}