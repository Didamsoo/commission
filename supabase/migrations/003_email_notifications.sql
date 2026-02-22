-- Add email notification columns to notifications table
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS should_send_email boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
