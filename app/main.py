from fastapi import FastAPI
from app.routes import router
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="A Banking System Simulation",
    version='1.0.0',
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(router)

@app.get("/", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME
    }