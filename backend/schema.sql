-- ============================================================
-- SideQuest — Production Database Schema
-- PostgreSQL 15+
-- All PKs: UUID, all tables have created_at/updated_at
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ─── Auth Layer ──────────────────────────────────────────────────────────────

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) NOT NULL,
    name            VARCHAR(200) NOT NULL,
    hashed_password VARCHAR(256),
    provider        VARCHAR(20)  NOT NULL CHECK (provider IN ('email','google','facebook')),
    provider_id     VARCHAR(256),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ix_users_email            ON users (LOWER(email));
CREATE INDEX        ix_users_provider_pid     ON users (provider, provider_id);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token   VARCHAR(512) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    user_agent      VARCHAR(512),
    ip_address      VARCHAR(45),
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_sessions_user_id      ON sessions (user_id);
CREATE INDEX ix_sessions_refresh_tok  ON sessions (refresh_token);

-- ─── User Layer ──────────────────────────────────────────────────────────────

CREATE TABLE profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    avatar_url      VARCHAR(512),
    bio             TEXT,
    member_since    VARCHAR(20),
    quests_completed INT NOT NULL DEFAULT 0,
    co2_saved_kg    NUMERIC(10,3) NOT NULL DEFAULT 0,
    badges_earned   INT NOT NULL DEFAULT 0,
    balance_pence   INT NOT NULL DEFAULT 0,         -- GBP pence
    green_credits   INT NOT NULL DEFAULT 0,
    preferences     JSONB,                           -- notification + privacy prefs
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_profiles_user_id ON profiles (user_id);

CREATE TABLE user_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key         VARCHAR(100) NOT NULL,
    value       TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ix_user_settings_user_key ON user_settings (user_id, key);

-- ─── Feature Layer ───────────────────────────────────────────────────────────

CREATE TABLE quests (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                 VARCHAR(200) NOT NULL,
    description           TEXT NOT NULL,
    category              VARCHAR(50)  NOT NULL,
    business_name         VARCHAR(200) NOT NULL,
    business_logo_url     VARCHAR(512),
    image_url             VARCHAR(512),
    is_sponsored          BOOLEAN NOT NULL DEFAULT FALSE,
    sponsored_by          VARCHAR(200),
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    reward_amount_pence   INT NOT NULL DEFAULT 0,
    reward_credits        INT NOT NULL DEFAULT 0,
    reward_label          VARCHAR(50) NOT NULL,
    tags                  JSONB,
    sort_order            INT NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_quests_category  ON quests (category);
CREATE INDEX ix_quests_is_active ON quests (is_active);

CREATE TABLE quest_steps (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id    UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    instruction TEXT NOT NULL,
    step_order  INT  NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_quest_steps_quest_id ON quest_steps (quest_id);

CREATE TABLE places (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(100) NOT NULL,
    description     TEXT,
    address         VARCHAR(400),
    hours           VARCHAR(200),
    image_url       VARCHAR(512),
    latitude        NUMERIC(10,7),
    longitude       NUMERIC(10,7),
    rating          NUMERIC(3,1) NOT NULL DEFAULT 0,
    review_count    INT          NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    active_quest_ids JSONB,
    tags            JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_places_lat_lng   ON places (latitude, longitude);
CREATE INDEX ix_places_is_active ON places (is_active);

CREATE TABLE saved_places (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ix_saved_places_user_place ON saved_places (user_id, place_id);
CREATE INDEX        ix_saved_places_user_id    ON saved_places (user_id);

CREATE TABLE activities (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id)  ON DELETE CASCADE,
    quest_id            UUID REFERENCES quests(id) ON DELETE SET NULL,
    quest_title         VARCHAR(200) NOT NULL,
    business_name       VARCHAR(200) NOT NULL,
    status              VARCHAR(20)  NOT NULL DEFAULT 'completed',
    activity_type       VARCHAR(20)  NOT NULL DEFAULT 'quest',
    reward_amount_pence INT          NOT NULL DEFAULT 0,
    reward_credits      INT          NOT NULL DEFAULT 0,
    reward_label        VARCHAR(50)  NOT NULL,
    payment_method      VARCHAR(100),
    proof_url           TEXT,
    qr_code_data        TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_activities_user_id       ON activities (user_id);
CREATE INDEX ix_activities_user_created  ON activities (user_id, created_at DESC);
CREATE INDEX ix_activities_quest_id      ON activities (quest_id);

CREATE TABLE redeem_offers (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(300) NOT NULL,
    business_name    VARCHAR(200) NOT NULL,
    discount         VARCHAR(50)  NOT NULL,
    badge_label      VARCHAR(50)  NOT NULL,
    min_spend_pence  INT          NOT NULL DEFAULT 0,
    limit_per_day    INT,
    color            VARCHAR(20)  NOT NULL DEFAULT '#1A4731',
    credits_required INT          NOT NULL DEFAULT 0,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_redeem_offers_is_active ON redeem_offers (is_active);

CREATE TABLE claimed_rewards (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES users(id)      ON DELETE CASCADE,
    activity_id  UUID REFERENCES activities(id) ON DELETE SET NULL,
    claim_method VARCHAR(20) NOT NULL CHECK (claim_method IN ('balance','discount','friend')),
    amount_pence INT NOT NULL DEFAULT 0,
    credits      INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_claimed_rewards_user_id ON claimed_rewards (user_id);

-- ─── System Layer ─────────────────────────────────────────────────────────────

CREATE TABLE notifications (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50)  NOT NULL,
    title             VARCHAR(200) NOT NULL,
    message           TEXT         NOT NULL,
    is_read           BOOLEAN NOT NULL DEFAULT FALSE,
    action_url        VARCHAR(512),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_notifications_user_id      ON notifications (user_id);
CREATE INDEX ix_notifications_user_is_read ON notifications (user_id, is_read);

CREATE TABLE audit_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    action        VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id   VARCHAR(100),
    ip_address    VARCHAR(45),
    metadata      JSONB,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_audit_logs_user_id    ON audit_logs (user_id);
CREATE INDEX ix_audit_logs_action     ON audit_logs (action);
CREATE INDEX ix_audit_logs_created_at ON audit_logs (created_at DESC);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'users','sessions','profiles','user_settings',
        'quests','quest_steps','places','saved_places',
        'activities','redeem_offers','claimed_rewards',
        'notifications','audit_logs'
    ])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %s
             FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
            t, t
        );
    END LOOP;
END $$;
