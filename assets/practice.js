/* Interview Room - practice modes: Today's review, Mock round, Rehearsal room.
   Runs after portal.js has loaded every topic (IR.onReady), and reuses its card
   body (IR.buildBody) and rating row, so a rating given here is the same rating
   the topic pages show. */
(function () {
  "use strict";

  var IR = window.IR;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mmss(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function roundText(c) {
    return (c.round || []).map(function (r) { return IR.ROUND_LABEL[r] || r; }).join(" · ");
  }
  function pool() { return IR.allCards().filter(function (c) { return !c.dupOf; }); }
  function selectHtml(attr, opts, value) {
    return '<select ' + attr + '>' + opts.map(function (o) {
      return '<option value="' + esc(o[0]) + '"' + (o[0] === value ? " selected" : "") + '>' + esc(o[1]) + '</option>';
    }).join("") + '</select>';
  }
  function field(label, control) {
    return '<label class="pr-field"><span>' + label + '</span>' + control + '</label>';
  }
  var ROUND_OPTS = [["", "Any round"], ["screening", "Screening"], ["tech1", "Technical 1"], ["tech2", "Technical 2"], ["manager", "Hiring manager"], ["hr", "HR"]];

  /* A count-up timer that turns amber past its target. */
  function makeTimer(face, target) {
    var t = { s: 0, id: null, target: target };
    function paint() {
      face.textContent = mmss(t.s);
      face.classList.toggle("is-over", t.s > t.target);
    }
    t.start = function () { if (t.id) return; t.id = setInterval(function () { t.s++; paint(); }, 1000); face.classList.add("is-running"); };
    t.stop = function () { clearInterval(t.id); t.id = null; face.classList.remove("is-running"); };
    t.reset = function (target2) { t.stop(); t.s = 0; if (target2) t.target = target2; paint(); };
    paint();
    return t;
  }

  /* The answer view: the same three tabs as a topic card, opened on "Say it". */
  function answer(c) {
    var w = el("div", "pr-answer q-body");
    w.innerHTML = IR.buildBody(c, { tab: "say" });
    return w;
  }
  function cardHead(c, extra) {
    return '<div class="pr-meta">' + esc(c._topic ? c._topic.title : "") +
      (roundText(c) ? '<span aria-hidden="true"> · </span>' + esc(roundText(c)) : "") + (extra || "") + '</div>' +
      '<h2 class="pr-q">' + fmt(c.q) + '</h2>';
  }

  /* ============================== Today's review ============================== */
  function review(stage) {
    var opts = { key: "", round: "", size: 15 };
    try { var saved = JSON.parse(localStorage.getItem("ir.reviewOpts")); if (saved) opts = Object.assign(opts, saved); } catch (e) {}

    function setup() {
      var q = IR.progress.queue(opts);
      var topicOpts = [["", "All topics"]].concat((IR.topics || []).map(function (t) { return [t.num + "-" + t.slug, t.title]; }));
      stage.innerHTML =
        '<div class="pr-setup">' +
          field("Topic", selectHtml("data-o=\"key\"", topicOpts, opts.key)) +
          field("Round", selectHtml("data-o=\"round\"", ROUND_OPTS, opts.round)) +
          field("Session", selectHtml("data-o=\"size\"", [["10", "10 questions"], ["15", "15 questions"], ["25", "25 questions"]], String(opts.size))) +
        '</div>' +
        '<div class="pr-summary">' +
          '<div><b>' + q.due + '</b><span>due now</span></div>' +
          '<div><b>' + Math.min(q.fresh, Math.max(0, opts.size - q.due)) + '</b><span>new in this session</span></div>' +
          '<div><b>' + q.cards.length + '</b><span>questions today</span></div>' +
        '</div>' +
        (q.cards.length
          ? '<button type="button" class="btn btn-lg" data-go>Start session</button>'
          : '<div class="note note-quiet">Nothing left for this filter. Pick another topic or round, or come back tomorrow.</div>');
      [].forEach.call(stage.querySelectorAll("select[data-o]"), function (s) {
        IR.enhanceSelect(s);
        s.addEventListener("change", function () {
          var k = s.getAttribute("data-o");
          opts[k] = k === "size" ? +s.value : s.value;
          try { localStorage.setItem("ir.reviewOpts", JSON.stringify(opts)); } catch (e) {}
          setup();
        });
      });
      var go = stage.querySelector("[data-go]");
      if (go) go.addEventListener("click", function () { run(q.cards.map(function (c) { return IR.cardById(c.id); }).filter(Boolean)); });
    }

    function run(cards) {
      var i = 0, requeued = {}, tally = { 0: 0, 1: 0, 2: 0 }, total = cards.length;
      function show() {
        if (i >= cards.length) return done();
        var c = cards[i];
        stage.innerHTML =
          '<div class="pr-progress"><span>' + Math.min(i + 1, total) + ' of ' + total + (i >= total ? " (again)" : "") + '</span>' +
            '<div class="pr-track"><span style="width:' + (Math.min(i, total) / total * 100) + '%"></span></div></div>' +
          '<article class="pr-card pr-stage">' + cardHead(c) +
            '<p class="pr-hint">Say your answer out loud first. Then reveal and compare.</p>' +
            '<button type="button" class="btn" data-reveal>Reveal answer <kbd>Space</kbd></button>' +
          '</article>';
        stage.querySelector("[data-reveal]").addEventListener("click", reveal);
        stage.querySelector(".pr-card").classList.add("is-in");
      }
      function reveal() {
        var card = stage.querySelector(".pr-card");
        var btn = card.querySelector("[data-reveal]"), hint = card.querySelector(".pr-hint");
        if (btn) btn.remove();
        if (hint) hint.textContent = "Compare with what you said, then rate it. Keys 1, 2, 3.";
        card.appendChild(answer(cards[i]));
      }
      function onRate(e) {
        var c = cards[i];
        if (!c || !e.detail || e.detail.id !== c.id || e.detail.r == null) return;
        tally[e.detail.r]++;
        if (e.detail.r === 0 && !requeued[c.id]) { requeued[c.id] = 1; cards.push(c); }
        i++;
        setTimeout(show, 280);
      }
      function onKey(e) {
        if (/INPUT|SELECT|TEXTAREA/.test((e.target || {}).tagName || "")) return;
        var card = stage.querySelector(".pr-card");
        if (!card) return;
        if ((e.key === " " || e.key === "Enter") && card.querySelector("[data-reveal]")) { e.preventDefault(); reveal(); }
        else if (/^[123]$/.test(e.key) && !card.querySelector("[data-reveal]")) {
          var b = card.querySelector('.q-rate-btn[data-r="' + (+e.key - 1) + '"]');
          if (b) b.click();
        }
      }
      function done() {
        document.removeEventListener("ir:progress", onRate);
        document.removeEventListener("keydown", onKey);
        var next = IR.progress.queue({ size: 1000 });
        stage.innerHTML =
          '<div class="pr-done"><h2>Session done</h2>' +
          '<div class="pr-summary"><div><b>' + tally[2] + '</b><span>nailed</span></div>' +
          '<div><b>' + tally[1] + '</b><span>shaky</span></div><div><b>' + tally[0] + '</b><span>blank</span></div></div>' +
          '<p>' + (next.due ? next.due + " still due today." : "Nothing else is due today. Blank and shaky answers come back tomorrow.") + '</p>' +
          '<div class="btn-row"><button type="button" class="btn" data-again>Another session</button>' +
          '<a class="btn is-ghost" href="mock.html">Try a mock round</a></div></div>';
        stage.querySelector("[data-again]").addEventListener("click", setup);
      }
      document.addEventListener("ir:progress", onRate);
      document.addEventListener("keydown", onKey);
      show();
    }
    setup();
  }

  /* ============================== Mock round ============================== */
  var TARGET = { screening: 60, tech1: 120, tech2: 180, manager: 120, hr: 60 };
  function mock(stage) {
    var opts = { round: "tech1", track: "", n: 6, record: false };
    var mediaStream = null;

    function setup() {
      var trackOpts = [["", "Any employer"]].concat((IR.tracks || []).map(function (t) { return [t.key, t.label]; }));
      stage.innerHTML =
        '<div class="pr-setup">' +
          field("Round", selectHtml("data-o=\"round\"", ROUND_OPTS.slice(1), opts.round)) +
          field("Employer type", selectHtml("data-o=\"track\"", trackOpts, opts.track)) +
          field("Questions", selectHtml("data-o=\"n\"", [["6", "6 questions"], ["8", "8 questions"]], String(opts.n))) +
        '</div>' +
        '<label class="pr-check"><input type="checkbox" data-record' + (opts.record ? " checked" : "") + '> ' +
          'Record my answers so I can play them back (stays in this tab, never uploaded)</label>' +
        '<button type="button" class="btn btn-lg" data-go>Start the round</button>';
      [].forEach.call(stage.querySelectorAll("select[data-o]"), function (s) {
        IR.enhanceSelect(s);
        s.addEventListener("change", function () { var k = s.getAttribute("data-o"); opts[k] = k === "n" ? +s.value : s.value; });
      });
      stage.querySelector("[data-record]").addEventListener("change", function (e) { opts.record = e.target.checked; });
      stage.querySelector("[data-go]").addEventListener("click", function () {
        if (!opts.record) return start();
        if (!navigator.mediaDevices || !window.MediaRecorder) { opts.record = false; return start(); }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { mediaStream = s; start(); },
          function () { opts.record = false; start("Microphone access was not available, so this round is not recorded."); });
      });
    }

    /* Pick the round: the employer's ten most likely first (when one is chosen),
       and half the time follow the previous card's natural follow-on, the way a
       panel drills into whatever you just said. */
    function plan() {
      var all = pool().filter(function (c) { return (c.round || []).indexOf(opts.round) >= 0; });
      var byId = {}; all.forEach(function (c) { byId[c.id] = c; });
      var track = (IR.tracks || []).filter(function (t) { return t.key === opts.track; })[0];
      var preferred = track ? track.ten.filter(function (id) { return byId[id]; }).map(function (id) { return byId[id]; }) : [];
      var rest = shuffle(all.filter(function (c) { return c.priority !== "low"; }));
      var used = {}, out = [];
      function take(c, chained) { used[c.id] = 1; out.push({ c: c, chained: chained }); }
      while (out.length < opts.n) {
        var prev = out[out.length - 1];
        var follow = prev && Math.random() < 0.5 && (prev.c.next || []).map(function (id) { return byId[id]; })
          .filter(function (c) { return c && !used[c.id]; })[0];
        if (follow) { take(follow, true); continue; }
        var nextPref = preferred.filter(function (c) { return !used[c.id]; })[0];
        if (nextPref) { take(nextPref, false); continue; }
        var r = rest.filter(function (c) { return !used[c.id]; })[0];
        if (!r) break;
        take(r, false);
      }
      return out;
    }

    function start(warning) {
      var items = plan(), i = 0, results = [];
      if (!items.length) {
        stage.innerHTML = '<div class="note">No questions match that round. Pick another round.</div>';
        return setTimeout(setup, 1500);
      }
      var target = TARGET[opts.round] || 120;
      var rec = null, chunks = [];
      function recStart() {
        if (!opts.record || !mediaStream) return;
        chunks = []; rec = new MediaRecorder(mediaStream);
        rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        rec.start();
      }
      function recStop(cb) {
        if (!rec || rec.state === "inactive") return cb(null);
        rec.onstop = function () { cb(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }))); };
        rec.stop();
      }

      function show() {
        if (i >= items.length) return finish();
        var it = items[i], c = it.c, res = { c: c, main: 0, follow: 0, audio: [] };
        results.push(res);
        stage.innerHTML =
          (warning && i === 0 ? '<div class="note note-quiet">' + esc(warning) + '</div>' : '') +
          '<div class="pr-progress"><span>Question ' + (i + 1) + ' of ' + items.length + ' · ' +
            esc(IR.ROUND_LABEL[opts.round]) + '</span><div class="pr-track"><span style="width:' + (i / items.length * 100) + '%"></span></div></div>' +
          '<article class="pr-card pr-stage is-in">' +
            cardHead(c, it.chained ? '<span class="pr-chain">follows on from your last answer</span>' : '') +
            '<div class="pr-timer"><span class="timer-face" data-face>0:00</span><span class="pr-target">target ' + mmss(target) + '</span></div>' +
            '<div class="btn-row" data-controls><button type="button" class="btn" data-answer>Start answering</button></div>' +
            '<div data-follow></div>' +
          '</article>';
        var card = stage.querySelector(".pr-card");
        var timer = makeTimer(card.querySelector("[data-face]"), target);
        var controls = card.querySelector("[data-controls]");
        var phase = "main";

        function answering() {
          timer.reset(); timer.start(); recStart();
          controls.innerHTML = '<button type="button" class="btn" data-stop>I have finished</button>' +
            (opts.record && mediaStream ? '<span class="pr-rec" aria-label="Recording">recording</span>' : '');
          controls.querySelector("[data-stop]").addEventListener("click", finished);
        }
        function finished() {
          timer.stop();
          res[phase] = timer.s;
          recStop(function (url) {
            if (url) res.audio.push(url);
            if (phase === "main" && c.follow) {
              phase = "follow";
              card.querySelector("[data-follow]").innerHTML =
                '<div class="pr-followup"><span class="q-label">The panel follows up</span><p>' + fmt(c.follow) + '</p></div>';
              controls.innerHTML = '<button type="button" class="btn" data-answer>Answer the follow-up</button>' +
                '<button type="button" class="btn is-ghost" data-skip>Skip to the model answer</button>';
              controls.querySelector("[data-answer]").addEventListener("click", answering);
              controls.querySelector("[data-skip]").addEventListener("click", revealAll);
              timer.reset(Math.round(target * 0.75));
            } else revealAll();
          });
        }
        function revealAll() {
          controls.innerHTML = "";
          card.appendChild(answer(c));
          var nx = el("div", "btn-row pr-next", '<button type="button" class="btn">' +
            (i + 1 < items.length ? "Next question" : "Finish the round") + '</button>');
          card.appendChild(nx);
          nx.querySelector("button").addEventListener("click", function () { i++; show(); });
        }
        controls.querySelector("[data-answer]").addEventListener("click", answering);
      }

      function finish() {
        if (mediaStream) { mediaStream.getTracks().forEach(function (t) { t.stop(); }); mediaStream = null; }
        var over = results.filter(function (r) { return r.main > target; }).length;
        stage.innerHTML =
          '<div class="pr-done"><h2>Round complete</h2>' +
          '<p>' + results.length + ' questions. ' + (over ? over + ' ran over the ' + mmss(target) + ' target - tighten those first.' : 'Every answer landed inside the target time.') + '</p>' +
          '<ol class="pr-results">' + results.map(function (r) {
            var x = IR.progress.get(r.c.id);
            var label = x ? IR.RATING[x.r].label : "Not rated";
            return '<li><div class="pr-res-q">' + fmt(r.c.q) + '</div>' +
              '<div class="pr-res-meta"><span class="' + (r.main > target ? "is-over" : "") + '">' + mmss(r.main) + '</span>' +
              (r.follow ? '<span>follow-up ' + mmss(r.follow) + '</span>' : '') + '<span>' + esc(label) + '</span></div>' +
              r.audio.map(function (u) { return '<audio controls preload="none" src="' + u + '"></audio>'; }).join("") + '</li>';
          }).join("") + '</ol>' +
          (results.some(function (r) { return r.audio.length; }) ? '<p class="fine-print">Recordings live only in this tab and disappear when you leave the page.</p>' : '') +
          '<div class="btn-row"><button type="button" class="btn" data-again>Another round</button>' +
          '<a class="btn is-ghost" href="review.html">Today\'s review</a></div></div>';
        stage.querySelector("[data-again]").addEventListener("click", setup);
      }
      show();
    }

    IR.load(["data/tracks.js"], setup);
  }

  /* ============================== Rehearsal room ============================== */
  function rehearsal(stage) {
    var all = pool(), current = null, round = "";
    stage.innerHTML =
      '<div class="stat-row">' +
        '<div class="stat"><b data-done>0</b><span>nailed</span></div>' +
        '<div class="stat"><b>' + all.length + '</b><span>questions available</span></div>' +
        '<div class="stat"><b data-pct>0%</b><span>of the bank</span></div>' +
        '<div class="stat"><b data-target>60s</b><span>target for this one</span></div>' +
      '</div>' +
      '<div class="timer-box">' +
        '<div class="timer-face" data-face>0:00</div>' +
        '<div class="btn-row"><button class="btn" type="button" data-start>Start timer</button>' +
          '<button class="btn is-ghost" type="button" data-stop>Stop</button>' +
          '<button class="btn is-ghost" type="button" data-reset>Reset</button>' +
          '<button class="btn" type="button" data-draw>Next question</button></div>' +
        '<div class="btn-row">' + field("Round", selectHtml("data-round", ROUND_OPTS, "")) + '</div>' +
      '</div>' +
      '<div data-card></div>';
    var face = stage.querySelector("[data-face]");
    var timer = makeTimer(face, 60);
    var slot = stage.querySelector("[data-card]");

    function stats() {
      var s = IR.progress.stats(all);
      stage.querySelector("[data-done]").textContent = s.nailed;
      stage.querySelector("[data-pct]").textContent = (all.length ? Math.round(s.nailed / all.length * 100) : 0) + "%";
    }
    function draw() {
      var list = round ? all.filter(function (c) { return (c.round || []).indexOf(round) >= 0; }) : all;
      if (!list.length) list = all;
      var pick = list[Math.floor(Math.random() * list.length)];
      if (current && list.length > 1 && pick.id === current.id) pick = list[(list.indexOf(pick) + 1) % list.length];
      current = pick;
      var target = (pick.round || []).indexOf("screening") >= 0 ? 30 : 120;
      timer.reset(target);
      stage.querySelector("[data-target]").textContent = target + "s";
      slot.innerHTML = '<p class="pr-hint">Say it out loud, from memory, before you open the card. Target: ' + target + ' seconds.</p>';
      var card = IR.renderCard(pick, 0, { showTopic: true, tab: "say" });
      card.classList.add("is-solo");
      slot.appendChild(card);
    }
    stage.querySelector("[data-start]").addEventListener("click", timer.start);
    stage.querySelector("[data-stop]").addEventListener("click", timer.stop);
    stage.querySelector("[data-reset]").addEventListener("click", function () { timer.reset(); });
    stage.querySelector("[data-draw]").addEventListener("click", draw);
    var sel = stage.querySelector("[data-round]");
    IR.enhanceSelect(sel, { inline: true });
    sel.addEventListener("change", function () { round = sel.value; draw(); });
    document.addEventListener("ir:progress", stats);
    stats();
    draw();
  }

  function start() {
    var stage = document.querySelector("[data-stage]");
    if (!stage) return;
    stage.innerHTML = "";
    var page = document.body.getAttribute("data-page");
    if (page === "review") review(stage);
    else if (page === "mock") mock(stage);
    else if (page === "rehearsal") rehearsal(stage);

    var reset = document.querySelector("[data-reset-progress]");
    if (reset) reset.addEventListener("click", function () {
      if (confirm("Reset every rating and review date? This cannot be undone.")) IR.progress.reset();
    });
  }

  /* portal.js may have finished booting before this file ran, or not yet. */
  if (IR && IR.onReady) IR.onReady(start);
  else document.addEventListener("ir:ready", start);
})();
