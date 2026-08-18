-- ============================================================================
-- DUKE FLORES PORTFOLIO | SUPABASE POSTGRESQL DATABASE SETUP
-- ============================================================================
-- Run this SQL in your Supabase Project -> SQL Editor to create the table
-- and configure permissions for anonymous contact form submissions.

-- 1. Create the contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'unread'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (public/anonymous) to submit messages
CREATE POLICY "Allow public insert to contact_messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow only authenticated project owners to read messages
CREATE POLICY "Allow service role to read messages"
ON public.contact_messages
FOR SELECT
TO authenticated, service_role
USING (true);

-- 5. Helpful index on created_at for fast sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
ON public.contact_messages (created_at DESC);
