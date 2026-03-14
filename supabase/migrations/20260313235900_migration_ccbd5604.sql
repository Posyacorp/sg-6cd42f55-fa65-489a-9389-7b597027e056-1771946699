-- Migration 10: Add approval_status and referred_by to profiles
-- File: 20260313224239_migration_65b8da69.sql

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);