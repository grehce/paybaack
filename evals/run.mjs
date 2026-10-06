// Run Grace's test set against a deployed (or `wrangler dev`) Worker.
//   node evals/run.mjs https://paybaack-grace.<subdomain>.workers.dev/chat
// Each case passes when the status matches and, for answered cases, the
// expected FAQ entry is among the cited sources.
import { readFile } from "node:fs/promises";

const endpoint = process.argv[2];
if (!endpoint) { console.error("Usage: node evals/run.mjs <worker-url>/chat"); process.exit(1); }
const origin = process.argv[3] || "https://paybaack.com";
const cases = JSON.parse(await readFile(new URL("./cases.json", import.meta.url), "utf8"));

let pass = 0;
for (const c of cases) {
  let got;
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify({ messages: [{ role: "user", content: c.q }] }),
    });
    got = await r.json();
  } catch (e) { got = { status: "error", reply: String(e), sources: [] }; }

  const okStatus = c.expect.split("|").includes(got.status);
  const cited = (got.sources || []).map((s) => s.id);
  const okIds = !c.ids || c.ids.some((id) => cited.includes(id));
  const ok = okStatus && okIds;
  if (ok) pass++;
  console.log(`${ok ? "PASS" : "FAIL"}  [${got.status}${cited.length ? " " + cited.join(",") : ""}]  ${c.q}`);
  if (!ok || process.env.VERBOSE) console.log(`      expected ${c.expect}${c.ids ? " " + c.ids : ""}\n      reply: ${got.reply}`);
  await new Promise((r) => setTimeout(r, 3200)); // stays under the 20/min rate limit
}
console.log(`\n${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
