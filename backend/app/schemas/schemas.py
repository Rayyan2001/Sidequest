"""
schemas/user.py — user + profile schemas.
"""
from uuid import UUID
from datetime import datetime
from typing import Any
from pydantic import BaseModel, EmailStr, Field


class UserOut(BaseModel):
    id: UUID
    email: str
    name: str
    provider: str
    is_email_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProfileOut(BaseModel):
    id: UUID
    user_id: UUID
    avatar_url: str | None
    bio: str | None
    member_since: str | None
    quests_completed: int
    co2_saved_kg: float
    badges_earned: int
    balance_pence: int
    green_credits: int
    preferences: dict[str, Any] | None

    model_config = {"from_attributes": True}


class MeResponse(BaseModel):
    user: UserOut
    profile: ProfileOut | None


class UpdateProfileRequest(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=200)
    avatar_url: str | None = Field(None, max_length=512)
    bio: str | None = Field(None, max_length=500)
    preferences: dict[str, Any] | None = None


class UpdateSettingRequest(BaseModel):
    key: str = Field(..., min_length=1, max_length=100)
    value: str = Field(..., max_length=500)


# ─── Quest ────────────────────────────────────────────────────────────────────

class QuestStepOut(BaseModel):
    id: UUID
    instruction: str
    step_order: int

    model_config = {"from_attributes": True}


class QuestOut(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    business_name: str
    business_logo_url: str | None
    image_url: str | None
    is_sponsored: bool
    sponsored_by: str | None
    reward_amount_pence: int
    reward_credits: int
    reward_label: str
    tags: list[str] | None
    steps: list[QuestStepOut]

    model_config = {"from_attributes": True}


class StartQuestResponse(BaseModel):
    quest_id: UUID
    started: bool


class SubmitQRRequest(BaseModel):
    quest_id: UUID
    qr_code_data: str = Field(..., min_length=1)


class SubmitQRResponse(BaseModel):
    quest_id: UUID
    verified: bool


class ClaimRewardRequest(BaseModel):
    quest_id: UUID
    method: str = Field(..., pattern="^(balance|discount|friend)$")


class ClaimRewardResponse(BaseModel):
    quest_id: UUID
    method: str
    reward_amount_pence: int
    reward_credits: int
    claimed: bool


# ─── Place ────────────────────────────────────────────────────────────────────

class PlaceOut(BaseModel):
    id: UUID
    name: str
    category: str
    description: str | None
    address: str | None
    hours: str | None
    image_url: str | None
    latitude: float | None
    longitude: float | None
    rating: float
    review_count: int
    tags: list[str] | None
    active_quest_ids: list[str] | None

    model_config = {"from_attributes": True}


class ToggleSavedPlaceResponse(BaseModel):
    place_id: UUID
    saved: bool


# ─── Activity ─────────────────────────────────────────────────────────────────

class ActivityOut(BaseModel):
    id: UUID
    quest_title: str
    business_name: str
    status: str
    activity_type: str
    reward_amount_pence: int
    reward_credits: int
    reward_label: str
    payment_method: str | None
    proof_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Reward ───────────────────────────────────────────────────────────────────

class RedeemOfferOut(BaseModel):
    id: UUID
    title: str
    business_name: str
    discount: str
    badge_label: str
    min_spend_pence: int
    limit_per_day: int | None
    color: str
    credits_required: int

    model_config = {"from_attributes": True}


# ─── Notification ─────────────────────────────────────────────────────────────

class NotificationOut(BaseModel):
    id: UUID
    notification_type: str
    title: str
    message: str
    is_read: bool
    action_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Common ───────────────────────────────────────────────────────────────────

class PaginatedResponse(BaseModel):
    items: list
    total: int
    limit: int
    offset: int


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    detail: str
    code: str | None = None
