"""
api/v1/rewards/router.py
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.user import User
from app.middleware.auth import get_current_user
from app.schemas.schemas import RedeemOfferOut
from app.services.place_service import RewardService

router = APIRouter(prefix="/rewards", tags=["Rewards"])


@router.get("/offers", response_model=list[RedeemOfferOut])
async def list_offers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await RewardService(db).list_offers()


# ─── Notifications ────────────────────────────────────────────────────────────

from app.db.repositories.activity_repository import NotificationRepository
from app.schemas.schemas import NotificationOut, MessageResponse
from app.services.place_service import NotificationService

notif_router = APIRouter(prefix="/notifications", tags=["Notifications"])


@notif_router.get("", response_model=list[NotificationOut])
async def get_notifications(
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = NotificationService(NotificationRepository(db))
    return await svc.get_notifications(current_user.id, unread_only=unread_only)


@notif_router.post("/mark-read", response_model=MessageResponse)
async def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = NotificationService(NotificationRepository(db))
    await svc.mark_all_read(current_user.id)
    return MessageResponse(message="All notifications marked as read")
