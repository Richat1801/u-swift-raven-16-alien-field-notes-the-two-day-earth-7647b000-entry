// Alien Field Notes: The Two Day Earth Review — entry program.
// Node 22, standard library only. Deterministic: writes the same bytes on
// every run. The program holds a small bank of ORIGINAL one-line reviews of
// planet Earth written by an alien tourist, scores each on the judge's own
// criteria (alien tourist's review first, then funniness from the alien's
// angle, originality, sounds like a real review with a verdict, tightness
// with the punch at the end), and writes only the winner to
// /output/entry.txt (1-200 characters, UTF-8, no trailing newline).
import { mkdirSync, writeFileSync } from "node:fs";

type Candidate = {
  text: string;
  // Scores out of 5, judged against the published brief.
  premise: number; // reads as a one-line review of Earth by an alien tourist
  funny: number; // the laugh comes from the alien's angle on ordinary life
  original: number; // a detail few other entrants would reach (not traffic,
  // gravity, money or weather)
  review: number; // sounds like a real review: verdict, rating, closing remark
  tight: number; // every word earns its place, punch lands at the end
};

const CANDIDATES: Candidate[] = [
  {
    text: "Two stars. The locals worship glowing rectangles, queue for bitter bean water, and call it 'morning'. The dogs, though \u2014 five stars.",
    premise: 5, // an outsider reporting on the locals, in review form
    funny: 5, // phones and coffee seen as worship and ritual by a visitor
    // who has no word for either; the dogs' five stars undercut the two,
    // so the review's own verdict is overruled by its last line
    original: 5, // glowing-rectangle worship + bitter bean water as a
    // morning rite: no traffic, gravity, money or weather in sight
    review: 5, // star rating up front, verdict, closing remark at the end
    tight: 5, // 132 characters; the punch ("five stars") is the last word
  },
  {
    text: "Three stars. Beautiful planet, but the dominant species panics when its glowing slab dies. The dogs were lovely, the wifi password is a state secret.",
    premise: 4,
    funny: 4, // the slab-death panic is a good alien observation
    original: 3, // "wifi password is a state secret" is a familiar gag
    review: 4,
    tight: 3, // two closing thoughts; the punch is split
  },
  {
    text: "One star: came for the beaches, stayed for the existential dread. The locals apologise to furniture. Would abduct again, mostly for the dogs.",
    premise: 4,
    funny: 4, // apologising to furniture is a nice outsider detail
    original: 3, // "existential dread" is the first obvious tourist note
    review: 4,
    tight: 4,
  },
  {
    text: "Gave Earth two stars. The cats run the house, the humans serve them, and nobody told me the water falls from the sky. Dogs: five stars.",
    premise: 4,
    funny: 4, // cats as the ruling species is a strong alien read
    original: 3, // cats-in-charge is a well-travelled joke
    review: 4,
    tight: 4,
  },
  {
    text: "Lovely planet, confusing locals: they queue for bitter bean water, stare at glowing slabs, and call it 'morning'. Two stars. The dogs: five.",
    premise: 4,
    funny: 4,
    original: 4, // same bean-water observation, but the rating lands
    // mid-line and the ending repeats the dogs beat instead of landing it
    review: 4,
    tight: 3,
  },
];

function score(c: Candidate): number {
  // The brief's order: premise first, then funniness, originality, the
  // review shape, and tightness. Economy bonus: shorter wins ties.
  const base =
    c.premise * 3 + c.funny * 3 + c.original * 2 + c.review * 2 + c.tight * 2;
  return base + Math.max(0, 200 - [...c.text].length) / 200;
}

let best = CANDIDATES[0];
for (const c of CANDIDATES.slice(1)) {
  if (score(c) > score(best)) best = c;
}

const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
writeFileSync(`${out}/entry.txt`, best.text, "utf8");
