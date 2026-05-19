"""
api/v1/quests/router.py — quest controller.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.user import User
from app.db.repositories.quest_repository import QuestRepository
from app.db.repositories.activity_repository import ActivityRepository
from app.db.repositories.profile_repository import ProfileRepository
from app.middleware.auth import get_current_user
from app.schemas.schemas import (
    QuestOut, StartQuestResponse, SubmitQRRequest, SubmitQRResponse,
    ClaimRewardRequest, ClaimRewardResponse,
)
from app.services.quest_service import QuestService

router = APIRouter(prefix="/quests", tags=["Quests"])


def _build_service(db: AsyncSession) -> QuestService:
    return QuestService(
        quest_repo=QuestRepository(db),
        activity_repo=ActivityRepository(db),
        profile_repo=ProfileRepository(db),
    )


@router.get("", response_model=list[QuestOut])
async def list_quests(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all active quests."""
    return await _build_service(db).list_quests(limit=limit, offset=offset)


@router.get("/today", response_model=QuestOut)
async def get_todays_quest(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the featured quest for today."""
    return await _build_service(db).get_todays_quest()


@router.get("/{quest_id}", response_model=QuestOut)
async def get_quest(
    quest_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _build_service(db).get_quest(quest_id)


@router.post("/{quest_id}/start", response_model=StartQuestResponse)
async def start_quest(
    quest_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _build_service(db).start_quest(quest_id, current_user.id)


@router.post("/submit-qr", response_model=SubmitQRResponse)
async def submit_qr(
    body: SubmitQRRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _build_service(db).submit_qr(body.quest_id, body.qr_code_data, current_user.id)


@router.post("/claim-reward", response_model=ClaimRewardResponse)
async def claim_reward(
    body: ClaimRewardRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _build_service(db).claim_reward(body.quest_id, body.method, current_user.id)
