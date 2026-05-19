"""
api/v1/activities/router.py
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.user import User
from app.db.repositories.activity_repository import ActivityRepository
from app.middleware.auth import get_current_user
from app.schemas.schemas import ActivityOut
from app.services.place_service import ActivityService

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.get("", response_model=list[ActivityOut])
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = ActivityService(ActivityRepository(db))
    return await svc.get_history(current_user.id, limit=limit, offset=offset)


@router.get("/{activity_id}", response_model=ActivityOut)
async def get_activity(
    activity_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = ActivityService(ActivityRepository(db))
    return await svc.get_activity(activity_id, current_user.id)
