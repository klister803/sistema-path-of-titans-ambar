/*
  # Update authentication system

  1. New Fields
    - Added to users table:
      - full_name (text)
      - failed_login_attempts (integer)
      - last_failed_login (timestamptz)
      - account_locked_until (timestamptz)
      - preferences (jsonb)
      - activity_log (jsonb[])

  2. Security
    - Added login attempt tracking
    - Added account locking functionality
    - Added activity logging
*/

-- Add new fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_failed_login timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_log jsonb[] DEFAULT ARRAY[]::jsonb[];

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  user_id uuid,
  activity_type text,
  activity_details jsonb
) RETURNS void AS $$
BEGIN
  UPDATE users
  SET activity_log = array_append(
    activity_log,
    jsonb_build_object(
      'type', activity_type,
      'timestamp', CURRENT_TIMESTAMP,
      'details', activity_details
    )
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle failed login attempts
CREATE OR REPLACE FUNCTION handle_failed_login(
  user_id uuid
) RETURNS void AS $$
DECLARE
  max_attempts constant int := 5;
  lockout_duration constant interval := interval '15 minutes';
BEGIN
  UPDATE users
  SET 
    failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
    last_failed_login = CURRENT_TIMESTAMP,
    account_locked_until = CASE 
      WHEN COALESCE(failed_login_attempts, 0) + 1 >= max_attempts 
      THEN CURRENT_TIMESTAMP + lockout_duration
      ELSE NULL 
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset failed login attempts
CREATE OR REPLACE FUNCTION reset_failed_login_attempts(
  user_id uuid
) RETURNS void AS $$
BEGIN
  UPDATE users
  SET 
    failed_login_attempts = 0,
    last_failed_login = NULL,
    account_locked_until = NULL
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
