"""
db/models/reward.py — RedeemOffers + ClaimedRewards tables.
"""
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.base import TimestampMixin, new_uuid


class RedeemOffer(TimestampMixin, Base):
    __tablename__ = "redeem_offers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    business_name: Mapped[str] = mapped_column(String(200), nullable=False)
    discount: Mapped[str] = mapped_column(String(50), nullable=False)
    badge_label: Mapped[str] = mapped_column(String(50), nullable=False)
    min_spend_pence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    limit_per_day: Mapped[int | None] = mapped_column(Integer, nullable=True)
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="#1A4731")
    credits_required: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    __table_args__ = (
        Index("ix_redeem_offers_is_active", "is_active"),
    )


class ClaimedReward(TimestampMixin, Base):
    __tablename__ = "claimed_rewards"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    activity_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("activities.id", ondelete="SET NULL"), nullable=True
    )
    claim_method: Mapped[str] = mapped_column(
        String(20), nullable=False,
        comment="balance | discount | friend"
    )
    amount_pence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    __table_args__ = (
        Index("ix_claimed_rewards_user_id", "user_id"),
    )
