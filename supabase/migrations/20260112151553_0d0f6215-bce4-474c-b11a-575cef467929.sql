-- Remove email from profiles table - it's already stored securely in auth.users
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;