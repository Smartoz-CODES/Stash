# Stash

A personal resource library for people who save things and actually want to find them again.

## What it does

Paste a URL, Stash pulls the title and description automatically, pick a category, add tags, and it's saved. Later you can search by title, tag, or category name. Filter by read status, favourite things, flag items to revisit. That's the core of it.

Built for students, self-learners, and professionals who bookmark things across five different apps and lose track of all of them.

## Tech

- React + TypeScript + Vite
- Supabase (auth, database, Edge Functions, Row Level Security)
- Vanilla CSS — no Tailwind, no component libraries
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
- Auto-fills title and description on URL paste via Open Graph metadata
- Search by title, tag, or category name
- Filter by read status, favourites, tags, date saved
- Mark resources as read, favourite, or revisit later
- Resource detail view with key info panel and inline tag editing
- Edit and delete resources
- Category manager — create, rename, delete
- Profile page with account stats and category breakdown
- Fully responsive — works on desktop and mobile

## Mobile

Stash is fully responsive at `≤768px`. The desktop sidebar is replaced by a fixed bottom navigation bar (Home / Resource / Categories / Settings) and a slide-in navigation drawer triggered by the hamburger icon.

Key mobile behaviours:

- **Bottom nav** — fixed 4-tab bar; active tab highlighted in `#6344e3`
- **Hamburger** — opens a slide-in drawer showing the same navigation, categories, and tags as the desktop sidebar
- **Categories tab** — navigates to the library and opens the filter drawer directly so users can filter by their saved categories
- **Filter drawer** — renders as a bottom sheet on mobile (slides up, rounded top corners) instead of the desktop left-side drawer
- **Auth screens** — hero banner stacks above the form on mobile; form slides up with rounded top corners
- **Resource cards** — category and status badges move to the top of the card on mobile; heart icon always visible; edit/delete actions always shown (no hover required)
- **Add/Edit resource form** — Cancel and Submit buttons stack full-width on mobile
- **Inputs** — minimum `font-size: 16px` throughout to prevent iOS auto-zoom on focus
- **Dashboard stats** — 4-column grid collapses to 2-column on mobile
- **Resource grids** — always single column on mobile; view toggle hidden

## Security

Threat model is documented in the repo. Short version: Supabase RLS handles access control at the database level, React's default escaping covers XSS, URLs are validated before saving, search input is capped at 100 characters. Session tokens sit in localStorage — that's a Supabase default that can't be changed without a custom backend, so keeping XSS out is the main defence.

## Project structure

```
src/
  Components/
    bottom-nav.tsx
    category-manager.tsx
    confirm-dialog.tsx
    empty-state.tsx
    filter-button.tsx
    filter-drawer.tsx
    filter-sidebar.tsx
    mobile-nav-drawer.tsx
    resource-card.tsx
    resource-form.tsx
    search-bar.tsx
    tag-input.tsx
    view-toggle.tsx

  Context/
    auth-context-value.ts
    auth-context.tsx

  Hooks/
    use-auth.ts
    use-categories.ts
    use-metadata.ts
    use-resource.ts

  Layout/
    app-layout.tsx
    auth-layout.tsx
    protected-route.tsx

  Lib/
    metadata.ts
    supabase.ts

  Pages/
    Auth/
      login.tsx
      sign-up.tsx
    Dashboard/
      dashboard.tsx
    Library/
      library.tsx
    Profile/
      profile.tsx
    Resource-detail/
      resource-detail.tsx

  Routes/
    pages.tsx

  Styles/
    app-layout.css
    auth-layout.css
    bottom-nav.css
    category-manager.css
    confirm-dialog.css
    dashboard.css
    empty-state.css
    filter-button.css
    filter-drawer.css
    filter-sidebar.css
    library.css
    login.css
    mobile-nav-drawer.css
    profile.css
    protected-route.css
    resource-card.css
    resource-detail.css
    resource-form.css
    search-bar.css
    signup.css
    tag-input.css
    view-toggle.css

  Types/
    auth.ts
    category.ts
    filters.ts
    resource.ts

  App.tsx
  main.tsx
```

## Deployed

Live at [stashgrp9.netlify.app](https://stashgrp9.netlify.app)

## Author

Built by Group 9 as part of the Genesys Learnable program, specifically scrum week, June 2026.