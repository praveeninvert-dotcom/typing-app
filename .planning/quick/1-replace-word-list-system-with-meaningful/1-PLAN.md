---
phase: quick-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/generateText.test.ts
autonomous: true
requirements:
  - QK-01
must_haves:
  truths:
    - "generateText returns a Word[] with more than 50 words for each difficulty"
    - "Each Word contains a non-empty Char[] where every Char has an expected string, typed null, and state 'untyped'"
    - "Two successive calls to generateText(difficulty) can return different paragraphs (randomness is exercised)"
    - "npx tsc --noEmit reports zero type errors"
    - "npm run test (vitest) passes with all new tests green"
  artifacts:
    - path: "lib/generateText.test.ts"
      provides: "Tests for paragraph-based generateText function"
      exports: []
  key_links:
    - from: "lib/generateText.test.ts"
      to: "lib/generateText.ts"
      via: "direct import of generateText"
      pattern: "import.*generateText.*from.*generateText"
    - from: "lib/generateText.ts"
      to: "lib/wordLists.ts"
      via: "import paragraphs"
      pattern: "import.*paragraphs.*from.*wordLists"
---

<objective>
Add a generateText.test.ts covering the new paragraph-based word list system.

Purpose: lib/wordLists.ts and lib/generateText.ts are already rewritten to use paragraph sets
instead of flat word pools. No production code needs changing. The only gap is test coverage:
there is no generateText.test.ts, and the user task requires tests verifying word count,
char shape, and randomness.

Output: lib/generateText.test.ts with all tests passing under vitest.
</objective>

<execution_context>
@/Users/praveen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/praveen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@lib/wordLists.ts
@lib/generateText.ts
@types/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create lib/generateText.test.ts</name>
  <files>lib/generateText.test.ts</files>
  <action>
    Create lib/generateText.test.ts. Import generateText from '../lib/generateText' and
    Difficulty type from '../lib/wordLists'. Do NOT mock wordLists — tests must exercise
    the real paragraph data.

    Write the following describe blocks and tests:

    describe('generateText') with:

    1. "returns a Word array with more than 50 words for each difficulty"
       - Loop over ['easy', 'medium', 'hard'] as Difficulty[]
       - Call generateText(difficulty) and assert result.length > 50

    2. "each Word has a non-empty chars array"
       - Call generateText('easy'), pick result[0] and result[result.length - 1]
       - Assert chars.length > 0 for both

    3. "each Char has expected string, typed null, and state 'untyped'"
       - Call generateText('medium'), pick any word (result[0])
       - For result[0].chars[0] assert:
           expected is a string with length >= 1
           typed is null
           state === 'untyped'

    4. "each Word has state 'untyped'"
       - Call generateText('hard')
       - Assert every word in the result has state === 'untyped'

    5. "two consecutive calls can return different results (randomness)"
       - Call generateText('easy') twice, stringify both
       - Run 5 attempts; assert that at least one pair differs
       - Use a loop: let sawDifference = false; for(let i=0;i<5;i++) { ... }
       - Fail with a helpful message if all 5 attempts returned identical results
       - Note: with 4 paragraphs the chance of 5 identical picks in a row is (1/4)^4 ≈ 0.4%.
         This is acceptable for a randomness smoke test.

    Use describe/it/expect from vitest globals (already configured via vitest.config.ts —
    no explicit import needed, same pattern as useTypingEngine.test.ts which uses vi
    without importing it).

    File path convention: lib/generateText.test.ts (next to the source file, not in __tests__/).
  </action>
  <verify>
    Run: npx vitest run lib/generateText.test.ts --reporter=verbose
    All 5 tests must pass (green).

    Then run: npx tsc --noEmit
    Must report zero errors.
  </verify>
  <done>
    - lib/generateText.test.ts exists with 5 passing tests
    - generateText('easy'|'medium'|'hard') each returns > 50 Words
    - Char shape is validated (expected: string, typed: null, state: 'untyped')
    - Randomness smoke test passes
    - Zero TypeScript errors
  </done>
</task>

</tasks>

<verification>
Run full test suite to confirm no regressions:
  npx vitest run --reporter=verbose

Run type check:
  npx tsc --noEmit

Both must exit 0.
</verification>

<success_criteria>
- lib/generateText.test.ts created and all tests pass
- Zero TypeScript errors across the entire project
- All pre-existing tests continue to pass
</success_criteria>

<output>
After completion, create .planning/quick/1-replace-word-list-system-with-meaningful/1-SUMMARY.md
</output>
