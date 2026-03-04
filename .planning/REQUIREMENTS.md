# REQUIREMENTS.md
# Place at: .planning/REQUIREMENTS.md

## v1 Requirements

### Core Typing Test
R-001  User can select Easy, Medium, or Hard difficulty                           Phase 1  must
R-002  Selecting a difficulty enables the Start button                            Phase 1  must
R-003  Test displays a paragraph of words from the selected difficulty pool       Phase 1  must
R-004  Timer starts on first printable keypress, not on screen load               Phase 1  must
R-005  Timer counts down from 60 seconds                                          Phase 1  must
R-006  Characters marked correct (green) or incorrect (red) as typed              Phase 1  must
R-007  Blinking cursor indicates current expected character                        Phase 1  must
R-008  Space advances to next word regardless of current word correctness          Phase 1  must
R-009  Backspace deletes last char of current word only, no crossing word boundary Phase 1  must
R-010  When timer hits zero, test ends and result overlay appears                  Phase 1  must
R-011  If word list exhausted before timer, test ends immediately                  Phase 1  must

### Live Stats
R-020  WPM displayed and recalculated every second during test                    Phase 2  must
R-021  Accuracy percentage displayed and updated every second                     Phase 2  must
R-022  Countdown timer displayed during test                                       Phase 2  must
R-023  StatsBar hidden until first keypress, then animates in                     Phase 2  must
R-024  Timer value turns red and pulses when 10 seconds remain                    Phase 2  should

### Results
R-030  Result overlay shows final WPM                                              Phase 2  must
R-031  Result overlay shows final accuracy percentage                              Phase 2  must
R-032  Result overlay shows correct and incorrect character counts                 Phase 2  must
R-033  Retry button starts fresh test with same difficulty, no home screen trip   Phase 2  must
R-034  Home button returns to home screen with difficulty selection reset          Phase 2  must

### Sounds
R-040  Correct keypress plays a short typewriter-style click sound                Phase 3  must
R-041  Incorrect keypress plays a distinct lower harsh tone                        Phase 3  must
R-042  All sounds generated via Web Audio API — no external audio files           Phase 3  must

### Edge Cases
R-050  Caps Lock on shows a warning banner below TextDisplay                      Phase 3  must
R-051  Caps Lock warning disappears when Caps Lock is turned off                  Phase 3  must
R-052  Escape during test shows quit confirmation with YES and NO options          Phase 3  must
R-053  Timer freezes while quit confirmation is visible                            Phase 3  must
R-054  YES in quit confirmation returns to home screen, no result shown           Phase 3  must
R-055  NO in quit confirmation dismisses it and resumes timer                     Phase 3  must
R-056  Escape while confirmation showing dismisses it (same as NO)                Phase 3  must
R-057  Space and Backspace before first character do not start the timer           Phase 3  must

### Animations and Polish
R-060  Home screen elements stagger-fade in on mount                              Phase 3  should
R-061  Difficulty button selection has pulse and underline slide animation         Phase 3  should
R-062  Screen transitions use fade and slide                                       Phase 3  should
R-063  Wrong key press shakes the current word briefly                            Phase 3  should
R-064  Correct word completion triggers a brief green flash                        Phase 3  should
R-065  Result overlay enters with spring scale animation                           Phase 3  should
R-066  Result stats count up from zero on overlay mount                           Phase 3  should
R-067  TextDisplay scrolls smoothly when active line changes                      Phase 3  should
R-068  Cursor blink pauses while user is actively typing                          Phase 3  nice

### Accessibility
R-070  All interactive elements keyboard navigable                                 All     must
R-071  axe-core scan passes on all three screens                                  All     must
R-072  Caps Lock warning uses role="alert"                                         Phase 3  must
R-073  Quit confirmation traps focus, returns on dismiss                           Phase 3  must
R-074  Result overlay traps focus, Retry gets focus on mount                      Phase 3  must
R-075  DifficultySelector uses role="radiogroup" and role="radio"                 Phase 1  must
R-076  Hidden input has aria-label                                                 Phase 1  must
R-077  Test complete announced via aria-live on result mount                      Phase 3  must

---

## v2 Requirements (Out of Scope for v1)

R-200  Sound toggle UI
R-201  localStorage score history
R-202  Leaderboard
R-203  Mobile and touch support
R-204  Custom text input mode
R-205  Pause mechanic
R-206  Multiple color themes
R-207  Typing test for code snippets

---

## Explicitly Out of Scope (Never in This Product)

User accounts or authentication of any kind.
Server-side anything.
Native mobile apps.

---

## Status Tracker

R-001: In Progress (data foundation in place — UI implementation in Plans 04-06)
R-002: In Progress (data foundation in place — UI implementation in Plans 04-06)
R-003: In Progress (word lists + generateText done — TextDisplay in Plan 04)
R-004: In Progress (data types ready — useCountdown in Plan 02, engine in Plan 03)
R-005: In Progress (TIMER_DURATION constant + env override ready — hook in Plan 02)
R-006 through R-077: Planned

Update status as phases complete:
Planned | In Progress | Done | Removed
