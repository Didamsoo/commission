-- Add settings column to profiles for notification preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}';
