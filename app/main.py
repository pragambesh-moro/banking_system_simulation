from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as account_router
from app.routes.auth_routes import router as auth_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="A Banking System Simulation",
    version='1.0.0',
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(account_router)

@app.get("/", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME
    }