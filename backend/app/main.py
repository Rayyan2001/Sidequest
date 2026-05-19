"""
main.py — FastAPI application factory.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as user_router
from app.api.v1.quests.router import router as quest_router
from app.api.v1.places.router import router as place_router
from app.api.v1.activities.router import router as activity_router
from app.api.v1.rewards.router import router as reward_router, notif_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.db.database import engine
from app.db.models import *  # noqa — ensure models are imported for Alembic


# ─── Rate Limiter ─────────────────────────────────────────────────────────────

limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.rate_limit_per_minute}/minute"])


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — verify DB connectivity
    async with engine.begin() as conn:
        await conn.run_sync(lambda _: None)
    yield
    # Shutdown — dispose pool
    await engine.dispose()


# ─── App factory ─────────────────────────────────────────────────────────────

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Rate limiting ─────────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Routers ───────────────────────────────────────────────────────────────
    prefix = settings.api_prefix
    app.include_router(auth_router, prefix=prefix)
    app.include_router(user_router, prefix=prefix)
    app.include_router(quest_router, prefix=prefix)
    app.include_router(place_router, prefix=prefix)
    app.include_router(activity_router, prefix=prefix)
    app.include_router(reward_router, prefix=prefix)
    app.include_router(notif_router, prefix=prefix)

    # ── Global exception handlers ─────────────────────────────────────────────
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=exc.headers or {},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        # In production, don't leak stack traces
        detail = str(exc) if settings.is_development else "Internal server error"
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": detail},
        )

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "ok", "version": settings.app_version, "env": settings.app_env}

    return app


app = create_app()
