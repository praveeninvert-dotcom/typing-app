// Structure change: instead of flat word arrays, each difficulty
// has 3 paragraph sets. generateText.ts picks one at random per test run.
//
// Easy:   plain prose, no punctuation, common vocabulary, universally relatable themes
// Medium: natural English with apostrophes, commas, periods — engaging topics anyone cares about
// Hard:   special characters and numbers appear through cooking, sports, space, email
//         — not through developer tooling
 
export type Difficulty = 'easy' | 'medium' | 'hard'
 
export const paragraphs: Record<Difficulty, string[]> = {
  easy: [
    // Set 1 — coffee and mornings
    `the smell of coffee in the morning is one of those small things that can shift the whole tone of a day before it has even begun some people grind the beans fresh each time and some just press a button on a machine by the sink but the cup in the hand the warmth through the mug and the first sip in the quiet that part is the same for most of us and it is enough to make even a hard week feel like it has a soft edge to it`,
 
    // Set 2 — rain
    `rain does something to a room when it falls hard outside the light inside goes softer and the sounds from the street grow dull and far away it is easier to sit still on days like that to stay where you are and let the world outside do its thing some people find it sad but most who love it say it feels like the world is giving them a reason to slow down and they are glad for the excuse to take it`,
 
    // Set 3 — cooking for someone
    `there is a reason people cook for each other when things get hard it is one of the oldest ways to say that you care and that you want the person across from you to feel well a meal made by hand takes time and time is the thing most of us feel we never have enough of so to spend it on someone else is a kind of gift that does not need a bow or a card to land the way it should`,
 
    // Set 4 — music and memory
    `music has a way of reaching back into years you thought you had left behind a song can bring back a room a face a feeling with more force than a photo can a photo shows you what things looked like but a song can remind you what they felt like and that is a different kind of memory one that lives in the chest not just in the eyes and it can catch you off guard when you least expect it`,
  ],
 
  medium: [
    // Set 1 — cities at night
    `Every city has a version of itself that only exists at night. The streets belong to different people: the ones finishing late shifts, the ones starting early ones, the ones who just aren't ready to go home yet. There's an honesty to it. People walk faster, talk quieter, and notice more. The same block you rush past at noon turns into something worth pausing for at midnight, if you're patient enough to let it.`,
 
    // Set 2 — reading
    `Reading a book you love is one of the few experiences that genuinely slows time down. You lose track of where you are. The room gets darker and you don't notice until you're squinting. People call it escapism, as though that's a flaw. But choosing where your mind goes and what it lingers on isn't running away. It's one of the more deliberate things a person can do with an afternoon, and it costs almost nothing.`,
 
    // Set 3 — travel
    `The best part of arriving somewhere new isn't the famous landmark or the food you've read about. It's the walk between things — the wrong turn that puts you on a street nobody photographed, the café you picked because it was raining, not because it was rated. Planned trips give you the things you expected. The unplanned moments give you the story you'll actually tell when you get back home.`,
 
    // Set 4 — how habits form
    `Most people don't change their lives through big decisions. They change them through small, repeated choices they barely notice making. The person who reads every night before bed doesn't decide to become a reader. They just reach for a book instead of a phone one evening, then again the next. Identity follows behavior, not the other way around. You don't build the habit because you are that person — you become that person because you built the habit.`,
  ],
 
  hard: [
    // Set 1 — sports records (everyone knows sports)
    `Usain Bolt ran 100 meters in 9.58 seconds on August 16, 2009 — a world record that still stands. At peak velocity, he reached 44.72 km/h (27.8 mph). The average person covers the same distance in 13–17 seconds. Bolt's stride length measured 2.44 meters; his cadence, 4.28 strides/second. Statistics like these don't just describe athletic performance — they reframe what the word "human" is allowed to mean.`,
 
    // Set 2 — space (universally fascinating)
    `The Moon sits 384,400 km from Earth on average — close enough that light covers the gap in 1.28 seconds. The Sun? 149.6 million km away: 8 minutes, 20 seconds at light speed. Proxima Centauri, the nearest star beyond our solar system, is 4.24 light-years out. A signal sent today wouldn't arrive until 2029. Space isn't just large; the numbers involved require you to completely rethink what "far" and "soon" even mean.`,
 
    // Set 3 — recipe with real measurements
    `Preheat the oven to 200°C (392°F). Combine 250g plain flour, 1 tsp baking powder, and ½ tsp salt. In a second bowl, whisk 2 eggs with 120ml whole milk and 60ml vegetable oil. Fold the wet mix into the dry — don't overmix. Pour into a greased 23cm tin and bake for 22–25 minutes. A skewer at the centre should come out clean. Cool on a rack for at least 10 minutes before serving.`,
 
    // Set 4 — email (everyone writes email)
    `Subject: Re: Q3 wrap-up — action items attached. Hi all, following up on Thursday's call. Three things due by Nov 30: (1) finalize the slide deck, (2) confirm the budget at $4,200–$4,800, and (3) send RSVPs to events@venue.com. Headcount cap is 35; we're at 28 confirmed. Reply-all if you have blockers. Notes from the call are at: docs.team.com/q3-notes. Thanks — P.`,
  ],
}