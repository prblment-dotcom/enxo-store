-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kifugzyuqxymstjizwtp/editor

create table if not exists wishlist (
  id        bigint generated always as identity primary key,
  email     text unique not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (nobody can read/write from the browser directly)
alter table wishlist enable row level security;

-- Only the server-side service role key can insert — no public access needed
-- (no policies = only service_role can access, which is what we want)
