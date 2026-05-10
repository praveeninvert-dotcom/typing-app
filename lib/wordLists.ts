// Structure change: instead of flat word arrays, each difficulty
// has 3 paragraph sets. generateText.ts picks one at random per test run.
//
// Easy:   common words, clean prose, no special characters
// Medium: normal English prose, apostrophes, commas, periods
// Hard:   technical content, numbers, special characters, symbols

export type Difficulty = 'easy' | 'medium' | 'hard'

// Each entry is one complete paragraph set for a test run.
// generateText will pick one at random and split into words.

export const paragraphs: Record<Difficulty, string[]> = {
  easy: [
    // Set 1 — nature and routine
    `the sun came up slow over the green hills and the birds began to call one by one the old man sat on his porch with a cup of tea and watched the light move down the slope of the yard his dog lay at his feet and did not stir the road in front of the house was still and no cars had come by yet he liked this time best when the world had not yet made up its mind about the day`,

    // Set 2 — learning and growth
    `to get good at a thing you have to do it many times and not give up when it feels hard at first your hands will not know what to do and your mind will feel slow but if you keep at it each day the work will start to feel light you will not need to think about each step the way you did when you were new it will just come and that is when the real fun starts`,

    // Set 3 — city and people
    `the shop on the end of the lane had been there for as long as she could think back the man who ran it knew all the names of all the kids who came in for sweets on the way home from school he would ask about their day and most of them would stop to talk he kept the place clean and the shelves were full and the light was warm and on cold days you could smell the bread from the place next door`,

    // Set 4 — work and focus
    `she sat down at her desk and put her phone in the drawer and did not look at it for two hours she had learned that the best work came in the first part of the day when the mind was clear and the tasks felt less like tasks and more like things she just wanted to do the rest of the world could wait and most of the time it did`,
  ],

  medium: [
    // Set 1 — engineering and systems
    `She hadn't expected the server to crash on a Tuesday, but here they were at two in the morning, reading stack traces and drinking cold coffee. The codebase was old, full of hacks that nobody remembered writing. "It works, don't touch it," was the unofficial motto. Jake scrolled through the logs, eyes half-closed, and found the culprit: a race condition they'd known about for months but never fixed. They always meant to get around to it.`,

    // Set 2 — design thinking
    `Good design isn't about making things look nice, though that matters too. It's about understanding the person who'll use what you're building, then making choices that serve them well. Every button, every label, every empty state tells a story. When users don't read the documentation, it's usually because the interface failed them first. The best designs feel invisible — they just work, and nobody stops to wonder why. That invisibility is the whole point.`,

    // Set 3 — typing and practice
    `Typing is a skill, and like all skills, it rewards deliberate practice. You don't get faster by trying to go fast; you get faster by slowing down enough to be accurate, then letting speed follow naturally. Your fingers already know where the keys are — your job is to get out of the way. Watch your error rate, not your WPM. Accuracy compounds over weeks, and consistency beats raw speed every time. Trust the process.`,

    // Set 4 — creativity and constraints
    `Some of the best ideas come from working inside tight constraints. When you can't do everything, you're forced to figure out what actually matters. A writer with a word limit finds the sentence she would've cut. A designer with one colour finds the contrast she would've hidden behind decoration. Constraints don't kill creativity — they focus it. The blank canvas with infinite options is often the hardest place to start.`,
  ],

  hard: [
    // Set 1 — developer tooling
    `Run \`npm install --save-dev typescript@5.3.2\` and add a \`tsconfig.json\` with \`"strict": true\`. Your first error will probably be "Object is possibly 'undefined'" — that's the point. TypeScript isn't punishing you; it's showing you 47 places where your JavaScript was lying. Fix them one by one: add null checks, type guards, and proper interfaces. When \`grep -r 'any' src/\` returns 0 results, you're done. Ship it.`,

    // Set 2 — database and performance
    `CPU usage spiked to 94% at 03:17:42 UTC — exactly 15 minutes after the cron job ran. The query \`SELECT * FROM events WHERE created_at > NOW() - INTERVAL '7 days'\` was missing an index on \`created_at\`. Adding \`CREATE INDEX CONCURRENTLY idx_events_created ON events(created_at DESC)\` dropped p99 latency from 4,200ms to 38ms. Always run \`EXPLAIN ANALYZE\` before shipping queries on tables with 10M+ rows.`,

    // Set 3 — config and infrastructure
    `The \`config.yaml\` expects values like \`rate_limit: 1000/min\` and \`retry_backoff: [0.5, 1.0, 2.5, 5.0]\`. Environment variables override file settings: \`APP_MAX_CONNECTIONS=50\` and \`APP_TIMEOUT_MS=3000\`. Note: boolean flags must be lowercase (\`true\`, not \`True\` or \`TRUE\`). Secrets go in \`.env\` — never in \`config.yaml\`. Run \`./scripts/validate-config.sh --env=production\` before deploying to catch type mismatches early.`,

    // Set 4 — algorithms and complexity
    `A hash map lookup is O(1) average but O(n) worst case — collision chains are the reason. If your load factor exceeds 0.75, resize: allocate a new array of size 2n+1, rehash all keys. For 1,000,000 entries at 8 bytes/key + 8 bytes/value, expect ~16MB before overhead. Prefer \`Map<K, V>\` over plain objects: it preserves insertion order, handles non-string keys, and exposes \`.size\` without \`Object.keys(x).length\`. Benchmark with \`console.time('lookup')\` and \`console.timeEnd('lookup')\`.`,
  ],
}