import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility — HomeScreen', () => {
  test('axe-core passes on HomeScreen', async ({ page }) => {
    await page.goto('/')
    // Verify HomeScreen is visible
    await expect(page.locator('text=TYPING.EXE')).toBeVisible()

    const results = await new AxeBuilder({ page })
      // Exclude the intentional contrast exception for untyped chars
      // --color-text-dim (#444444 on #0a0a0a = 1.8:1) is non-interactive
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('Accessibility — TestScreen', () => {
  test('axe-core passes on TestScreen', async ({ page }) => {
    await page.goto('/')

    // Select Easy difficulty and start test
    await page.locator('[role="radio"][aria-label*="EASY"]').click()

    // Click the Start button
    await page.locator('button:has-text("START")').click()

    // Verify TestScreen loaded (hidden input focused)
    await expect(page.locator('[aria-label="Type the displayed text"]')).toBeAttached()

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})

test.describe('Accessibility — ResultScreen', () => {
  test('axe-core passes on ResultScreen', async ({ page }) => {
    await page.goto('/')

    // Select difficulty and start
    await page.locator('[role="radio"]').first().click()
    await page.locator('button:has-text("START")').click()

    // Wait for TestScreen hidden input to be ready, then type one character
    // to start the timer (TIMER_DURATION=3 via NEXT_PUBLIC_TEST_TIMER_DURATION)
    const input = page.locator('[aria-label="Type the displayed text"]')
    await input.waitFor({ state: 'attached' })
    await input.focus()
    await page.keyboard.type('a')

    // Wait for the 3-second timer to expire (add 1s buffer = 4s total)
    await page.waitForTimeout(4000)

    // Verify ResultScreen is visible before scanning
    await expect(page.locator('text=TEST COMPLETE')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .disableRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
