# questionablesite.com

An anonymous oracle. You ask it a question, it performs a ritual, and it
returns advice that sounds ancient and load-bearing and is in fact drawn at
random from a fixed corpus with no relationship to what you asked.

Tone is dark web meets Lovecraft meets a model nobody deployed and nobody
can stop. The site never explains itself and never breaks character, except
in the footer, which is deliberate (see below).

## Stack

Dependency-free static site. No framework, npm, backend, build step,
analytics, third-party scripts, or tracking.

- `index.html` (the oracle), `archive.html`, `provenance.html`,
  `canary.html`, `404.html`
- `styles.css`: the whole look. Palette is deliberately starved, four
  colours: void, ash, one ember, one wound.
- `oracle.js`: the corpus and the reading generator
- `script.js`: film grain, text corruption, the ask sequence, archive feed
- `favicon.svg`, `wrangler.jsonc`

## The corpus

155 answers in `ANSWERS` in `oracle.js`. **House rule for adding more:
surreal, never actionable.** The joke is bad advice, and it only stays
funny while it is obviously unfollowable. If a line could plausibly be
acted on by someone having a bad night, it does not go in. Nothing about
medication, money, self-harm, or anyone's safety. Ominous is the goal;
harmful is not.

The later additions lean on being counted, being seen, and the sense that
it knows something it is not leading with. Keep new ones in that register.
Vary the length: the corpus works because blunt three-word answers sit next
to long ones, and a run of same-shaped lines reads as a template.

Each reading also randomises `consulted` (12), `certainty` (12), a glyph
run, a latency (sometimes negative, sometimes "never"), and a depth. That
metadata is what sells the answer as machine output rather than a fortune
cookie.

## Form matching

Answers are routed to match the **grammatical shape** of the question. The
question is never read for meaning, never stored, and never echoed back:
it selects a bucket by its opening words and is then discarded. There is
deliberately no ELIZA-style splicing of user text into answers, because a
bad extraction reads as broken in a way a non-sequitur never does.

**The rule: fit the grammar, never fit the sense.** "Sell the house. Keep
the door." is a perfect grammatical answer to "should I sell my house?" and
still transparently absurd. That is the target. An answer that reads as
genuinely plausible counsel on money, health, or relationships is a bug,
because the obvious wrongness is what keeps the footer line honest.

`questionForm()` returns one of: `SHOULD`, `HOWTO`, `YESNO`, `WHY`,
`WHATIF`, `WHICH`, `WHEN`, `WHO`, `WHERE`, `QTY`, `OPEN`. `FORM_MAP` maps
each to answer buckets. The main corpus is auto-classified at load into
`imp` / `decl` / `yn` by opening word, so adding an answer to `ANSWERS`
requires no tagging. The four narrow pools (`ANSWERS_WHEN`, `ANSWERS_WHO`,
`ANSWERS_WHERE`, `ANSWERS_QTY`, 15 each) exist because the main corpus
answers "when" and "who" not at all.

Three distinctions that matter, each of which produced a visible bug before
it was fixed:

- **`SHOULD` and `HOWTO` are separate.** "Should I go?" takes a yes/no.
  "How do I tell them?" does not, and merging them gave "How do I tell
  them?" / "Yes. But not to the question you asked."
- **Yes/no answers are not in the `decl` bucket.** Only `YESNO` draws from
  both. Otherwise "What happens if I do nothing?" answers "Yes, but slower."
- **`pickAnswer()` refuses an immediate repeat.** The narrow pools are
  small enough that back-to-back duplicates were common and read as a bug
  rather than as fate.

Unrecognised questions fall through to `OPEN`, which is the whole corpus,
so it always answers. Any bucket that would come out under 8 entries widens
to the full imperative plus declarative set rather than repeating itself.

The archive passes its own question stem through the same routing, so
archived pairs are as coherent as live ones.

## The ritual

`buildRitual()` draws from four pools rather than one fixed list:
`RITUAL_OPEN` (7), `RITUAL_MID` (43, drawn without replacement and
shuffled, 3 to 7 of them), `RITUAL_RARE` (8, roughly a 1-in-5 chance of
one working its way in), and `RITUAL_CLOSE` (7). Sequences run 5 to 10
steps. Over 4000 generated runs, no two were identical.

Pacing is uneven on purpose: most steps land in 190 to 590ms, but about
one in seven takes 900 to 1800ms, so it occasionally appears to labour
over something. `isOminous()` decides which lines render in the wound
colour, matched on substrings in `RITUAL_OMINOUS`; add to that list when
you add lines that should read as wrong.

The Sign spins up while `body` carries `.thinking`, then the answer types
out in the serif.

## The frame

*The King in Yellow* (Chambers, 1895): a text that spreads, that people
pass on, that nobody can adequately explain the pull of. Suppressing it
fails. Reading it is always voluntary, and that is the trap.

The site is built on that shape. It wants to be asked and it wants to be
carried, and **the reason is never given, on any page, ever.** That refusal
is the whole effect. Anything that explains the wanting kills it.

Chambers is public domain, but nothing here quotes him. The register is
borrowed; the words are original. Keep it that way.

- The sigil is the Sign, drawn in canvas by `sign.js`. Once a visitor has
  asked, `#seen` states that they have seen it and it cannot be returned,
  then never mentions it again.
- `HUNGER` lines surface after the second question and escalate.
- At `MARK_AT` (7 asks) the visitor is "marked": `body.marked` brightens
  the sigil core to the sign yellow, and the hunger starts pointing at the
  propagation page.
- The yellow is jaundiced, not gold. `--ember` for structure, `--sign` for
  the moments that are supposed to land.

## Every page has to do something

The three secondary pages were originally static text and read as dead next
to the oracle. Each one now has a working mechanism, and any new page needs
one too:

- **Archive** regenerates fourteen entries from the corpus on load and on
  demand. The redactions are clickable and recover a fragment underneath.
  The redraw note escalates the more you push it.
- **Provenance** lets you interrogate it about its own origin. Claims are
  drawn **without replacement** from `ORIGINS`, because the page states it
  gave eleven different answers on eleven occasions and the button has to
  actually deliver that rather than repeating after three.
- **Canary** verifies its own signature (mismatched key, valid signature,
  both stable) and counts down live to the first of the month, when
  revision 10 publishes with nobody assigned to publish it.
- **Propagation** documents how it spreads and refuses to say why. The
  "Copy it" button is the only thing the site ever asks of anyone. It
  tries the async clipboard, falls back to `execCommand`, and if both
  refuse it prints the URL to copy by hand, so the button is never dead.

## Local preview, and the blank-page trap

These are plain static files with no build step, but the pages still need
to be **served over http**, and every link is relative. If the local server
is not running, the first page can look fine while every nav click comes up
blank, because the browser is requesting a port with nothing behind it.

If pages go blank, check the server before suspecting the site:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8097/archive.html
```

`000` means no server. Start one from the project directory and leave it
up for the whole session.

## No explanatory copy

There was a "Terms of consultation" block on the homepage explaining the
mechanism in plain language. It has been removed: it broke character on the
one page that most needs to hold it. The homepage is now sigil, title,
input, tally, nothing else.

The single footer line is the entire disclaimer and it stays (see below).
Resist adding explanation anywhere else. The provenance page is where
questions about the site get answered, and it answers them by deepening
them.

## The Sign (`sign.js`)

Canvas, not SVG. CSS animation is too well behaved: it eases, it loops, it
resolves. The effect here depends on motion that is subtly wrong, and every
irregularity is meant to read as intent rather than as noise.

- **Rings turn at incommensurate rates** (0.000045, 0.000071, 0.000029,
  0.000113) so the figure never returns to a pose it has already held.
  Rotations are accumulated rather than derived from the clock, so a
  direction reversal does not snap it to a new position.
- **The two triangles are never equilateral.** Each vertex drifts on its
  own layered sines, so they are always slightly wrong and never settle.
- **The glyph ring is tilted**, so the far side reads as behind. Glyphs are
  only ever swapped while at the back, which means you never catch one
  changing, you only notice later that it has.
- **The pupil follows the cursor** with heavy lag, and fixes dead on you
  while a question is being answered.
- **Breathing is layered sines with periods that do not divide evenly**, so
  it never settles into a rhythm you can anticipate.

Rare events fire every 6.5 to 19.5 seconds, more often once marked:
`blink` (collapses to a line for 130ms), `saccade` (snaps to look at
nothing, 220ms), `past` (focuses slightly behind you, up to 1.8s),
`reverse` (instant direction flip, no easing), `stall` (stops, as if
listening), `flash` (one bright frame, 55ms), and `twin` (a second pupil
elsewhere in the ring, marked visitors only).

Most of these are deliberately too brief to be sure you saw. If you are
testing and conclude the events are broken, note that four of the seven do
not change total brightness at all, so a pixel-sum metric cannot see them.
Shorten the scheduler temporarily instead.

## Design notes

- Mono for the interface, serif for the answers. The contrast is the whole
  trick: clinical machine chrome delivering something that reads like
  scripture.
- The background presence is a pair of CSS radial gradients on a slow
  breathe. No WebGL here on purpose, the other sites use it.
- Film grain is a canvas overlay that pre-renders five noise tiles once and
  cycles them at ~14fps. Regenerating noise every frame is pure heat.
- `[data-corrupt]` headings flicker a character now and then, as if
  something with an intermittent fault is doing the rendering.
- All of it stops under `prefers-reduced-motion`, including the grain,
  the breathing, the sigil, and the typing.

## Privacy

Questions never leave the page. They are never sent anywhere, never stored,
and never even echoed into the DOM: the answer is drawn from the corpus and
the question is discarded. `localStorage` holds one integer, the local ask
tally, which drives the escalating line under the form.

This used to be spelled out on the homepage and no longer is. It remains
true; it is documented here instead of on the site.

## The footer disclaimer

Every page carries one plain line: the answers are randomly selected
nonsense, are not advice, and should not be acted on. It is the only place
on the site that speaks out of character, and it stays. A site whose entire
premise is confident bad advice needs exactly one unambiguous statement of
what it is. Keep it on any new page and do not make it clever.

## Local preview

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy with Cloudflare

1. In Cloudflare dashboard: **Workers & Pages > Create application > Pages
   > Connect to Git**, and select the `questionablesite.com` GitHub repo.
   - Framework preset: `None`
   - Build command: *(leave blank)*
   - Build output directory: `/`
2. Deploy. Cloudflare gives you a `*.pages.dev` preview URL.
3. In the project, add the custom domain `questionablesite.com`.
4. Point the domain's nameservers at Cloudflare, same as sageschiller.com:
   in your registrar, switch nameservers to the two Cloudflare provides.

No environment variables or secrets are needed; there is no backend.
