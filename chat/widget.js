/* Grace — PAYBAACK FAQ chat widget.
 * Include with:
 *   <script src="/chat/widget.js" data-endpoint="https://<worker>/chat" defer></script>
 * The widget stays hidden until data-endpoint points at a deployed Worker.
 */
(function () {
  var script = document.currentScript;
  var endpoint = script && script.getAttribute("data-endpoint");
  if (!endpoint || /YOUR-SUBDOMAIN/.test(endpoint)) return;
  var base = (script.src || "").replace(/widget\.js(\?.*)?$/, "");
  var avatar = base + "grace.jpg";

  var css = "" +
    ".pbg{--ink:#111;--paper:#f6f3ec;--lime:#d9ff4f;--muted:#6b685f;--line:#d9d4c8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:var(--ink)}" +
    ".pbg *{box-sizing:border-box}" +
    ".pbg-launch{position:fixed;right:22px;bottom:22px;z-index:9998;display:flex;align-items:center;gap:10px;padding:6px 18px 6px 6px;border:1.5px solid var(--ink);border-radius:999px;background:var(--lime);box-shadow:5px 5px 0 var(--ink);font:inherit;font-weight:900;font-size:15px;color:var(--ink);cursor:pointer;width:auto}" +
    ".pbg-launch:hover{transform:translate(-1px,-1px);box-shadow:6px 6px 0 var(--ink)}" +
    ".pbg-launch img,.pbg-head img,.pbg-av{width:40px;height:40px;border-radius:50%;border:1.5px solid var(--ink);object-fit:cover;flex:none;background:#fff}" +
    ".pbg-panel{position:fixed;padding:0;margin:0;right:22px;bottom:22px;z-index:9999;width:380px;max-width:calc(100vw - 32px);height:min(600px,calc(100vh - 44px));display:flex;flex-direction:column;background:var(--paper);border:1.5px solid var(--ink);border-radius:22px;box-shadow:10px 10px 0 var(--ink);overflow:hidden}" +
    ".pbg-panel[hidden],.pbg-launch[hidden]{display:none}" +
    ".pbg-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fff;border-bottom:1.5px solid var(--ink)}" +
    ".pbg-name{font-weight:950;font-size:17px;letter-spacing:-.5px}" +
    ".pbg-tag{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:1px;background:var(--lime);padding:3px 7px;border-radius:999px;margin-left:6px;vertical-align:2px}" +
    ".pbg-sub{font-size:12px;color:var(--muted);margin-top:2px}" +
    ".pbg-x{margin-left:auto;width:34px;height:34px;padding:0;border:1.5px solid var(--ink);border-radius:50%;background:#fff;font:inherit;font-size:18px;font-weight:900;cursor:pointer;color:var(--ink)}" +
    ".pbg-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}" +
    ".pbg-row{display:flex;gap:8px;align-items:flex-end;max-width:92%}" +
    ".pbg-row.me{align-self:flex-end;flex-direction:row-reverse}" +
    ".pbg-av{width:28px;height:28px}" +
    ".pbg-msg{padding:11px 14px;border:1.5px solid var(--ink);border-radius:16px 16px 16px 4px;background:#fff;font-size:14px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}" +
    ".me .pbg-msg{background:var(--ink);color:#fff;border-radius:16px 16px 4px 16px}" +
    ".pbg-src{display:block;margin-top:7px;font-size:11px;color:var(--muted);font-weight:700}" +
    ".pbg-chips{display:flex;flex-wrap:wrap;gap:6px;padding-left:36px}" +
    ".pbg-chip{width:auto;padding:7px 11px;border:1.5px solid var(--ink);border-radius:999px;background:#fff;font:inherit;font-size:12px;font-weight:800;color:var(--ink);cursor:pointer}" +
    ".pbg-chip:hover{background:var(--lime)}" +
    ".pbg-typing span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:var(--ink);animation:pbg-b 1s infinite}" +
    ".pbg-typing span:nth-child(2){animation-delay:.15s}.pbg-typing span:nth-child(3){animation-delay:.3s}" +
    "@keyframes pbg-b{0%,80%,100%{opacity:.25}40%{opacity:1}}" +
    ".pbg-form{display:flex;gap:8px;padding:12px;border-top:1.5px solid var(--ink);background:#fff;margin:0;border-radius:0}" +
    ".pbg-form input{flex:1;margin:0;padding:12px 13px;border:1.5px solid var(--line);border-radius:10px;font:inherit;font-size:14px;color:var(--ink);background:#fff}" +
    ".pbg-form input:focus{outline:none;border-color:var(--ink)}" +
    ".pbg-form button{width:auto;padding:0 16px;border:1.5px solid var(--ink);border-radius:10px;background:var(--lime);font:inherit;font-weight:950;font-size:14px;color:var(--ink);cursor:pointer}" +
    ".pbg-form button:disabled{opacity:.5;cursor:default}" +
    ".pbg-foot{padding:0 14px 10px;background:#fff;font-size:10.5px;line-height:1.35;color:var(--muted)}" +
    "@media(max-width:520px){.pbg-panel{right:16px;bottom:16px;height:calc(100vh - 32px)}.pbg-launch{right:16px;bottom:16px}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var root = el("div", "pbg");
  root.innerHTML =
    '<button class="pbg-launch" type="button" aria-label="Chat with Grace, PAYBAACK\'s AI assistant">' +
      '<img alt="" src="' + avatar + '">Ask Grace</button>' +
    '<section class="pbg-panel" role="dialog" aria-label="Chat with Grace" hidden>' +
      '<div class="pbg-head"><img alt="" src="' + avatar + '"><div>' +
        '<div class="pbg-name">Grace<span class="pbg-tag">AI assistant</span></div>' +
        '<div class="pbg-sub">Answers from the PAYBAACK FAQ</div></div>' +
        '<button class="pbg-x" type="button" aria-label="Close chat">×</button></div>' +
      '<div class="pbg-log" aria-live="polite"></div>' +
      '<form class="pbg-form"><input type="text" maxlength="1000" placeholder="Ask about PAYBAACK…" aria-label="Your question" autocomplete="off">' +
        '<button type="submit">Send</button></form>' +
      '<div class="pbg-foot">AI assistant. Answers come only from our FAQ. Don\'t share card, bank, or invoice details here.</div>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector(".pbg-launch");
  var panel = root.querySelector(".pbg-panel");
  var log = root.querySelector(".pbg-log");
  var form = root.querySelector(".pbg-form");
  var input = form.querySelector("input");
  var send = form.querySelector("button");
  var history = [];
  var started = false;
  var busy = false;

  launch.addEventListener("click", open);
  root.querySelector(".pbg-x").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });

  function open() {
    panel.hidden = false; launch.hidden = true;
    if (!started) {
      started = true;
      addBot("Hi, I'm Grace, PAYBAACK's AI assistant. I can answer general questions about how PAYBAACK works.");
      var chips = el("div", "pbg-chips");
      ["What is PAYBAACK?", "Who is it for?", "Is a human involved?"].forEach(function (q) {
        var c = el("button", "pbg-chip"); c.type = "button"; c.textContent = q;
        c.addEventListener("click", function () { chips.remove(); ask(q); });
        chips.appendChild(c);
      });
      log.appendChild(chips);
    }
    input.focus();
  }
  function close() { panel.hidden = true; launch.hidden = false; launch.focus(); }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    var chips = log.querySelector(".pbg-chips"); if (chips) chips.remove();
    input.value = "";
    addMe(text);
    history.push({ role: "user", content: text });
    setBusy(true);
    var typing = addBot(null);
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-10) }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        typing.remove();
        var reply = res.d.reply || res.d.error || "Sorry, something went wrong. Please try again.";
        addBot(reply, res.d.sources);
        if (res.ok) history.push({ role: "assistant", content: reply });
        else history.pop();
      })
      .catch(function () {
        typing.remove(); history.pop();
        addBot("Sorry, I couldn't connect. Please try again in a moment.");
      })
      .then(function () { setBusy(false); input.focus(); });
  }

  function addMe(text) {
    var row = el("div", "pbg-row me"); var m = el("div", "pbg-msg");
    m.textContent = text; row.appendChild(m); log.appendChild(row); scroll();
  }
  function addBot(text, sources) {
    var row = el("div", "pbg-row");
    var av = el("img", "pbg-av"); av.alt = ""; av.src = avatar; row.appendChild(av);
    var m = el("div", "pbg-msg");
    if (text === null) { m.className += " pbg-typing"; m.setAttribute("aria-label", "Grace is typing"); m.innerHTML = "<span></span><span></span><span></span>"; }
    else {
      m.textContent = text;
      if (sources && sources.length) {
        var s = el("span", "pbg-src");
        s.textContent = "From FAQ: " + sources.map(function (x) { return x.question; }).join(" · ");
        m.appendChild(s);
      }
    }
    row.appendChild(m); log.appendChild(row); scroll();
    return row;
  }
  function setBusy(b) { busy = b; send.disabled = b; }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
})();
