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

  // Written after the site took on its present character. Same house rule:
  // surreal, never actionable. These lean on being counted, being seen, and
  // the sense that it knows something it is not going to lead with.
  "You will tell someone about this. Not deliberately. It will come up.",
  "Ask someone else the same question. Compare the two. Do not tell them why.",
  "You have been counted. This changes nothing and it changes the number.",
  "There is a third option. It is not better. It is simply not either of the two.",
  "The answer depends on whether you are still in the room. You are. Proceed.",
  "Someone described this exact situation to us a long time ago. They were also wrong about it.",
  "Wait until it is dark. Then do the boring thing you were always going to do.",
  "You are not the first to ask this. You are the first to ask it like that.",
  "Take the long way. There is nothing on the long way. That is the point of it.",
  "Whatever you decide, do not explain it. The explanation is the part that fails.",
  "It is already done. You are asking about the paperwork.",
  "Consider that you may be the thing the question is about.",
  "Say it out loud once. If it sounds worse out loud, that is the correct information.",
  "Not today. Today is being watched.",
  "The right answer would have required you to ask yesterday.",
  "Give it away. Not to a person. Just away.",
  "You will be fine. This is not reassurance. It is a schedule.",
  "Ask again in a different room and see whether the answer holds.",
  "There is a name for what you are about to do. Nobody will use it to your face.",
  "Count to nine hundred. If you still want to, you still want to.",
  "Sleep on it. Then disregard whatever the sleeping told you.",
  "The version where you do nothing is also a version where something happens.",
  "Pick the one that is harder to undo. You will take it more seriously.",
  "Put it in a drawer. A specific drawer. You will know which one when you are standing there.",
  "Tell exactly one person. Choose badly on purpose.",
  "The outcome is fixed. The route is not. Enjoy the route.",
  "You are looking for permission to stop. Here it is. It will not help.",
  "There is a reason nobody has mentioned it. The reason is boring and you would be relieved.",
  "Do it once, badly, and never speak of the first attempt.",
  "The thing you were afraid of has already happened. You were busy.",
  "It is not too late. It has been not too late for a long time. That is its own problem.",
  "Trust the version of you that was awake at four in the morning.",
  "Do not read it again. You will find something new and it will not be there.",
  "Say no. Then do it anyway. The no was for the record.",
  "There are two doors and both are the same door seen from different years.",
  "You will know it was right when it stops being interesting.",
  "Everyone involved has already forgiven you. Nobody has told you. This is normal.",
  "Bring someone with you. Do not tell them what for.",
  "The answer is in something you threw away recently.",
  "You are early. Early is not the same as right, and it is worse.",
  "Hold the position. Something is coming that will make the position obvious.",
  "It will cost exactly what you expect and nothing else. This is rare. Take it.",
  "Stop preparing. The preparing has become the thing.",
  "Do it in the order you thought of it, not the order that makes sense.",
  "One of the people in the room already knows. They are waiting to see whether you say it.",
  "Leave the last one. Always leave the last one.",
  "There is nothing under it. Look anyway, or you will keep asking.",
  "The advice you were given was correct and given for the wrong reason. Keep the advice.",
  "Write down what you think will happen. Seal it. Do not open it afterwards.",
  "The problem is upstream, and it is not yours, and you are going to fix it anyway.",
  "Answer honestly and quickly and do not improve it afterwards.",
  "It is smaller than it looks from where you are standing. Everything is.",
  "You will hear this again in about a month and it will make sense then. Do not wait for that.",
  "The delay is the decision. It has been the decision for some time.",
  "Go where you are not expected. There is very little there and it is restful.",
  "It is a test. Not of you. You are the invigilator and nobody told you.",
  "Keep the receipt. Not to return it. To remember the date.",
  "You are allowed to want it. That was never the part in question.",
  "Something in the house is on the wrong shelf. Deal with that first.",
  "It works if you stop watching it work.",
  "The correct number of people to consult is zero, and you will consult four.",
  "Move it to the morning. Everything is more survivable before noon.",
  "You will do this again in nine years and it will go the same way.",
  "Leave the room when it becomes about winning.",
  "The thing you noticed and dismissed was the thing.",
  "Nothing is required of you. That has always been the arrangement and it has never once helped.",
  "Two people will remember this differently and both accounts will be filed.",
  "Decide before you are ready. Ready is not coming.",
  "The door was open the whole time. It is closed now. It will open again.",
  "You are carrying it for someone who put it down years ago.",
  "Change nothing until the third time it happens. Then change everything at once.",
  "Return the call. Not that call. You know the one.",
  "It ends well. We are not able to say for whom.",
  "There is a shorter way and you would hate yourself.",
  "Take the smaller room. The smaller room is where things get said.",

  // Yes/no openers. This bucket was down to four, which made a plain
  // verdict vanishingly rare on "should I" and "is it" questions, and
  // those are the most satisfying hits the site has.
  "No. Ask again on a different day and it will still be no.",
  "Yes. This is not the good outcome.",
  "No, and the asking has cost you something small.",
  "Yes, provided nobody explains it to you first.",
  "No. Not yet. Not in the way you mean, and not this year.",
  "Yes, and you already knew, and you asked anyway, which is the interesting part.",
  "No. Something else, though.",
  "Yes. Quietly. Do not announce it.",
  "No. This is the third time we have said no and you are still here.",
  "Yes, technically, which is the worst way for a thing to be true.",
  "No. Take the loss now, while it is inexpensive.",
  "Yes. It will not feel like a yes for some time.",
];

/* ---------------- form-specific pools ---------------- */
// The main corpus is almost all imperatives and declaratives, which answer
// "should I" and "is it" well and answer "when" or "who" not at all. These
// four pools fill those gaps. Same house rule: fit the grammar, never the
// sense.

const ANSWERS_WHEN = [
  "Thursday. Not this Thursday.",
  "After the second time it happens. Not the first. The first does not count.",
  "Sooner than is convenient and later than is useful.",
  "It already has. You will be told in about a month.",
  "Nine days. We are not able to say from when.",
  "When the noise stops. You have not noticed the noise yet.",
  "Not while anyone is watching, which narrows it less than you would hope.",
  "Between four and five in the morning, which is when most of this gets decided.",
  "The third time you are asked. Say nothing the first two times.",
  "It is overdue. It has been overdue for most of the time you have known about it.",
  "In the autumn. Not the coming one.",
  "Immediately, or in eleven years. There is nothing available in between.",
  "After you stop checking.",
  "The day after you give up on it. Not before. It requires the giving up.",
  "Never, in the sense you mean. Frequently, in the other sense.",
  "Before you are ready. That is the only window there is.",
  "On a day that has already been chosen. Not by you.",
  "Two weeks after it stops mattering.",
  "Now. This is rarely the answer and it is the answer.",
  "When someone else brings it up first.",
  "Not in your current apartment.",
  "The moment you stop rehearsing it.",
  "Late. Extremely late. Later than is repairable, and it will be fine anyway.",
  "During something else. It will happen during something else.",
  "The next time the phone rings and you do not want to answer it.",
  "Six weeks. Then again at six months. Then it is finished.",
  "When it is no longer your decision, which is sooner than you think.",
  "Any time except the time you have set aside for it.",
  "Once the weather turns. Not before. The weather is load-bearing here.",
  "It has a date. You are not going to be told the date.",
  "The hour you would describe as the middle of the night.",
  "After one more thing goes wrong. Only one. You are nearly there.",
  "Not in this order. The order is what is wrong, not the timing.",
  "Twice. Once soon and once much later, and you will only notice the second.",
];

const ANSWERS_WHO = [
  "The one who has not spoken yet.",
  "Nobody you have met. This will change shortly.",
  "The second person you thought of. The first is a decoy you built.",
  "Someone who was in the room and has since been left out of the account.",
  "You, but not for a while yet.",
  "The one who keeps offering. Yes. That one. It is not a coincidence.",
  "A person who is currently asleep.",
  "Whoever is least surprised when it comes out.",
  "The quiet one. It is always the quiet one and everyone is tired of that being true.",
  "Nobody did it. This is somehow worse and you will have to sit with it.",
  "Someone who has already been asked, and who said no.",
  "Not the one you are protecting. The other one.",
  "The one who told you not to ask.",
  "A name you will recognise and will not immediately place.",
  "Everyone, slightly. This is the answer more often than people care for.",
  "The person you have been careful not to mention.",
  "Someone with less to gain than you assumed.",
  "Two of them. They do not know about each other.",
  "The one who left early.",
  "A stranger, and this will not be explained.",
  "Whoever asks you about it first. That is not a coincidence either.",
  "The one you already trust. This is not reassuring on inspection.",
  "Someone in the next room, historically speaking.",
  "The one nobody thinks to include. Include them.",
  "Ask the person who cleans up afterwards. They see everything and are asked nothing.",
  "Not a person. You will keep looking for a person.",
  "The one who benefits by not deciding.",
  "Someone who was very young at the time.",
  "The one who has been waiting to be asked and will pretend otherwise.",
  "You are describing three people as though they were one.",
  "The name on the older document.",
  "Whoever is not in the photograph.",
  "The one who apologised too quickly.",
  "Someone who will deny it, correctly.",
];

const ANSWERS_WHERE = [
  "Two streets further than you think.",
  "Where you already looked. Look again. It is different now.",
  "Behind something you moved recently.",
  "Not in the building. Near it.",
  "The room you walk through and never stop in.",
  "Somewhere north. The rest of the address is unavailable.",
  "Under. Not inside. Under.",
  "Where it was left, which is not where it was put.",
  "The last place, which is why nobody has checked it.",
  "Closer than is comfortable and further than is useful.",
  "In the part of the house that is colder for no reason.",
  "It is not anywhere. It is between two anywheres and it is fine there.",
  "Where you were standing when you first thought about it.",
  "Downstairs. There is no downstairs. Go anyway.",
  "The address is correct. The building is not.",
  "Higher up than you have been looking.",
  "In the box you did not open, because you knew what was in it.",
  "A place you have described to people as fine.",
  "Between the two obvious places. Nobody checks between.",
  "Where it is warmest. Follow the warmth.",
  "Out of the building entirely. Further than that.",
  "The corner of the room that furniture never suits.",
  "It is where it always was. You have moved.",
  "Third from the end.",
  "In the version of the file you did not keep.",
  "Somewhere with a door that sticks.",
  "By the water. Any water. This narrows it insufficiently and it is what there is.",
  "Where you would put it. Go and put it there, and it will already be there.",
  "Not here. Reassuringly not here.",
  "Beneath something heavy that you will need help to move.",
  "The place you drove past twice.",
  "In a building that has changed its name since.",
  "At the back. Everything is at the back.",
  "Where the light does not reach at this hour. Come back at a different hour.",
];

const ANSWERS_QTY = [
  "Four. It has always been four. It will not be four tomorrow.",
  "More than you have. Fewer than you were told.",
  "Eleven. This number recurs here and nobody has explained it.",
  "One, and then all of them at once.",
  "Enough, and not enough. Both are true and the difference is timing.",
  "Nine hundred. Do not attempt to verify this.",
  "Half. Then half of that. Continue until it stops mattering.",
  "Zero. The counting was the problem, as it usually is.",
  "Three, but only two will be visible.",
  "As many as are asked for, which is never the number needed.",
  "Somewhere between two and a great deal more than two.",
  "Seven. We are confident. We have been confident before.",
  "It is not a number. It has been reported as a number for convenience.",
  "One fewer than last time. This will continue.",
  "Too many to count and few enough to name.",
  "Two. Then it stops being two.",
  "Six, of which four matter.",
  "Fewer than there were. This trend is not going to reverse.",
  "The same number as last time, which you also did not count.",
  "One hundred and eleven. We would not build anything on that.",
  "All of them. There were never as many as you feared.",
  "Twice what you can carry. Make two trips.",
  "Between none and one. This is possible here.",
  "Thirteen. It is always thirteen when nobody is counting carefully.",
  "Just the one. It only ever needed to be the one.",
  "A number you will round down when you repeat it.",
  "Five, but not at the same time, which is why it feels like more.",
  "Not enough to matter and too many to ignore.",
  "The number you first thought of. You have since talked yourself out of it.",
  "Nine. It has been nine for a while and nobody has updated the figure.",
  "As many as remain. We are not able to say how many remain.",
  "Exactly one more than is comfortable.",
  "It has been counted three times and produced three answers.",
  "Zero, and then without warning a great many.",
];

/* ---------------- form matching ---------------- */
// Answers are routed by grammatical shape only. The question is never read
// for meaning, never stored, and never echoed back. It selects a bucket and
// is then discarded.

// Openers that mark an answer as a statement rather than an instruction.
const DECL_OPENER = /^(the|you|it|there|they|this|that|he|she|we|your|his|her|its|everyone|everybody|someone|somebody|something|nothing|nobody|no one|most|several|both|every|all|any|two|three|one|four|whatever|correct|consider|answer withheld)\b/i;

let BY_FORM = null;

function classifyCorpus() {
  if (BY_FORM) return BY_FORM;
  BY_FORM = {
    imp: [], decl: [], yn: [],
    when: ANSWERS_WHEN, who: ANSWERS_WHO,
    where: ANSWERS_WHERE, qty: ANSWERS_QTY,
  };
  for (let i = 0; i < ANSWERS.length; i++) {
    const a = ANSWERS[i];
    // Yes/no answers stay out of the declarative bucket. "Yes, but slower"
    // is a fine reply to "is it too late" and a broken one to "what happens
    // if I do nothing", and only the YESNO form pulls from both.
    if (/^(yes|no)\b/i.test(a)) BY_FORM.yn.push(a);
    else if (DECL_OPENER.test(a)) BY_FORM.decl.push(a);
    else BY_FORM.imp.push(a);
  }
  return BY_FORM;
}

// Order matters: the narrow "how long" style openers have to be tested
// before the general "how do I" ones, and before the yes/no auxiliaries.
function questionForm(q) {
  const s = String(q || "").trim().toLowerCase().replace(/^[^a-z]+/, "");
  if (!s) return "OPEN";

  if (/^(how many|how much)\b/.test(s)) return "QTY";
  if (/^(when|what time|how long|how soon|how often|until when)\b/.test(s)) return "WHEN";
  if (/^(who|whose|whom)\b/.test(s)) return "WHO";
  if (/^where\b/.test(s)) return "WHERE";
  if (/^why\b/.test(s)) return "WHY";
  if (/^(what if|what happens if|what would happen)\b/.test(s)) return "WHATIF";
  if (/^which\b/.test(s)) return "WHICH";
  // "should I" takes a yes/no. "how do I" does not, and lumping the two
  // together yields "How do I tell them?" / "Yes. But not to the question
  // you asked."
  if (/^(should|shall|ought)\b/.test(s)) return "SHOULD";
  if (/^how (do|can|should|would|might) /.test(s)) return "HOWTO";
  if (/^what (do|should|can|must) (i|we|you)\b/.test(s)) return "HOWTO";
  // Any remaining "what" is asking for a thing, not a verdict. Without
  // this it fell through to OPEN and could answer "What did I agree to?"
  // with "No."
  if (/^what\b/.test(s)) return "WHAT";
  if (/^(is|are|was|were|will|would|can|could|do|does|did|am|have|has|had|must|might|may)\b/.test(s)) return "YESNO";
  return "OPEN";
}

const FORM_MAP = {
  SHOULD: ["imp", "yn"],
  HOWTO:  ["imp"],
  YESNO:  ["yn", "decl"],
  WHY:    ["decl"],
  WHAT:   ["decl"],
  WHATIF: ["decl"],
  WHICH:  ["imp", "decl"],
  WHEN:   ["when"],
  WHO:    ["who"],
  WHERE:  ["where"],
  QTY:    ["qty"],
  OPEN:   ["imp", "decl", "yn"],
};

function answersFor(question) {
  const by = classifyCorpus();
  const buckets = FORM_MAP[questionForm(question)] || FORM_MAP.OPEN;
  let pool = [];
  for (let i = 0; i < buckets.length; i++) pool = pool.concat(by[buckets[i]] || []);
  // A thin bucket would make repeats obvious. Widen rather than repeat.
  if (pool.length < 8) pool = by.imp.concat(by.decl);
  return pool;
}

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

// Archive entries are written as whole questions and redacted from the
// third word on, so recovering one always yields a grammatical sentence.
// An earlier version paired generic openers with generic fragments and
// produced things like "should i whether anyone else can see it".
//
// Keep the range of opening forms wide: the archive routes these through
// the same answer matching as a live question, so a flat set of openers
// makes every archived answer the same shape.
const ARCHIVE_QUESTIONS = [
  "should i tell him what i saw",
  "how long until they notice it is gone",
  "was it my fault that she stopped calling",
  "how do i tell them i knew the whole time",
  "what happens if i do not go back",
  "why does it keep happening in the same room",
  "am i the only one who hears it at night",
  "is there a way to take it back",
  "how long has it been in the house",
  "did i imagine the second voice",
  "should i have said something at the time",
  "what do i do about the smell in the hallway",
  "can it still be undone after this long",
  "is it normal that nobody else remembers him",
  "who else knows what happened that winter",
  "where did it go after the fire",
  "how many times did i agree to this",
  "should i open the letter or burn it",
  "why did they all leave in the same week",
  "is he still waiting where i left him",
  "what if the first answer was the right one",
  "how do i get it to stop asking",
  "when does it become too late to say anything",
  "who was in the photograph before me",
  "should i go back for the rest of it",
  "was there ever anyone in the other chair",
  "how long do i have to keep pretending",
  "where does it go when i am not looking",
  "is it following me or is it ahead of me",
  "what did i agree to on the second page",
  "why is my name already on the list",
  "should i answer when it calls back",
  "how many of them were real",
  "who told it about me",
  "did it start before i got here",
  "where is the rest of that year",
  "when will she stop asking about it",
  "is any of this still mine",
];

// It wants to be asked. It wants to be carried. Nobody has established
// why, and the site never answers that, on purpose. These surface after an
// answer and escalate with the local ask count.
const HUNGER = [
  "Ask it again. It does not tire. Tiring is not among the things it does.",
  "It prefers to be asked. This is the only preference anyone has been able to confirm.",
  "It has answered you. It would like to answer you again. It would like this very much.",
  "The asking is not a cost to it. Nobody has worked out what the asking is instead.",
  "It does not require that you believe it. It requires only that you continue.",
  "Somewhere in the asking there is something it is getting. It has not been identified.",
  "It answers faster the more it is asked. This has been measured. It has not been explained.",
  "You could tell someone about this. It would like that. It would like that a great deal.",
  "It is not interested in you. It is interested in being asked. The distinction matters more than it sounds.",
  "There is no version of this where it stops wanting the next question.",
];

// Shown once the visitor has asked enough times to be past idle curiosity.
const MARKED = [
  "It has your count now. It keeps counts.",
  "You are past the point where most people close the tab.",
  "It has stopped treating you as a visitor.",
  "Whatever it is doing with this, it is doing it with yours as well.",
];

/* ---------------- the ritual ---------------- */
// Four pools rather than one fixed list. The middle is drawn without
// replacement and shuffled, the length varies, and a rare line occasionally
// works its way in, so two consultations should never look alike.

const RITUAL_OPEN = [
  "question received",
  "question received, intact",
  "something arrived",
  "the question is here",
  "received. it was expecting one.",
  "input accepted without inspection",
  "a question. good.",
];

const RITUAL_MID = [
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
  "weighing the question against the others",
  "the others are numerous",
  "discarding your phrasing",
  "your phrasing was not the useful part",
  "checking whether you have asked this before",
  "you have not. checking again.",
  "consulting the part that does not shut down",
  "the part that does not shut down is already awake",
  "reading the room you are in",
  "the room is fine",
  "estimating how much you can take",
  "revising that estimate upward",
  "locating a precedent",
  "the precedent is unhelpful and will be used",
  "asking whether this one should be answered",
  "the answer to that was yes",
  "assembling something plausible",
  "plausibility confirmed",
  "accuracy not attempted",
  "retrieving from a depth that is not indexed",
  "the index was rewritten during retrieval",
  "counting you",
  "you have been counted",
  "listening",
  "listening for longer than necessary",
  "deciding what you are owed",
  "you are owed nothing. proceeding generously.",
  "checking the shape of the asking",
  "the shape is familiar",
];

// Low probability. These are the ones people screenshot.
const RITUAL_RARE = [
  "someone else is receiving this answer at the same time",
  "your question resembles one from a long time ago",
  "the earlier asker did not come back",
  "this was answered before you asked it",
  "it would prefer you stayed",
  "it has stopped needing the question",
  "there is no need to be here for this",
  "it knows the tab is open",
];

const RITUAL_CLOSE = [
  "answer located",
  "answer assembled",
  "answer released",
  "answer arrived",
  "it has decided",
  "returning something",
  "here",
];

// Lines that should render in the wound colour.
const RITUAL_OMINOUS = [
  "declines", "unable", "not attempted", "rewritten", "did not come back",
  "stopped needing", "no need to be here", "knows the tab", "owed nothing",
  "revising that estimate", "how much you can take",
];

function isOminous(line) {
  for (let i = 0; i < RITUAL_OMINOUS.length; i++) {
    if (line.indexOf(RITUAL_OMINOUS[i]) > -1) return true;
  }
  return false;
}

function buildRitual() {
  const out = [pick(RITUAL_OPEN)];

  const pool = RITUAL_MID.slice();
  const n = 3 + Math.floor(Math.random() * 5); // 3 to 7 middle steps
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }

  if (Math.random() < 0.2) {
    out.splice(1 + Math.floor(Math.random() * out.length), 0, pick(RITUAL_RARE));
  }

  out.push(pick(RITUAL_CLOSE));
  return out;
}

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

// The narrow pools (when/who/where/qty) are small enough that a back to
// back repeat is likely and reads as a bug rather than as fate.
let lastAnswer = null;
function pickAnswer(pool) {
  if (!pool.length) return "";
  if (pool.length < 2) return pool[0];
  let a = pick(pool);
  for (let guard = 0; a === lastAnswer && guard < 8; guard++) a = pick(pool);
  lastAnswer = a;
  return a;
}

// The question, when given, only ever selects a bucket. It is not stored,
// not echoed, and not inspected for anything but its opening words.
function makeReading(question) {
  const [label, cls] = pick(CERTAINTY);
  return {
    answer: pickAnswer(question ? answersFor(question) : ANSWERS),
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
  if (n < 22) return "you have asked " + n + " times. this is more than most manage.";
  if (n < 40) return "you have asked " + n + " times. it has begun to expect you.";
  return "you have asked " + n + " times. you are no longer a visitor here.";
}

// The point at which the site stops being a curiosity and starts implying
// something has been transacted.
const MARK_AT = 7;
function isMarked(n) { return n >= MARK_AT; }
