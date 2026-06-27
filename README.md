# Stash

A personal resource library for people who save things and actually want to find them again.

## What it does

You paste a URL, Stash pulls the title and description automatically, you pick a category and add tags, and it's saved. Later you can search by title, tag, or category name. Filter by read status, favourite things, flag items to revisit. That's the core of it.

Built for students, self-learners, and professionals who bookmark things across five different apps and lose track of all of them.

## Tech

- React + TypeScript + Vite
- Supabase (auth, database, Edge Functions, Row Level Security)
- Vanilla CSS
- React Router v6

## Getting started

You'll need Node.js and a Supabase project.

**1. Clone the repo**
```bash
git clone https://github.com/Smartoz-CODES/Stash.git
cd Stash
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Both values are in your Supabase dashboard under Settings → API.

**4. Run it**
```bash
npm run dev
```

Opens at `localhost:5173`.

## Database setup

Two tables: `resources` and `categories`. Row Level Security is enabled on both — users can only access their own data.

New accounts get six default categories seeded automatically: Videos, Articles, Documents, Tutorials, Tools, Podcasts. You can rename or delete them, add your own.

## Metadata fetching

When you paste a URL into the Add Resource form, Stash calls a Supabase Edge Function that fetches the page's Open Graph tags and returns the title, description, and thumbnail. It fails silently if the page doesn't have them — you can always fill in the fields manually.

To deploy the Edge Function yourself:
```bash
supabase functions deploy fetch-metadata --project-ref your-project-ref
```

## Features

- Save resources with URL, title, description, category, and tags
- Auto-fills metadata on URL paste
- Search by title, tag, or category name
- Filter by read status, favourites, tags, date saved
- Mark resources as read, favourite, or revisit later
- Resource detail view with key info panel
- Edit and delete resources
- Category manager — create, rename, delete
- Profile page with account stats and category breakdown

## Security

Threat model is documented in the repo. Short version: Supabase RLS handles access control at the database level, React's default escaping covers XSS, URLs are validated before saving, search input is capped at 100 characters. Session tokens sit in localStorage — that's a Supabase default that can't be changed without a custom backend, so keeping XSS out is the main defence.

## Project structure

```
src/
  Components/    — ResourceCard, ResourceForm, FilterSidebar, FilterDrawer, etc.
  Hooks/         — useResources, useCategories, useMetadata, useAuth
  Layout/        — AppLayout, AuthLayout, ProtectedRoute
  Pages/         — Dashboard, Library, Profile, ResourceDetail, Auth
  Styles/        — CSS files co-located by component name
  Types/         — Resource, Category, FilterParams
  Lib/           — Supabase client
  Routes/        — pages.tsx
```

## Author

Built by Group 9 as part of the Genesys Learnable program, specifically scrum week, June 2026.