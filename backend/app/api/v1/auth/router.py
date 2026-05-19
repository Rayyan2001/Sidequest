"""
api/v1/auth/router.py — auth controller (request/response only, no logic).
"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.repositories.user_repository import UserRepository, SessionRepository
from app.db.repositories.profile_repository import ProfileRepository
from app.schemas.auth import (
    SocialLoginRequest, EmailSignUpRequest, EmailSignInRequest,
    RefreshTokenRequest, LogoutRequest, TokenResponse,
)
from app.schemas.schemas import MessageResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _get_client_meta(request: Request) -> tuple[str | None, str | None]:
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    return ip, ua


def _build_service(db: AsyncSession) -> AuthService:
    return AuthService(
        user_repo=UserRepository(db),
        session_repo=SessionRepository(db),
        profile_repo=ProfileRepository(db),
    )


@router.post("/social-login", response_model=TokenResponse)
async def social_login(
    body: SocialLoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Verify OAuth token (Google/Facebook), create user if needed, return JWT pair."""
    ip, ua = _get_client_meta(request)
    service = _build_service(db)
    return await service.social_login(body.provider, body.token, ip, ua)


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def email_signup(
    body: EmailSignUpRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Register new user with email/password."""
    ip, ua = _get_client_meta(request)
    service = _build_service(db)
    return await service.email_signup(body.name, str(body.email), body.password, ip, ua)


@router.post("/signin", response_model=TokenResponse)
async def email_signin(
    body: EmailSignInRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Sign in with email/password."""
    ip, ua = _get_client_meta(request)
    service = _build_service(db)
    return await service.email_signin(str(body.email), body.password, ip, ua)


@router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(
    body: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Rotate refresh token → new access + refresh token pair."""
    ip, ua = _get_client_meta(request)
    service = _build_service(db)
    return await service.refresh_tokens(body.refresh_token, ip, ua)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    body: LogoutRequest,
    db: AsyncSession = Depends(get_db),
):
    """Revoke refresh token (client must discard access token)."""
    service = _build_service(db)
    await service.logout(body.refresh_token)
    return MessageResponse(message="Logged out successfully")
