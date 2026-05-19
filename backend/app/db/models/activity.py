"""
db/models/activity.py — Activity (quest completion history) table.
"""
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.base import TimestampMixin, new_uuid

if TYPE_CHECKING:
    from app.db.models.user import User
    from app.db.models.quest import Quest


class Activity(TimestampMixin, Base):
    """
    Records every quest a user completes.
    status: completed | pending | failed
    type: quest | reward
    """
    __tablename__ = "activities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    quest_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quests.id", ondelete="SET NULL"), nullable=True
    )

    # Denormalised for historical display (quest may be deleted)
    quest_title: Mapped[str] = mapped_column(String(200), nullable=False)
    business_name: Mapped[str] = mapped_column(String(200), nullable=False)

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="completed")
    activity_type: Mapped[str] = mapped_column(String(20), nullable=False, default="quest")

    # Reward snapshot at time of completion
    reward_amount_pence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reward_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reward_label: Mapped[str] = mapped_column(String(50), nullable=False)

    payment_method: Mapped[str | None] = mapped_column(String(100), nullable=True)
    proof_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    qr_code_data: Mapped[str | None] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship(back_populates="activities")
    quest: Mapped["Quest | None"] = relationship(back_populates="activities")

    __table_args__ = (
        Index("ix_activities_user_id", "user_id"),
        Index("ix_activities_user_created", "user_id", "created_at"),
        Index("ix_activities_quest_id", "quest_id"),
    )
