# Phase 4 Tests
# File: .planning/phases/04-ui-polish/TESTS.md
# New and updated tests for Phase 4 UI changes only.
# Run alongside existing test suite — do not delete existing tests.

---

## New Component Tests

### StarField

components/StarField/StarField.test.tsx

- Renders without errors
- Renders exactly 3 layer divs (far, mid, near)
- Has position fixed and z-index below screen content (z-index 0)
- Does not render any interactive elements (no buttons, no links)
- aria-hidden="true" is set on the container (decorative, not announced)

---

### DifficultySelector (updated)

components/DifficultySelector/DifficultySelector.test.tsx

Existing tests to keep:
- Renders EASY, MEDIUM, HARD options
- Clicking a difficulty fires onChange with correct value
- Selected option has aria-checked="true"
- Unselected options have aria-checked="false"

New tests:

Layout:
- Container has data-testid="difficulty-selector"
- Easy card has data-testid="difficulty-easy"
- Medium card has data-testid="difficulty-medium"
- Hard card has data-testid="difficulty-hard"

Selected state color:
- Selected card does NOT have a class or style containing 'blue' or rgba values matching blue tint
- Selected card has background containing rgba(180, 100, 0 — the amber tint value
  (Test via computed style or a data-selected attribute, not exact rgba string)

No stat bars:
- No element with role or class related to "stat-bar" or "progress" renders inside cards

---

### StatsBar (updated)

components/StatsBar/StatsBar.test.tsx

Existing tests to keep:
- WPM shows 0 before started
- Accuracy shows '--' before first char
- TIME shows 60 on mount

New tests:

Layout:
- Has data-testid="stats-bar"
- Renders exactly 3 column children
- WPM column has data-testid="stat-wpm"
- TIME column has data-testid="stat-time"
- ACC column has data-testid="stat-acc"
- WPM label text is "WPM"
- TIME label text is "TIME"
- ACC label text is "ACC"

Fixed sizing — no layout shift:
- WPM value cell does not change width when value changes from 0 to 999
  (Snapshot test: render with wpm=0, snapshot. Render with wpm=999, snapshot. Widths match.)
- ACC value cell does not change width when value changes from '--' to '100%'

Sound toggle removed:
- No element with text "SOUND", "SFX", "ON", "OFF" renders in StatsBar
- No button with aria-label related to sound renders in StatsBar or TestScreen

---

### TestScreen (updated)

components/TestScreen/TestScreen.test.tsx

Existing tests to keep:
- Hidden input focused on mount
- Clicking screen re-focuses input
- Caps Lock warning appears/disappears
- Escape shows quit confirmation

New tests:

Container:
- Renders a div with data-testid="test-container"
- Container renders StatsBar as first child
- Container renders text display area with data-testid="text-display"

Sound toggle removed from TestScreen:
- No button or toggle related to sound renders
- playCorrect is still called on correct keypress (sound still works)
- playWrong is still called on wrong keypress (sound still works)

---

### ResultOverlay (updated)

components/ResultOverlay/ResultOverlay.test.tsx

Existing tests to keep:
- Renders WPM from props
- Renders accuracy from props
- Retry button calls onRetry
- Home button calls onHome
- Enter key triggers onRetry

New tests:

data-testid:
- Backdrop has data-testid="result-backdrop"
- Modal has data-testid="result-modal"
- WPM value has data-testid="result-wpm"
- ACC value has data-testid="result-acc"
- Char breakdown has data-testid="result-chars"
- Retry button has data-testid="retry-button"
- Home button has data-testid="home-button"

"PLAY AGAIN?" text:
- Element with text "PLAY AGAIN?" renders in the overlay
- It is not a button (not role="button", not a <button> element)

Dashed divider:
- An element with border-style dashed renders between stats and buttons

No icons:
- No <img>, no <svg> with icon role renders in the overlay

---

## Updated E2E Tests

### playwright/tests/accessibility.spec.ts (add to existing)

test('star field is hidden from assistive technology', async ({ page }) => {
  await page.goto('/')
  const starField = page.locator('[data-testid="star-field"]')
  await expect(starField).toHaveAttribute('aria-hidden', 'true')
})

test('difficulty cards are in a horizontal row', async ({ page }) => {
  await page.goto('/')
  const easy = page.locator('[data-testid="difficulty-easy"]')
  const medium = page.locator('[data-testid="difficulty-medium"]')
  const hard = page.locator('[data-testid="difficulty-hard"]')
  const easyBox = await easy.boundingBox()
  const mediumBox = await medium.boundingBox()
  const hardBox = await hard.boundingBox()
  // All cards at same vertical position (horizontal layout)
  expect(Math.abs(easyBox.y - mediumBox.y)).toBeLessThan(5)
  expect(Math.abs(mediumBox.y - hardBox.y)).toBeLessThan(5)
  // Cards are side by side (x positions differ)
  expect(easyBox.x).toBeLessThan(mediumBox.x)
  expect(mediumBox.x).toBeLessThan(hardBox.x)
})

test('selected difficulty card has amber not blue background', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="difficulty-easy"]')
  const card = page.locator('[data-testid="difficulty-easy"]')
  const bg = await card.evaluate(el => window.getComputedStyle(el).backgroundColor)
  // Should not be blue — rgba(0, x, x) pattern
  expect(bg).not.toMatch(/rgba\(0,/)
})

### playwright/tests/full-run.spec.ts (add to existing)

test('stats bar columns have consistent width during test', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="difficulty-easy"]')
  await page.click('[data-testid="start-button"]')
  
  const wpmCell = page.locator('[data-testid="stat-wpm"]')
  const initialWidth = (await wpmCell.boundingBox()).width
  
  // Type enough to generate WPM
  await page.keyboard.type('the quick brown fox ')
  await page.waitForTimeout(1100) // wait for WPM to update
  
  const afterWidth = (await wpmCell.boundingBox()).width
  expect(Math.abs(initialWidth - afterWidth)).toBeLessThan(2)
})

test('result overlay shows PLAY AGAIN text', async ({ page }) => {
  // Navigate to result screen (mock or fast-forward timer)
  // Then:
  await expect(page.locator('text=PLAY AGAIN?')).toBeVisible()
})

test('sound toggle does not exist in test screen', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="difficulty-easy"]')
  await page.click('[data-testid="start-button"]')
  await expect(page.locator('button:has-text("SOUND")')).not.toBeVisible()
  await expect(page.locator('button:has-text("SFX")')).not.toBeVisible()
})

---

## Manual Verification Checklist (run after automated tests)

StarField:
  Stars visible on home screen but not distracting
  Stars visible on test screen — does not compete with typing text
  Stars animate smoothly, no jank
  Stars are square (pixel aesthetic, not circular)
  Three visible depth layers (some stars faster than others)
  CRT scanline overlay sits on top of stars correctly

Difficulty Cards:
  Cards render in a horizontal row on desktop viewport
  All three cards same height
  No stat bars present
  No icons present
  Hover: border brightens, subtle amber glow
  Selected: amber background tint (not blue), bright amber border, double pixel border visible
  Clicking a different card deselects the previous cleanly

Test Screen:
  Content inside a bordered container (amber-dim border visible)
  Stats bar at top of container with visible column dividers
  Labels centered above values
  Values centered in their column
  WPM, TIME, ACC never shift alignment as numbers change
  No sound toggle button anywhere on screen
  Sound still plays on correct and incorrect keypresses
  ESC hint visible at bottom of container

Result Overlay:
  "PLAY AGAIN?" text visible between divider and buttons
  Dashed amber divider line visible
  WPM and ACC in separate bordered boxes
  Pixel border on modal (double border effect)
  Backdrop is dark enough to contrast with star field
  Buttons use same pixel border style as difficulty cards
  Count-up animation plays
  Enter key triggers RETRY
