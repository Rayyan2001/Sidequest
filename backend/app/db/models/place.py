"""
db/models/place.py — Places (businesses) + PlaceTags tables.
"""
import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.base import TimestampMixin, new_uuid


class Place(TimestampMixin, Base):
    __tablename__ = "places"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    address: Mapped[str | None] = mapped_column(String(400), nullable=True)
    hours: Mapped[str | None] = mapped_column(String(200), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Location
    latitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7), nullable=True)

    # Stats
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 1), default=0, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Active quest IDs stored as JSON array
    active_quest_ids: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    __table_args__ = (
        Index("ix_places_latitude_longitude", "latitude", "longitude"),
        Index("ix_places_is_active", "is_active"),
    )


class SavedPlace(TimestampMixin, Base):
    """Junction: user ↔ saved place."""
    __tablename__ = "saved_places"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    place_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("places.id", ondelete="CASCADE"), nullable=False
    )

    __table_args__ = (
        Index("ix_saved_places_user_id", "user_id"),
        Index("ix_saved_places_user_place", "user_id", "place_id", unique=True),
    )


# Alias for backward compat with __init__.py import
PlaceTag = SavedPlace
