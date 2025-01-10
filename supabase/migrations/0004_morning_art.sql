/*
  # Fix User Registration Policies

  1. Changes
    - Add policy for inserting new users during registration
    - Add policy for users to update their own data
    - Add policy for reading user profiles
    - Add missing columns for user profile data
  
  2. Security
    - Enable RLS
    - Add specific policies for each operation
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Add missing columns if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_log jsonb[] DEFAULT ARRAY[]::jsonb[];

-- Policy for inserting new users during registration
CREATE POLICY "Enable insert for registration"
ON users FOR INSERT
TO authenticated, anon
WITH CHECK (
  auth.uid() = id OR auth.role() = 'anon'
);

-- Policy for users to read their own data
CREATE POLICY "Users can read own profile"
ON users FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

-- Policy for users to update their own data
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for public profile information
CREATE POLICY "Anyone can read public profile info"
ON users FOR SELECT
TO authenticated, anon
USING (
  status = 'active'
);
