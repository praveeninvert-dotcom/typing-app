# DB Decision Guide — Retro Typing Test
# Place at: docs/DB-DECISION-GUIDE.md

## This project has no database.

No Prisma. No Supabase. No SQLite. No IndexedDB. No localStorage. No sessionStorage.
All state is in-memory React state. Nothing persists between sessions. This is intentional.

---

## If You Are Thinking About Adding Persistence

Re-read .planning/REQUIREMENTS.md.
"No score history or localStorage persistence" is explicitly out of scope for v1.

---

## What to Use Instead

Need to share state between components: lift it to TypingApp.tsx.
Need difficulty on retry: pass through the onRetry callback.
Need to show past results: you cannot. Out of scope.

---

## If This Changes in v2

Appropriate choice: Supabase with anonymous sessions. No backend server needed.

Schema would be:
  table: scores
    id: uuid
    difficulty: text ('easy', 'medium', 'hard')
    wpm: integer
    accuracy: integer
    correct_chars: integer
    incorrect_chars: integer
    created_at: timestamp

That decision is for v2. Not now.

---

## The Only Rule for v1

Nothing leaves the browser. If you are writing fetch(), you are out of scope.
