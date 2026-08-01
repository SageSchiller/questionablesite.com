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

80 answers in `ANSWERS` in `oracle.js`. **House rule for adding more:
surreal, never actionable.** The joke is bad advice, and it only stays
funny while it is obviously unfollowable. If a line could plausibly be
acted on by someone having a bad night, it does not go in. Nothing about
medication, money, self-harm, or anyone's safety. Ominous is the goal;
harmful is not.

Each reading also randomises `consulted` (12), `certainty` (12), a glyph
run, a latency (sometimes negative, sometimes "never"), and a depth. That
metadata is what sells the answer as machine output rather than a fortune
cookie.

## The ritual

Submitting walks a random subset of `RITUAL`, always keeping the first and
last line, so the sequence differs every time but still opens on "question
received" and closes on "answer located". Lines mentioning declines or
failure render in the wound colour. The sigil spins up while `body` carries
`.thinking`, then the answer types out in the serif.

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

## No explanatory copy

There was a "Terms of consultation" block on the homepage explaining the
mechanism in plain language. It has been removed: it broke character on the
one page that most needs to hold it. The homepage is now sigil, title,
input, tally, nothing else.

The single footer line is the entire disclaimer and it stays (see below).
Resist adding explanation anywhere else. The provenance page is where
questions about the site get answered, and it answers them by deepening
them.

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
