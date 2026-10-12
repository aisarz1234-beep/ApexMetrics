-- =========================================================
-- ApexMetrics PostgreSQL Production Relational Schema
-- Supports durable user profiles, workouts, RPG stats, raids, and territory states
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    character_class VARCHAR(50) NOT NULL DEFAULT 'Vanguard',
    campus VARCHAR(100) NOT NULL DEFAULT 'Engineering Quad',
    team VARCHAR(50) NOT NULL DEFAULT 'Crimson Lions',
    level INT NOT NULL DEFAULT 1,
    total_points NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    weekly_points NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    daily_points NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    streak_days INT NOT NULL DEFAULT 1,
    avatar VARCHAR(20) DEFAULT '⚡',
    strava_linked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_total_points ON users (total_points DESC);
CREATE INDEX idx_users_weekly_points ON users (weekly_points DESC);
CREATE INDEX idx_users_campus ON users (campus);
CREATE INDEX idx_users_team ON users (team);

-- 2. User RPG Stats Table
CREATE TABLE IF NOT EXISTS user_rpg_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    strength NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
    endurance NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
    agility NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
    stamina NUMERIC(5, 1) NOT NULL DEFAULT 10.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Workouts Historical Logs Table
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_category VARCHAR(50) NOT NULL, -- cardio, calisthenics, strength, sports
    activity_type VARCHAR(50) NOT NULL,     -- running, swimming, pull_up, compound, etc.
    exercise_name VARCHAR(100),
    sport_name VARCHAR(100),
    metrics JSONB NOT NULL,                 -- distance, reps, sets, weight, duration
    points NUMERIC(10, 1) NOT NULL,
    breakdown JSONB NOT NULL,
    stat_gains JSONB NOT NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'self_reported', -- verified, valid, flagged_review
    verification_badge VARCHAR(100) DEFAULT 'Self-Reported',
    trust_score INT NOT NULL DEFAULT 85,
    flags JSONB DEFAULT '[]'::jsonb,
    zone VARCHAR(100) DEFAULT 'Campus Green',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workouts_user_id ON workouts (user_id);
CREATE INDEX idx_workouts_created_at ON workouts (created_at DESC);
CREATE INDEX idx_workouts_verification_status ON workouts (verification_status);
CREATE INDEX idx_workouts_category ON workouts (activity_category);

-- 4. Social Kudos & Proof Verifications
CREATE TABLE IF NOT EXISTS workout_kudos (
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workout_id, user_id)
);

CREATE TABLE IF NOT EXISTS workout_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Dynamic Bounties & Daily Quests
CREATE TABLE IF NOT EXISTS bounties (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_metric VARCHAR(50) NOT NULL,
    target_value NUMERIC(10, 2) NOT NULL,
    reward_points INT NOT NULL,
    multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_claimed_bounties (
    bounty_id VARCHAR(50) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bounty_id, user_id)
);

-- 6. Group Boss Raids
CREATE TABLE IF NOT EXISTS boss_raids (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    boss_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    total_hp INT NOT NULL,
    current_hp INT NOT NULL,
    reward_badge VARCHAR(100) NOT NULL,
    reward_xp INT NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS boss_raid_contributions (
    raid_id VARCHAR(50) NOT NULL REFERENCES boss_raids(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    damage_dealt INT NOT NULL DEFAULT 0,
    last_hit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (raid_id, user_id)
);

-- 7. Campus Turf Wars Territories
CREATE TABLE IF NOT EXISTS campus_territories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    controlling_team VARCHAR(50) NOT NULL DEFAULT 'Contested',
    control_percent INT NOT NULL DEFAULT 50,
    dominance_points INT NOT NULL DEFAULT 0,
    active_bonus VARCHAR(150) NOT NULL,
    top_guardian_id UUID REFERENCES users(id),
    coord_x INT NOT NULL DEFAULT 50,
    coord_y INT NOT NULL DEFAULT 50,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
