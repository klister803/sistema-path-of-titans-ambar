/*
  # Add Recovery Token System

  1. New Tables
    - `recovery_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `token_hash` (text, hashed recovery token)
      - `created_at` (timestamp)
      - `used_at` (timestamp, nullable)
      - `attempts` (integer, default 0)
      - `is_valid` (boolean, default true)

  2. Security
    - Enable RLS on recovery_tokens table
    - Add policies for token validation
*/

-- Create recovery tokens table
CREATE TABLE IF NOT EXISTS recovery_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  attempts integer DEFAULT 0,
  is_valid boolean DEFAULT true,
  CONSTRAINT unique_valid_token_per_user UNIQUE (user_id, token_hash)
);

-- Enable RLS
ALTER TABLE recovery_tokens ENABLE ROW LEVEL SECURITY;

-- Create function to validate token
CREATE OR REPLACE FUNCTION validate_recovery_token(
  p_token_hash text,
  p_user_id uuid
) RETURNS boolean AS $$
DECLARE
  v_token recovery_tokens%ROWTYPE;
BEGIN
  SELECT * INTO v_token
  FROM recovery_tokens
  WHERE token_hash = p_token_hash
    AND user_id = p_user_id
    AND is_valid = true
    AND used_at IS NULL
    AND attempts < 5
    AND created_at > (now() - interval '24 hours');

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Update attempts
  UPDATE recovery_tokens
  SET attempts = attempts + 1,
      is_valid = CASE 
        WHEN attempts + 1 >= 5 THEN false
        ELSE true
      END
  WHERE id = v_token.id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
