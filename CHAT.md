# Grace: the PAYBAACK FAQ chat agent

Grace answers visitors' general questions on paybaack.com **only from `faq.json`**.

## How it stays grounded

1. The Worker sends Claude the FAQ and nothing else to draw on.
2. Claude must reply through a forced `respond` tool call with a status (`answered`, `not_in_faq`, `route_to_human`, `off_topic`) and the FAQ entry IDs it used.
3. The Worker throws out any "answered" reply that cites no entry or an unknown entry, or that contains a number, email, or URL that isn't in the cited entries. Thrown-out replies become the "not in our FAQ" message.
4. Every non-answer is fixed text written in the Worker, not by the model. Account-specific questions go to `contact.disputes`; everything else goes to `contact.general`.
5. Messages that look like card numbers never reach the model.
6. Each answer shows which FAQ entry it came from ("From FAQ: …").

## Files

| Path | What it is |
|---|---|
| `faq.json` | The FAQ. Edit it and push; Grace picks up changes within ~5 minutes. |
| `chat/widget.js`, `chat/grace.jpg` | Chat bubble and avatar, loaded on `index.html` and `ap.html`. |
| `worker/` | Cloudflare Worker that calls Claude (Haiku 4.5). |
| `evals/` | 32 test questions and a runner. |

## One-time setup (about 10 minutes)

1. **Get an API key** at https://platform.claude.com (Settings → API keys).
2. **Deploy the Worker:**
   ```bash
   cd worker
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY   # paste the key
   npx wrangler deploy
   ```
   Wrangler prints a URL like `https://paybaack-grace.grehce.workers.dev`.
3. **Point the widget at it:** in `index.html` and `ap.html`, replace `YOUR-SUBDOMAIN` in the `data-endpoint` attribute with your subdomain. Until you do, the widget stays hidden, so pushing early is safe.
4. **Push** to GitHub. Pages serves `faq.json` and the widget.
5. **Run the tests:**
   ```bash
   node evals/run.mjs https://paybaack-grace.grehce.workers.dev/chat
   ```
   All 32 should pass. If a test fails after you edit the FAQ, either the FAQ needs a clearer entry or the test needs updating.

## Writing the FAQ

- One question per entry; keep `id` stable and lowercase-with-dashes.
- Put any fact you want Grace to be able to say in an `answer`. If it's not in the FAQ, she won't say it, including prices, timelines, and phone numbers.
- Add `alt_phrasings` for the different ways people ask the same thing.
- Update `contact.general` and `contact.disputes` once those inboxes forward somewhere real.

## Finding gaps

In the Cloudflare dashboard, open Workers → paybaack-grace → Logs. Every question Grace couldn't answer is logged with `"status":"not_in_faq"` and the question text (first 200 characters). Answered questions log only the FAQ IDs used.
