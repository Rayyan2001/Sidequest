"""
services/place_service.py
"""
from uuid import UUID
from app.core.exceptions import NotFoundException
from app.db.repositories.place_repository import PlaceRepository, SavedPlaceRepository
from app.schemas.schemas import PlaceOut, ToggleSavedPlaceResponse


class PlaceService:
    def __init__(self, place_repo: PlaceRepository, saved_repo: SavedPlaceRepository) -> None:
        self._places = place_repo
        self._saved = saved_repo

    async def list_places(self, *, limit: int = 50, offset: int = 0) -> list[PlaceOut]:
        places = await self._places.get_active(limit=limit, offset=offset)
        return [PlaceOut.model_validate(p) for p in places]

    async def get_place(self, place_id: UUID) -> PlaceOut:
        place = await self._places.get_by_id(place_id)
        if not place:
            raise NotFoundException("Place not found")
        return PlaceOut.model_validate(place)

    async def get_saved_places(self, user_id: UUID) -> list[PlaceOut]:
        saved = await self._saved.get_for_user(user_id)
        place_ids = [s.place_id for s in saved]
        places = [await self._places.get_by_id(pid) for pid in place_ids]
        return [PlaceOut.model_validate(p) for p in places if p]

    async def toggle_saved(self, user_id: UUID, place_id: UUID) -> ToggleSavedPlaceResponse:
        place = await self._places.get_by_id(place_id)
        if not place:
            raise NotFoundException("Place not found")
        saved = await self._saved.toggle(user_id, place_id)
        return ToggleSavedPlaceResponse(place_id=place_id, saved=saved)


# ─── Activity Service ─────────────────────────────────────────────────────────

from app.db.repositories.activity_repository import ActivityRepository
from app.schemas.schemas import ActivityOut


class ActivityService:
    def __init__(self, activity_repo: ActivityRepository) -> None:
        self._activities = activity_repo

    async def get_history(
        self, user_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[ActivityOut]:
        activities = await self._activities.get_for_user(user_id, limit=limit, offset=offset)
        return [ActivityOut.model_validate(a) for a in activities]

    async def get_activity(self, activity_id: UUID, user_id: UUID) -> ActivityOut:
        activity = await self._activities.get_by_id_for_user(activity_id, user_id)
        if not activity:
            raise NotFoundException("Activity not found")
        return ActivityOut.model_validate(activity)


# ─── Reward Service ───────────────────────────────────────────────────────────

from app.db.models.reward import RedeemOffer
from app.db.repositories.base import BaseRepository
from app.schemas.schemas import RedeemOfferOut
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class RewardService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def list_offers(self) -> list[RedeemOfferOut]:
        result = await self._db.execute(
            select(RedeemOffer).where(RedeemOffer.is_active == True)  # noqa: E712
        )
        offers = list(result.scalars().all())
        return [RedeemOfferOut.model_validate(o) for o in offers]


# ─── Notification Service ─────────────────────────────────────────────────────

from app.db.repositories.activity_repository import NotificationRepository
from app.schemas.schemas import NotificationOut


class NotificationService:
    def __init__(self, notif_repo: NotificationRepository) -> None:
        self._notifs = notif_repo

    async def get_notifications(
        self, user_id: UUID, *, unread_only: bool = False
    ) -> list[NotificationOut]:
        notifs = await self._notifs.get_for_user(user_id, unread_only=unread_only)
        return [NotificationOut.model_validate(n) for n in notifs]

    async def mark_all_read(self, user_id: UUID) -> None:
        await self._notifs.mark_all_read(user_id)
