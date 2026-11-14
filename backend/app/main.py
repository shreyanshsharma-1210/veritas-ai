import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.session import init_db
from app.api.v1.diagnosis import router as diagnosis_router
from app.api.v1.debate import router as debate_router
from app.api.v1.recommendations import router as recommendations_router
from app.api.v1.sessions import router as sessions_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veritas_ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Veritas AI database tables...")
    await init_db()
    logger.info("Veritas AI backend ready.")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic AI Sales & Business Decision Intelligence Platform — Diagnose → Debate → Decide",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(diagnosis_router, prefix=settings.API_V1_STR)
app.include_router(debate_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(sessions_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Veritas AI Backend",
        "version": settings.VERSION,
        "default_provider": settings.DEFAULT_LLM_PROVIDER,
        "active_model": settings.GROQ_MODEL,
        "groq_key_1_active": bool(settings.GROQ_API_KEY),
        "groq_key_2_active": bool(settings.GROQ_API_KEY_SECONDARY),
        "gemini_key_active": bool(settings.GEMINI_API_KEY),
        "closer_agent_provider": "Groq Key #1" if settings.GROQ_API_KEY else "Mock Provider",
        "skeptic_agent_provider": "Groq Key #2" if settings.GROQ_API_KEY_SECONDARY else ("Groq Key #1" if settings.GROQ_API_KEY else "Mock Provider"),
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs"
    }

