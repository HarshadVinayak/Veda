# Veda - "Knowledge in your language"

Veda is a high-end educational platform designed to make learning immersive and accessible through AI-driven tools. Built with Next.js, Supabase, and advanced AI models (Cerebras, Groq, Gemini).

## Core Features
- **Root User Security**: Hard-coded administrative control for platform management.
- **Fail-Safe AI Service**: A waterfall orchestration system (Cerebras → Groq → SambaNova → Gemini).
- **Interactive Reader**: Real-time TTS (Web Speech API) and AI "Explain This" functionality.
- **Camera Scan (OCR)**: Integrated Google Vision API for scanning physical documents.
- **Student & Adult Tiers**: Specialized AI logic for academic tutoring and literary analysis.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion.
- **Backend/Auth**: Supabase (PostgreSQL, RLS, Edge Functions).
- **AI Engine**: AI SDK (Vercel), Cerebras, Groq, Gemini.

## Setup Instructions (New Supabase Project)
If you are connecting to a new Supabase project (id: `szqlrwwcabexrqnollmf`), you **MUST** run the SQL migration found in `supabase/setup_tiers.sql`.

1. Go to the **SQL Editor** in your Supabase Dashboard.
2. Paste and run the entire content of `supabase/setup_tiers.sql`.
3. This will set up the `profiles` table, the `user_tier` enum, and the **Root User** auto-assignment trigger.

---
© 2026 Veda. Built for excellence.
