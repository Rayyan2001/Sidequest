"""
services/quest_service.py — quest business logic.
"""
from uuid import UUID

from app.core.exceptions import NotFoundException, BadRequestException
from app.db.models.activity import Activity
from app.db.models.reward import ClaimedReward
from app.db.repositories.quest_repository import QuestRepository
from app.db.repositories.activity_repository import ActivityRepository
from app.db.repositories.profile_repository import ProfileRepository
from app.schemas.schemas import (
    QuestOut, StartQuestResponse, SubmitQRResponse, ClaimRewardResponse
)


class QuestService:
    def __init__(
        self,
        quest_repo: QuestRepository,
        activity_repo: ActivityRepository,
        profile_repo: ProfileRepository,
    ) -> None:
        self._quests = quest_repo
        self._activities = activity_repo
        self._profiles = profile_repo

    async def list_quests(self, *, limit: int = 50, offset: int = 0) -> list[QuestOut]:
        quests = await self._quests.get_active(limit=limit, offset=offset)
        return [QuestOut.model_validate(q) for q in quests]

    async def get_quest(self, quest_id: UUID) -> QuestOut:
        quest = await self._quests.get_with_steps(quest_id)
        if not quest:
            raise NotFoundException("Quest not found")
        return QuestOut.model_validate(quest)

    async def get_todays_quest(self) -> QuestOut:
        quests = await self._quests.get_active(limit=1)
        if not quests:
            raise NotFoundException("No active quests available")
        return QuestOut.model_validate(quests[0])

    async def start_quest(self, quest_id: UUID, user_id: UUID) -> StartQuestResponse:
        quest = await self._quests.get_with_steps(quest_id)
        if not quest:
            raise NotFoundException("Quest not found")
        return StartQuestResponse(quest_id=quest_id, started=True)

    async def submit_qr(
        self, quest_id: UUID, qr_code_data: str, user_id: UUID
    ) -> SubmitQRResponse:
        quest = await self._quests.get_with_steps(quest_id)
        if not quest:
            raise NotFoundException("Quest not found")
        if not qr_code_data:
            raise BadRequestException("No QR code provided")
        # Production: validate qr_code_data against quest's expected code
        # For now: any non-empty code is accepted
        return SubmitQRResponse(quest_id=quest_id, verified=True)

    async def claim_reward(
        self, quest_id: UUID, method: str, user_id: UUID
    ) -> ClaimRewardResponse:
        quest = await self._quests.get_with_steps(quest_id)
        if not quest:
            raise NotFoundException("Quest not found")

        # Record activity
        activity = Activity(
            user_id=user_id,
            quest_id=quest_id,
            quest_title=quest.title,
            business_name=quest.business_name,
            status="completed",
            activity_type="quest",
            reward_amount_pence=quest.reward_amount_pence,
            reward_credits=quest.reward_credits,
            reward_label=quest.reward_label,
            payment_method="Wallet Balance",
        )
        activity = await self._activities.create(activity)

        # Update profile balance if method == balance
        if method == "balance":
            profile = await self._profiles.get_by_user_id(user_id)
            if profile:
                await self._profiles.update(
                    profile.id,
                    {
                        "balance_pence": profile.balance_pence + quest.reward_amount_pence,
                        "green_credits": profile.green_credits + quest.reward_credits,
                        "quests_completed": profile.quests_completed + 1,
                    },
                )

        return ClaimRewardResponse(
            quest_id=quest_id,
            method=method,
            reward_amount_pence=quest.reward_amount_pence,
            reward_credits=quest.reward_credits,
            claimed=True,
        )
