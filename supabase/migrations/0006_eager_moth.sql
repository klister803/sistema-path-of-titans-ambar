/*
  # Enhanced User Profile and Gallery System

  1. New Tables
    - `user_galleries`
      - Stores user-uploaded images
    - `gallery_reactions`
      - Stores user reactions to gallery images
    - `gallery_comments`
      - Stores user comments on gallery images

  2. Updated Tables
    - `users`
      - Added `avatar_url`, `gender`, `favorite_dinosaur`, and `discord_links` fields

  3. Security
    - Enable RLS on new tables
    - Add policies for user data access
    - Add policies for gallery access
*/

-- Add new fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_dinosaur text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_links jsonb;

-- Create user galleries table
CREATE TABLE IF NOT EXISTS user_galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  description text,
  uploaded_at timestamptz DEFAULT now()
);

-- Create gallery reactions table
CREATE TABLE IF NOT EXISTS gallery_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid REFERENCES user_galleries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (gallery_id, user_id)
);

-- Create gallery comments table
CREATE TABLE IF NOT EXISTS gallery_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid REFERENCES user_galleries(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_comments ENABLE ROW LEVEL SECURITY;

-- User galleries policies
CREATE POLICY "Users can read own galleries"
  ON user_galleries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own galleries"
  ON user_galleries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Gallery reactions policies
CREATE POLICY "Users can react to galleries"
  ON gallery_reactions
  FOR ALL
  TO authenticated
  USING (true);

-- Gallery comments policies
CREATE POLICY "Users can comment on galleries"
  ON gallery_comments
  FOR ALL
  TO authenticated
  USING (true);
