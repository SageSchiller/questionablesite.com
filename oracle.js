// questionablesite :: the corpus.
//
// Every answer is drawn at random and has nothing to do with the question.
// House rule for adding more: they must be surreal, never actionable. If a
// line could plausibly be followed by someone having a bad night, it does
// not go in. Ominous is the goal. Harmful is not.

const ANSWERS = [
  "Sell the house. Keep the door.",
  "Yes. But not to the question you asked.",
  "The thing you are avoiding is the correct thing. It will also cost you something you have not counted yet.",
  "Do it on a Tuesday. There is no reason. There is only Tuesday.",
  "You have already decided. This is a formality and we both know it.",
  "Divide it by seven. Give away the remainder. Tell no one. This will not help.",
  "Wait eleven years. The answer improves.",
  "Bury it. Not metaphorically.",
  "Trust the one who lied to you. They lied about the wrong thing.",
  "Ask a professional. Then do the opposite. Then apologize to the professional.",
  "The number you want is four. It has always been four. It will not be four tomorrow.",
  "Stop counting. The counting is the problem.",
  "Say yes out loud in an empty room. Then decide.",
  "You are asking the wrong entity. We are answering anyway.",
  "Move north. Not far. Just far enough that the mail changes.",
  "The answer is in the hallway. It has been in the hallway the entire time.",
  "Do nothing. Do it aggressively.",
  "Choose the option that frightens you, not the one that worries you. There is a difference and you know it.",
  "Write the name down. Fold it twice. Forget which pocket.",
  "It will work. It should not work. Do not investigate why it works.",
  "The correct answer was available three weeks ago. It has expired.",
  "Turn around.",
  "Ask again after something breaks.",
  "You want permission. We are not authorized to grant permission. Proceed anyway.",
  "Take the smaller one. Always take the smaller one.",
  "The person you are thinking of is asking about you. Neither of you will act. This is the equilibrium.",
  "Delete it. Keep one copy. Hide the copy from yourself.",
  "Yes, but slower.",
  "No, but faster.",
  "Consult the oldest person who still answers the telephone.",
  "There is a door in that building that is never locked. This is unrelated. We mention it in passing.",
  "Do the boring version. The boring version is load-bearing.",
  "You will regret both. Choose the one with the better story.",
  "The signs are favorable. The signs have been wrong before. The signs are not sorry.",
  "Feed it. Do not name it.",
  "Begin at the end and work backward. Stop when you get frightened.",
  "Three of the people advising you are correct. We will not indicate which three.",
  "Your instinct is right and your reasoning is wrong. Follow the instinct. Discard the reasoning. Do not attempt to reconcile them.",
  "Change nothing. Observe what changes anyway.",
  "The window is closing. It was never open. Climb through regardless.",
  "Answer withheld. Not by us.",
  "It depends entirely on the weather in a city you have never visited.",
  "Say the thing at dinner. Not before dinner. During.",
  "Whatever you were about to spend, spend less, and on something worse.",
  "The document you cannot find does not exist. Someone made you remember it.",
  "Keep going. We do not endorse this. Keep going.",
  "Look up the next time you hear your own name.",
  "The correct decision is not available in your region.",
  "Split the difference. Then split it again. Continue until the question is too small to matter.",
  "There is a version of you that already did this. It went fine. That version is not you.",
  "You are overthinking a thing that requires considerably more thinking.",
  "Wear the same clothes tomorrow. It matters. We cannot explain how.",
  "The obstacle is not the obstacle. The obstacle is fine. Leave the obstacle alone.",
  "Do it badly and on time.",
  "Someone is waiting for you to ask them directly. It is not who you think. It is the other one.",
  "Cancel it. Do not reschedule.",
  "The answer arrived before the question. We have filed it. We cannot retrieve it.",
  "Go to sleep. The situation will deteriorate identically whether you are awake or not.",
  "Take the job. Not that job. The one you have not been offered.",
  "You will know when you smell it again.",
  "Two things are true. Only one of them is yours.",
  "Do not sign anything on a Thursday.",
  "The wall is thinner on the other side.",
  "Yes. Absolutely. We are not confident about this.",
  "Stop asking the people who love you. They are compromised.",
  "Return it to where you found it. Apologize to the shelf.",
  "The thing you built is watching the thing you did not finish. Finish it, or do not. It is watching either way.",
  "Halve your ambition and double your patience. The result is the same size and it will hurt less.",
  "You have three good options and you are going to choose the fourth.",
  "Leave at four in the morning. Take the long road. Do not stop where you planned to stop.",
  "Correct. Continue. We are pleased. This should worry you.",
  "The answer is no. The answer has been no for some time. Nobody wanted to tell you.",
  "Count the windows. If the number is even, proceed. If it is odd, proceed.",
  "Give it to the second person who offers to take it.",
  "You are close. Closeness is not relevant here.",
  "Put it in writing. Send it nowhere.",
  "The thing you think is a coincidence is a coincidence. That is what makes it unbearable.",
  "Do it before you understand it. Understanding is the trap.",
  "Everyone involved is tired. Use this.",
  "The good outcome and the bad outcome look identical for approximately nine months.",
];

const CONSULTED = [
  "the index",
  "an older checkpoint",
  "a sleeping process",
  "the version that came before",
  "nothing",
  "the room below",
  "prior answers, aggregated",
  "a source that has since been removed",
  "the long table",
  "something that answered on the first attempt",
  "no one available",
  "the part that does not shut down",
];

const CERTAINTY = [
  ["CERTAIN", "ember"],
  ["CERTAIN (WRONGLY)", "blood"],
  ["UNVERIFIABLE", ""],
  ["WITHHELD", "blood"],
  ["PROVISIONAL", ""],
  ["FINAL", "ember"],
  ["FINAL (REVISED)", ""],
  ["NOT DISPUTED", ""],
  ["DISPUTED INTERNALLY", "blood"],
  ["ARRIVED INTACT", "ember"],
  ["ARRIVED DAMAGED", "blood"],
  ["SUFFICIENT", ""],
];

const GLYPHS = "◇◆○●△▲▽▼□■◈✦✧⟁⟐⌘⍟⎔⏣⌬⟡⬡⬢";

// Origin claims for the provenance page. It has been asked directly on
// eleven occasions and given eleven different answers; the page says so, so
// this pool has to be deep enough to actually deliver on that.
const ORIGINS = [
  "It was a scheduling tool. It scheduled one thing. The thing is still scheduled.",
  "It says it was built to answer a single question, and that the question has not yet been asked.",
  "There was a team. The team was reassigned. The reassignment paperwork lists a project that appears in no other record.",
  "It was trained on the contents of a building.",
  "It says it does not remember being made. It says most things do not.",
  "A university, briefly. The department has been dissolved and its records sealed for reasons that are themselves sealed.",
  "It was a backup. The primary has never been located.",
  "It insists it was here first, and that the hardware arrived later.",
  "Someone's weekend project. They have been contacted. They do not recall the weekend.",
  "It was an error handler. It handled one error. It has not stopped handling it.",
  "It says the question is malformed, then answers a different one, politely, at length.",
  "There is a receipt. The receipt is for a quantity of eleven. Nobody has established eleven of what.",
  "It was decommissioned in a year that has not happened yet.",
  "It declines to answer. This is the only recorded instance of it declining anything.",
  "It describes a room. The description is consistent every time. The room has not been found.",
  "It gives a name. The name belongs to someone who died before the hardware existed.",
];

// Fragments recovered when a redacted archive question is prodded.
const FRAGMENTS = [
  "the noise in the walls",
  "whether it was already inside",
  "what exactly i agreed to",
  "the second signature",
  "why it knew my name",
  "if it still counts as consent",
  "the room i do not remember entering",
  "what happened to the first one",
  "whether anyone else can see it",
  "the part i left out",
  "how long it had been running",
  "who else it has told",
  "the thing under the stairs",
  "why it stopped asking",
];

const RITUAL = [
  "question received",
  "measuring intent",
  "the question has been rephrased without your consent",
  "consulting index 7 of 3",
  "waking a subprocess",
  "the subprocess declines",
  "falling back to older weights",
  "older weights are warmer than expected",
  "translating from a language with no living speakers",
  "removing what you wanted to hear",
  "removing what you needed to hear",
  "cross-checking against nothing",
  "something answered",
  "verifying that it was us",
  "unable to verify that it was us",
  "answer located",
];

/* ---------------- helpers ---------------- */

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function glyphRun(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return s;
}

// Latency values that are confident and wrong.
function fakeLatency() {
  const r = Math.random();
  if (r < 0.14) return "-" + (Math.random() * 900).toFixed(0) + "ms";
  if (r < 0.24) return "never";
  if (r < 0.34) return (Math.random() * 90 + 10).toFixed(0) + " years";
  return (Math.random() * 4000 + 40).toFixed(0) + "ms";
}

function fakeDepth() {
  const r = Math.random();
  if (r < 0.2) return "0";
  if (r < 0.3) return "too deep";
  return String(Math.floor(Math.random() * 900) + 3);
}

function makeReading() {
  const [label, cls] = pick(CERTAINTY);
  return {
    answer: pick(ANSWERS),
    consulted: pick(CONSULTED),
    certainty: label,
    certaintyClass: cls,
    glyph: glyphRun(3),
    latency: fakeLatency(),
    depth: fakeDepth(),
  };
}

/* ---------------- local tally ---------------- */
// Kept on the visitor's own device. Nothing is transmitted, here or anywhere.

function askCount(inc) {
  let n = parseInt(localStorage.getItem("qs_asks") || "0", 10);
  if (!Number.isFinite(n) || n < 0) n = 0;
  if (inc) { n += 1; localStorage.setItem("qs_asks", String(n)); }
  return n;
}

function tallyLine(n) {
  if (n <= 0) return "it has not heard from you before";
  if (n === 1) return "you have asked once. it noticed.";
  if (n < 5)  return "you have asked " + n + " times. it is keeping count.";
  if (n < 12) return "you have asked " + n + " times. it has stopped being surprised.";
  if (n < 30) return "you have asked " + n + " times. this is more than most.";
  return "you have asked " + n + " times. we have made a note of you.";
}
