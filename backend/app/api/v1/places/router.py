"""
api/v1/places/router.py
"""
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.user import User
from app.db.repositories.place_repository import PlaceRepository, SavedPlaceRepository
from app.middleware.auth import get_current_user
from app.schemas.schemas import PlaceOut, ToggleSavedPlaceResponse
from app.services.place_service import PlaceService

router = APIRouter(prefix="/places", tags=["Places"])


def _svc(db): return PlaceService(PlaceRepository(db), SavedPlaceRepository(db))


@router.get("", response_model=list[PlaceOut])
async def list_places(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _svc(db).list_places(limit=limit, offset=offset)


@router.get("/saved", response_model=list[PlaceOut])
async def get_saved_places(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _svc(db).get_saved_places(current_user.id)


@router.get("/{place_id}", response_model=PlaceOut)
async def get_place(
    place_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _svc(db).get_place(place_id)


@router.post("/{place_id}/toggle-save", response_model=ToggleSavedPlaceResponse)
async def toggle_save(
    place_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _svc(db).toggle_saved(current_user.id, place_id)
