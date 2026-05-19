"""
services/auth_service.py — all authentication business logic.
No HTTP handling; no direct DB calls (delegates to repos).
"""
from datetime import datetime, timedelta, timezone
from uuid import UUID

import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.exceptions import OAuthException, UnauthorizedException, ConflictException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.db.models.profile import Profile
from app.db.models.user import User, Session
from app.db.repositories.user_repository import UserRepository, SessionRepository
from app.db.repositories.profile_repository import ProfileRepository
from app.schemas.auth import TokenResponse


class AuthService:
    def __init__(
        self,
        user_repo: UserRepository,
        session_repo: SessionRepository,
        profile_repo: ProfileRepository,
    ) -> None:
        self._users = user_repo
        self._sessions = session_repo
        self._profiles = profile_repo

    # ── OAuth ────────────────────────────────────────────────────────────────

    async def social_login(
        self, provider: str, token: str, ip_address: str | None, user_agent: str | None
    ) -> TokenResponse:
        if provider == "google":
            user_info = await self._verify_google_token(token)
        elif provider == "facebook":
            user_info = await self._verify_facebook_token(token)
        else:
            raise OAuthException(f"Unsupported provider: {provider}")

        user = await self._get_or_create_oauth_user(provider, user_info)
        return await self._issue_tokens(user, ip_address, user_agent)

    async def email_signup(
        self, name: str, email: str, password: str,
        ip_address: str | None, user_agent: str | None
    ) -> TokenResponse:
        if await self._users.email_exists(email):
            raise ConflictException("An account with this email already exists")

        user = User(
            email=email.lower(),
            name=name,
            hashed_password=hash_password(password),
            provider="email",
            is_email_verified=False,
        )
        user = await self._users.create(user)
        await self._create_default_profile(user.id)
        return await self._issue_tokens(user, ip_address, user_agent)

    async def email_signin(
        self, email: str, password: str,
        ip_address: str | None, user_agent: str | None
    ) -> TokenResponse:
        user = await self._users.get_by_email(email.lower())
        if not user or not user.hashed_password:
            raise UnauthorizedException("Invalid email or password")
        if not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")
        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")
        return await self._issue_tokens(user, ip_address, user_agent)

    async def refresh_tokens(
        self, refresh_token: str,
        ip_address: str | None, user_agent: str | None
    ) -> TokenResponse:
        payload = decode_refresh_token(refresh_token)
        user_id = UUID(payload["sub"])

        session = await self._sessions.get_by_refresh_token(refresh_token)
        if not session:
            raise UnauthorizedException("Refresh token expired or revoked")

        # Rotate: revoke old, issue new
        await self._sessions.revoke_token(refresh_token)
        user = await self._users.get_by_id(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or deactivated")

        return await self._issue_tokens(user, ip_address, user_agent)

    async def logout(self, refresh_token: str) -> None:
        await self._sessions.revoke_token(refresh_token)

    # ── Internal helpers ─────────────────────────────────────────────────────

    async def _verify_google_token(self, token: str) -> dict:
        try:
            info = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.google_client_id
            )
            return {
                "provider_id": info["sub"],
                "email": info.get("email", ""),
                "name": info.get("name", ""),
                "avatar_url": info.get("picture"),
            }
        except Exception as e:
            raise OAuthException(f"Google token verification failed: {e}")

    async def _verify_facebook_token(self, token: str) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://graph.facebook.com/me",
                params={"fields": "id,name,email,picture", "access_token": token},
                timeout=10,
            )
            if resp.status_code != 200:
                raise OAuthException("Facebook token verification failed")
            data = resp.json()
            return {
                "provider_id": data["id"],
                "email": data.get("email", ""),
                "name": data.get("name", ""),
                "avatar_url": data.get("picture", {}).get("data", {}).get("url"),
            }

    async def _get_or_create_oauth_user(self, provider: str, info: dict) -> User:
        # Try provider match first (handles email change)
        user = await self._users.get_by_provider(provider, info["provider_id"])
        if user:
            # Refresh name in case it changed
            await self._users.update(user.id, {"name": info["name"]})
            return user

        # Fall back to email match (link accounts)
        if info["email"]:
            user = await self._users.get_by_email(info["email"])
            if user:
                await self._users.update(
                    user.id,
                    {"provider_id": info["provider_id"], "is_email_verified": True},
                )
                return user

        # New user
        user = User(
            email=info["email"].lower() if info["email"] else f"{provider}_{info['provider_id']}@noemail.com",
            name=info["name"] or "User",
            provider=provider,
            provider_id=info["provider_id"],
            is_email_verified=True,
        )
        user = await self._users.create(user)
        await self._create_default_profile(user.id, avatar_url=info.get("avatar_url"))
        return user

    async def _create_default_profile(self, user_id: UUID, *, avatar_url: str | None = None) -> Profile:
        profile = Profile(
            user_id=user_id,
            avatar_url=avatar_url,
            preferences={
                "notifications": {
                    "pushEnabled": True,
                    "questReminders": True,
                    "newQuests": True,
                    "rewardsOffers": True,
                    "messages": True,
                    "marketing": False,
                },
                "privacy": {
                    "activityTracking": True,
                    "locationAccess": True,
                    "biometricLogin": False,
                    "twoFactorAuth": False,
                },
            },
        )
        return await self._profiles.create(profile)

    async def _issue_tokens(
        self, user: User, ip_address: str | None, user_agent: str | None
    ) -> TokenResponse:
        access = create_access_token(user.id)
        refresh = create_refresh_token(user.id)

        session = Session(
            user_id=user.id,
            refresh_token=refresh,
            expires_at=datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days),
            ip_address=ip_address,
            user_agent=user_agent,
        )
        await self._sessions.create(session)

        return TokenResponse(
            access_token=access,
            refresh_token=refresh,
            expires_in=settings.access_token_expire_minutes * 60,
        )
