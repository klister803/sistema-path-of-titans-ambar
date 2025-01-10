/*
  # RCON and Account Linking Tables

  1. New Tables
    - `rcon_config` - Stores RCON connection settings
    - `account_links` - Stores game account links
    - `linking_attempts` - Tracks verification attempts

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- RCON Configuration Table
CREATE TABLE IF NOT EXISTS rcon_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  port integer NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Account Links Table
CREATE TABLE IF NOT EXISTS account_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_username text NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  UNIQUE(user_id, game_username)
);

-- Linking Attempts Table
CREATE TABLE IF NOT EXISTS linking_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_username text NOT NULL,
  verification_code text NOT NULL,
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'failed'))
);

-- Enable RLS
ALTER TABLE rcon_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE linking_attempts ENABLE ROW LEVEL SECURITY;

-- RCON Config Policies (Admin Only)
CREATE POLICY "Admins can manage RCON config"
  ON rcon_config
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'pedroevil51@gmail.com' OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Account Links Policies
CREATE POLICY "Users can read own links"
  ON account_links
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own links"
  ON account_links
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Linking Attempts Policies
CREATE POLICY "Users can manage own attempts"
  ON linking_attempts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
