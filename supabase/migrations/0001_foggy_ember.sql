/*
  # Initial Schema Setup

  1. New Tables
    - users
      - Core user information and authentication
      - Discord integration fields
      - Account status tracking
    - images
      - Game asset management
      - Categories for different image types
  
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for image access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  discord_id text UNIQUE,
  discord_username text,
  discord_avatar_url text,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'banned', 'suspended'))
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('avatar', 'dinosaur', 'environment')),
  url text NOT NULL,
  description text,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Images policies
CREATE POLICY "Anyone can read images"
  ON images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage images"
  ON images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND status = 'active'
    )
  );
