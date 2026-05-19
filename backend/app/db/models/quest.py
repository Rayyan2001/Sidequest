"""
db/models/quest.py — Quests + QuestSteps tables.
"""
import uuid
from typing import Any, TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Index, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.base import TimestampMixin, new_uuid

if TYPE_CHECKING:
    from app.db.models.place import Place
    from app.db.models.activity import Activity


class Quest(TimestampMixin, Base):
    __tablename__ = "quests"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(
        String(50), nullable=False,
        comment="eco | zero-waste | refill | food | fitness"
    )
    business_name: Mapped[str] = mapped_column(String(200), nullable=False)
    business_logo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_sponsored: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sponsored_by: Mapped[str | None] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Reward
    reward_amount_pence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reward_credits: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reward_label: Mapped[str] = mapped_column(String(50), nullable=False, comment="e.g. £2.00 or +50")

    # Tags stored as JSON array for flexibility
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    # Soft ordering
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    steps: Mapped[list["QuestStep"]] = relationship(
        back_populates="quest", cascade="all, delete-orphan", order_by="QuestStep.step_order"
    )
    activities: Mapped[list["Activity"]] = relationship(back_populates="quest")

    __table_args__ = (
        Index("ix_quests_category", "category"),
        Index("ix_quests_is_active", "is_active"),
    )


class QuestStep(TimestampMixin, Base):
    __tablename__ = "quest_steps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    quest_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("quests.id", ondelete="CASCADE"), nullable=False
    )
    instruction: Mapped[str] = mapped_column(Text, nullable=False)
    step_order: Mapped[int] = mapped_column(Integer, nullable=False)

    quest: Mapped["Quest"] = relationship(back_populates="steps")

    __table_args__ = (
        Index("ix_quest_steps_quest_id", "quest_id"),
    )
