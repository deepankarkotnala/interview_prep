/* Interview Room — runtime.
   Standalone: theme, sidebar, card rendering, search and filters.
   Loaded as a classic deferred script so it runs after the data files, which
   are plain assignments onto window.IR. No fetch, no modules — the portal has
   to work when opened straight off the filesystem. */
(function () {
  "use strict";

  var IR = (window.IR = window.IR || {});
  IR.q = IR.q || {};

  var THEME_KEY = "ir.theme";
  var DONE_KEY = "ir.delivered";

  /* ---------- tiny helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  /* Inline formatting for authored text: `code` and **bold** only. Escaped
     first, so a card can never inject markup. */
  function fmt(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function paras(s) {
    return String(s || "").split(/\n\n+/).map(function (p) {
      return "<p>" + fmt(p.trim()) + "</p>";
    }).join("");
  }
  function store(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function depth() {
    /* topic pages sit one level down; everything else is at the root */
    return document.body.getAttribute("data-depth") === "1" ? "../" : "";
  }

  /* ---------- topbar icons ----------
     The same line-art set the parent portal uses. The theme toggle was a text
     glyph (☀/☾) here, which rendered as a different weight and colour from every
     other control in the bar because it was font, not stroke — that is the
     mismatch. These are stroked SVGs like the rest. */
  var ICON_HOME =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
  var ICON_FOCUS_OFF =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="3"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3"/></svg>';
  var ICON_FOCUS_ON =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>' +
    '<circle cx="12" cy="12" r="3"/></svg>';
  var ICON_SUN =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/>' +
    '<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  var ICON_MOON =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = t === "dark" ? "#17191e" : "#f3f4f6";
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      /* Shows the theme you would switch *to*, which is what the parent does. */
      btn.innerHTML = t === "dark" ? ICON_SUN : ICON_MOON;
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }
  IR.initTheme = function () {
    var t = "light";
    try { t = localStorage.getItem(THEME_KEY) || "light"; } catch (e) {}
    applyTheme(t);
  };

  /* ---------- delivered-out-loud state ---------- */
  function delivered() { return store(DONE_KEY, {}); }
  IR.delivered = delivered;
  function markDelivered(id, on) {
    var d = delivered();
    if (on) d[id] = 1; else delete d[id];
    save(DONE_KEY, d);
  }

  /* ---------- card counting ---------- */
  function cardsFor(slugKey) {
    var set = IR.q[slugKey];
    return set && set.cards ? set.cards : [];
  }
  function allCards() {
    var out = [];
    IR.topics.forEach(function (t) {
      cardsFor(t.num + "-" + t.slug).forEach(function (c) {
        out.push(Object.assign({ _topic: t }, c));
      });
    });
    return out;
  }
  IR.allCards = allCards;

  /* ---------- sidebar ---------- */
  function buildSidebar() {
    var host = document.querySelector("[data-sidebar]");
    if (!host) return;
    var base = depth();
    var here = document.body.getAttribute("data-topic");
    var page = document.body.getAttribute("data-page");

    var h = "";
    /* The mark is vendored into this portal's own assets/brand/, never read from
       a sibling directory — the folder has to render on its own from a USB stick.
       `onerror` still drops back to the "IR" lettering if the file is missing. */
    h += '<div class="brand">' +
         '<span class="brand-mark" aria-hidden="true">' +
         '<img src="' + base + 'assets/brand/switch-job-logo.svg" alt="" ' +
         'onerror="this.remove();this.parentNode.textContent=\'IR\'">' +
         '</span>' +
         '<span class="brand-text"><strong>Interview Room</strong>' +
         '<span>GenAI · India · Senior</span></span></div>';

    h += '<div class="nav-group"><div class="nav-label">Start here</div>';
    [["index.html", "Home", "home"],
     ["rounds.html", "By interview round", "rounds"],
     ["tracks.html", "By employer type", "tracks"],
     ["rehearsal.html", "Rehearsal room", "rehearsal"]].forEach(function (r) {
      h += '<a class="nav-link" href="' + base + r[0] + '"' +
           (page === r[2] ? ' aria-current="page"' : "") + '>' +
           '<span class="nav-chev" aria-hidden="true">›</span>' + esc(r[1]) + '</a>';
    });
    h += "</div>";

    h += '<div class="nav-group"><div class="nav-label">Topics</div>';
    IR.topics.forEach(function (t) {
      var key = t.num + "-" + t.slug;
      var n = cardsFor(key).length;
      var live = t.status === "live";
      h += '<a class="nav-link' + (live ? "" : " is-planned") + '"' +
           ' href="' + base + "topics/" + key + '.html"' +
           (here === key ? ' aria-current="page"' : "") +
           (live ? "" : ' tabindex="-1" aria-disabled="true"') + '>' +
           '<span class="nav-num">' + t.num + "</span>" +
           '<span>' + esc(t.title) + "</span>" +
           /* n is 0 when that topic's data file is not loaded on this page —
              show nothing rather than a misleading zero */
           '<span class="nav-count">' + (live ? (n || "") : "soon") + "</span></a>";
    });
    h += "</div>";
    host.innerHTML = h;
  }

  /* ---------- focus mode ----------
     Hides the sidebar and the bar's own furniture so the questions are the only
     thing on screen. The parent re-docks its controls into a pinned ribbon,
     which exists because its pages carry one; this portal has a single bar, so
     the bar simply sheds everything except the exit control and the theme
     toggle. Same keys (F to toggle, Esc to leave) and same stored state. */
  var FOCUS_KEY = "ir.focus";
  function buildFocus(host) {
    var btn = host.querySelector(".focus-btn");
    if (!btn) return;

    function apply(active, persist) {
      document.body.classList.toggle("focus-mode", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      btn.setAttribute("aria-label", active ? "Exit focus mode" : "Enter focus mode");
      btn.title = active ? "Exit focus mode (Esc)" : "Focus mode (F)";
      btn.innerHTML = (active ? ICON_FOCUS_ON : ICON_FOCUS_OFF) +
        '<span class="focus-lbl">' + (active ? "Exit focus" : "Focus") + "</span>";
      if (active) document.body.classList.remove("nav-open");
      if (persist) save(FOCUS_KEY, active);
      /* The Display panel is anchored to this button, which has just moved. */
      document.dispatchEvent(new CustomEvent("ir-focus-change"));
    }

    apply(store(FOCUS_KEY, false) === true, false);
    btn.addEventListener("click", function () {
      apply(!document.body.classList.contains("focus-mode"), true);
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && document.body.classList.contains("focus-mode")) {
        ev.preventDefault(); apply(false, true); btn.focus(); return;
      }
      if (ev.key.toLowerCase() !== "f" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      /* Never steal "f" from someone typing in the search box. */
      var tag = document.activeElement && document.activeElement.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tag || "")) return;
      ev.preventDefault();
      btn.click();
    });
  }

  /* ---------- Display panel ----------
     Text size, alignment and reading width, under one key, mirroring the
     parent's contract. Written to <html> as data attributes so the stylesheet
     owns the actual sizes — see the reading-settings block in portal.css. */
  var READING_KEY = "ir.reading";
  var SIZES = ["xs", "s", "m", "l", "xl"];
  var WIDTHS = ["default", "wide", "full"];
  var ALIGNS = ["left", "justify"];

  /* Kept in step with the pre-paint script in every page's <head>: if the two
     disagree the page reflows one step on load, which is what that script is
     there to prevent. The phone default is the larger step because the same
     multiplier over a ~360px column gives far fewer characters per line. */
  function defaultSize() {
    return window.matchMedia && window.matchMedia("(max-width: 860px)").matches ? "s" : "xs";
  }
  function readReading() {
    var s = store(READING_KEY, {}) || {};
    return {
      size:  SIZES.indexOf(s.size) >= 0 ? s.size : defaultSize(),
      width: WIDTHS.indexOf(s.width) >= 0 ? s.width : "default",
      align: ALIGNS.indexOf(s.align) >= 0 ? s.align : "left"
    };
  }
  function applyReading(s) {
    var root = document.documentElement;
    root.setAttribute("data-reading-size", s.size);
    root.setAttribute("data-reading-width", s.width);
    root.setAttribute("data-reading-align", s.align);
  }
  IR.initReading = function () { applyReading(readReading()); };

  function buildDisplay(host) {
    var wrap = host.querySelector(".reader-wrap");
    var trigger = wrap && wrap.querySelector(".reader-btn");
    if (!trigger) return;

    var settings = readReading();
    applyReading(settings);

    var SIZE_CHOICES = [
      { v: "xs", label: "A", cls: "sz-1", name: "Smallest text" },
      { v: "s",  label: "A", cls: "sz-2", name: "Compact text" },
      { v: "m",  label: "A", cls: "sz-3", name: "Standard text" },
      { v: "l",  label: "A", cls: "sz-4", name: "Large text" },
      { v: "xl", label: "A", cls: "sz-5", name: "Extra large text" }
    ];
    var ALIGN_CHOICES = [
      { v: "left", label: "Left", name: "Ragged right edge — even word spacing" },
      { v: "justify", label: "Justified", name: "Flush right edge — word spacing varies per line" }
    ];
    var WIDTH_CHOICES = [
      { v: "default", label: "Standard", name: "Standard reading measure" },
      { v: "wide", label: "Wide", name: "Wide reading measure" },
      { v: "full", label: "Full", name: "Full width — text spans the whole screen" }
    ];
    function segment(group, choices) {
      return '<div class="reader-segment" data-reader-' + group + ' role="group">' +
        choices.map(function (c) {
          return '<button type="button" data-value="' + c.v + '"' +
            (c.cls ? ' class="' + c.cls + '"' : "") +
            ' title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '">' +
            esc(c.label) + "</button>";
        }).join("") + "</div>";
    }

    /* Panel and scrim are children of <body>, not of the bar: the topbar sets
       backdrop-filter, which would make it the containing block for a fixed
       child and then clip it. */
    var panel = el("div", "reader-popover");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Display settings");
    panel.innerHTML =
      '<div class="reader-head"><h3>Display</h3>' +
      '<button type="button" class="reader-close" aria-label="Close display settings">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button></div>" +
      "<p>Changes how this portal reads, and follows you across its pages.</p>" +
      '<div class="reader-row"><span>Text size</span>' + segment("size", SIZE_CHOICES) + "</div>" +
      '<div class="reader-row"><span>Alignment</span>' + segment("align", ALIGN_CHOICES) + "</div>" +
      '<div class="reader-row reader-row-width"><span>Text width</span>' + segment("width", WIDTH_CHOICES) + "</div>" +
      '<button type="button" class="reader-reset">Reset to default</button>';

    var scrim = el("div", "reader-scrim");
    var live = el("div", "sr-only");
    live.setAttribute("aria-live", "polite");
    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.appendChild(live);

    function refresh() {
      var groups = { size: settings.size, align: settings.align, width: settings.width };
      Object.keys(groups).forEach(function (g) {
        var btns = panel.querySelectorAll("[data-reader-" + g + "] button");
        for (var i = 0; i < btns.length; i++) {
          var on = btns[i].getAttribute("data-value") === groups[g];
          btns[i].classList.toggle("active", on);
          btns[i].setAttribute("aria-pressed", on ? "true" : "false");
        }
      });
      var custom = settings.size !== defaultSize() || settings.align !== "left" ||
                   settings.width !== "default";
      trigger.classList.toggle("is-custom", custom);
      panel.querySelector(".reader-reset").disabled = !custom;
    }
    function commit() {
      applyReading(settings);
      refresh();
      save(READING_KEY, settings);
      var names = { xs: "smallest", s: "compact", m: "standard", l: "large", xl: "extra large" };
      live.textContent = "Display: " + names[settings.size] + " text, " +
        (settings.align === "justify" ? "justified" : "left aligned") + ".";
    }

    /* Below this width the stylesheet pins the panel as a bottom sheet, so it
       must not also carry the anchored form's inline coordinates. */
    var sheet = window.matchMedia("(max-width: 620px)");
    function place() {
      if (sheet.matches) { panel.style.top = ""; panel.style.right = ""; return; }
      var r = trigger.getBoundingClientRect();
      panel.style.top = Math.round(r.bottom + 8) + "px";
      panel.style.right = Math.max(8, Math.round(window.innerWidth - r.right)) + "px";
    }
    function isOpen() { return panel.classList.contains("open"); }
    function open(v) {
      if (v) place();
      panel.classList.toggle("open", v);
      scrim.classList.toggle("open", v);
      document.body.classList.toggle("reader-open", v);
      trigger.setAttribute("aria-expanded", v ? "true" : "false");
    }

    trigger.addEventListener("click", function () { open(!isOpen()); });
    panel.querySelector(".reader-close").addEventListener("click", function () {
      open(false); trigger.focus();
    });
    scrim.addEventListener("click", function () { open(false); });
    ["size", "align", "width"].forEach(function (g) {
      panel.querySelector("[data-reader-" + g + "]").addEventListener("click", function (ev) {
        var b = ev.target.closest("button[data-value]");
        if (!b) return;
        settings[g] = b.getAttribute("data-value");
        commit();
      });
    });
    panel.querySelector(".reader-reset").addEventListener("click", function () {
      settings.size = defaultSize(); settings.align = "left"; settings.width = "default";
      commit();
    });
    document.addEventListener("click", function (ev) {
      if (!isOpen() || wrap.contains(ev.target) || panel.contains(ev.target)) return;
      open(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape" || !isOpen()) return;
      open(false); trigger.focus();
    });
    window.addEventListener("resize", function () { if (isOpen()) place(); });
    window.addEventListener("scroll", function () { if (isOpen()) place(); }, { passive: true });
    document.addEventListener("ir-focus-change", function () { if (isOpen()) place(); });

    refresh();
  }

  /* ---------- topbar ---------- */
  function buildTopbar() {
    var host = document.querySelector("[data-topbar]");
    if (!host) return;
    var base = depth();
    var trail = host.getAttribute("data-crumbs") || "";
    var crumbs = '<a href="' + base + 'index.html">Interview Room</a>';
    trail.split("|").filter(Boolean).forEach(function (c) {
      crumbs += "<span>/</span><span>" + esc(c) + "</span>";
    });
    /* Home · Focus · Display · theme, in that reading order — the same bar the
       parent portal builds, so moving between the two portals does not move the
       controls. Home points at this portal's own index, not the parent's: the
       folder has to work on its own. */
    host.innerHTML =
      '<button class="icon-btn menu-btn" data-menu aria-label="Open navigation">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>' +
      "</button>" +
      '<nav class="crumbs" aria-label="Breadcrumb">' + crumbs + "</nav>" +
      '<div class="topbar-spacer"></div>' +
      '<a class="home-btn" href="' + base + 'index.html" aria-label="Go to Interview Room home">' +
        ICON_HOME + '<span class="home-lbl">Home</span></a>' +
      '<button class="focus-btn" type="button" aria-pressed="false" ' +
        'aria-label="Toggle distraction-free focus mode" title="Focus mode (F)">' +
        ICON_FOCUS_OFF + '<span class="focus-lbl">Focus</span></button>' +
      '<div class="reader-wrap">' +
        '<button class="reader-btn" type="button" aria-expanded="false" aria-haspopup="dialog" ' +
          'title="Text size and reading width" aria-label="Display settings: text size and reading width">' +
          '<span class="reader-glyph" aria-hidden="true">A<i>a</i></span>' +
          '<span class="reader-lbl">Display</span>' +
        "</button>" +
      "</div>" +
      '<button class="icon-btn" data-theme-toggle aria-label="Switch theme"></button>';

    host.querySelector("[data-theme-toggle]").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });

    buildFocus(host);
    buildDisplay(host);
    /* The drawer scrim is a real element rather than a ::after on <body>, which
       is what the parent portal uses: it can be clicked directly, it sits in a
       predictable stacking context under the drawer, and it does not depend on
       :has() being supported. Created once, on demand. */
    var backdrop = document.querySelector(".backdrop");
    if (!backdrop) {
      backdrop = el("div", "backdrop");
      document.body.appendChild(backdrop);
    }
    function setNav(open) {
      document.body.classList.toggle("nav-open", open);
      var btn = host.querySelector("[data-menu]");
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    host.querySelector("[data-menu]").addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
    backdrop.addEventListener("click", function () { setNav(false); });
    document.addEventListener("click", function (ev) {
      if (!document.body.classList.contains("nav-open")) return;
      if (ev.target.closest(".sidebar") || ev.target.closest("[data-menu]")) return;
      setNav(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && document.body.classList.contains("nav-open")) setNav(false);
    });
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
  }

  /* ---------- one question card ---------- */
  var ROUND_LABEL = {};
  function roundLabel(k) {
    if (!Object.keys(ROUND_LABEL).length) {
      (IR.rounds || []).forEach(function (r) { ROUND_LABEL[r.key] = r.label; });
    }
    return ROUND_LABEL[k] || k;
  }

  function renderCard(c, index, opts) {
    opts = opts || {};
    var d = el("details", "q-card");
    d.id = c.id;
    d.setAttribute("data-search",
      (c.q + " " + (c.tags || []).join(" ") + " " + (c.simple || "")).toLowerCase());
    d.setAttribute("data-rounds", (c.round || []).join(" "));
    d.setAttribute("data-level", c.level || "");
    d.setAttribute("data-tags", (c.tags || []).join(" "));

    var meta = (c.round || []).map(function (r) {
      return '<span class="is-round">' + esc(roundLabel(r)) + "</span>";
    }).join("");
    if (c.level) meta += '<span class="is-level">' + esc(c.level) + " yrs</span>";
    meta += (c.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    if (opts.showTopic && c._topic) {
      meta = '<span class="is-round">' + esc(c._topic.title) + "</span>" + meta;
    }

    d.appendChild(el("summary", null,
      '<span class="q-no">' + String(index + 1).padStart(2, "0") + "</span>" +
      '<span class="q-title">' + fmt(c.q) +
      '<span class="q-meta">' + meta + "</span></span>" +
      '<span class="q-chev" aria-hidden="true">+</span>'));

    var b = el("div", "q-body");
    var h = "";
    if (c.why) {
      h += '<div class="q-why"><b class="slot-label">What they are testing</b>' + fmt(c.why) + "</div>";
    }
    if (c.simple) {
      h += '<div class="q-simple"><b class="slot-label">In simple words</b>' + paras(c.simple) + "</div>";
    }
    if (c.points && c.points.length) {
      h += '<ul class="q-points">' + c.points.map(function (p) {
        return "<li>" + fmt(p) + "</li>";
      }).join("") + "</ul>";
    }
    if (c.code) {
      h += '<pre class="q-code"><code>' + esc(c.code) + "</code></pre>";
    }
    if (c.say) {
      h += '<div class="q-say"><b class="slot-label">Say this in the room</b><p>' + fmt(c.say) + "</p></div>";
    }
    if (c.numbers) {
      h += '<div class="q-numbers"><b class="slot-label">Number to quote</b>' + fmt(c.numbers) + "</div>";
    }
    if (c.wrong) {
      h += '<div class="q-wrong"><b class="slot-label">This loses the offer</b>' + fmt(c.wrong) + "</div>";
    }
    if (c.follow) {
      h += '<div class="q-follow"><b class="slot-label">Likely follow-up</b>' + fmt(c.follow) + "</div>";
    }
    b.innerHTML = h;

    var actions = el("div", "q-actions");
    var done = !!delivered()[c.id];
    var btn = el("button", "mini-btn", done ? "✓ Delivered out loud" : "Mark delivered out loud");
    btn.type = "button";
    btn.setAttribute("data-done", String(done));
    btn.addEventListener("click", function () {
      var now = btn.getAttribute("data-done") !== "true";
      btn.setAttribute("data-done", String(now));
      btn.textContent = now ? "✓ Delivered out loud" : "Mark delivered out loud";
      markDelivered(c.id, now);
      document.dispatchEvent(new CustomEvent("ir:delivered"));
    });
    actions.appendChild(btn);
    b.appendChild(actions);

    d.appendChild(b);
    return d;
  }
  IR.renderCard = renderCard;

  /* ---------- filter bar + list ---------- */
  function mountList(host, cards, opts) {
    opts = opts || {};
    var state = { text: "", round: "", level: "", tag: "" };

    var tags = {};
    cards.forEach(function (c) { (c.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
    var topTags = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).slice(0, 12);

    var bar = el("div", "filters");
    bar.innerHTML =
      '<div class="search-wrap"><span class="search-icon">⌕</span>' +
      '<input type="search" placeholder="Search questions, e.g. chunking, hallucination, latency" aria-label="Search questions"></div>' +
      '<div class="filter-row" data-row="round"><b>Round</b>' +
      (IR.rounds || []).map(function (r) {
        return '<button class="pill" type="button" aria-pressed="false" data-round="' + r.key + '" title="' + esc(r.hint) + '">' + esc(r.label) + "</button>";
      }).join("") + "</div>" +
      '<div class="filter-row" data-row="level"><b>Level</b>' +
      (IR.levels || []).map(function (l) {
        return '<button class="pill" type="button" aria-pressed="false" data-level="' + l.key + '">' + esc(l.label) + "</button>";
      }).join("") +
      '<span class="filter-actions"><span class="result-count"></span>' +
      '<button class="mini-btn" type="button" data-expand>Expand all</button>' +
      '<button class="mini-btn" type="button" data-reset>Reset</button></span></div>' +
      (topTags.length ? '<div class="filter-row" data-row="tag"><b>Tag</b>' +
        topTags.map(function (t) {
          return '<button class="pill" type="button" aria-pressed="false" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
        }).join("") + "</div>" : "");

    var list = el("div", "q-list");
    var empty = el("div", "q-empty", "No question matches those filters. Reset and try a shorter word.");
    empty.hidden = true;

    cards.forEach(function (c, i) { list.appendChild(renderCard(c, i, opts)); });

    host.appendChild(bar);
    host.appendChild(list);
    host.appendChild(empty);

    var count = bar.querySelector(".result-count");

    function apply() {
      var shown = 0;
      Array.prototype.forEach.call(list.children, function (n) {
        var ok = true;
        if (state.text && n.getAttribute("data-search").indexOf(state.text) < 0) ok = false;
        if (ok && state.round && (" " + n.getAttribute("data-rounds") + " ").indexOf(" " + state.round + " ") < 0) ok = false;
        if (ok && state.level && n.getAttribute("data-level") !== state.level) ok = false;
        if (ok && state.tag && (" " + n.getAttribute("data-tags") + " ").indexOf(" " + state.tag + " ") < 0) ok = false;
        n.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + " of " + cards.length;
      empty.hidden = shown > 0;
    }

    bar.querySelector("input").addEventListener("input", function (e) {
      state.text = e.target.value.trim().toLowerCase();
      apply();
    });
    bar.addEventListener("click", function (e) {
      var p = e.target.closest(".pill");
      if (p) {
        var kind = p.hasAttribute("data-round") ? "round" : p.hasAttribute("data-level") ? "level" : "tag";
        var val = p.getAttribute("data-" + kind);
        var on = state[kind] !== val;
        state[kind] = on ? val : "";
        Array.prototype.forEach.call(bar.querySelectorAll("[data-" + kind + "]"), function (x) {
          x.setAttribute("aria-pressed", String(on && x === p));
        });
        apply();
        return;
      }
      if (e.target.closest("[data-expand]")) {
        var btn = e.target.closest("[data-expand]");
        var opening = btn.textContent === "Expand all";
        Array.prototype.forEach.call(list.children, function (n) { if (!n.hidden) n.open = opening; });
        btn.textContent = opening ? "Collapse all" : "Expand all";
        return;
      }
      if (e.target.closest("[data-reset]")) {
        state = { text: "", round: "", level: "", tag: "" };
        bar.querySelector("input").value = "";
        Array.prototype.forEach.call(bar.querySelectorAll(".pill"), function (x) {
          x.setAttribute("aria-pressed", "false");
        });
        apply();
      }
    });

    apply();

    /* deep link: #card-id opens that card */
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.classList.contains("q-card")) {
        target.open = true;
        /* guarded: scrollIntoView is missing in some non-browser DOMs, and an
           unopened card is still the useful outcome without the scroll */
        setTimeout(function () {
          if (typeof target.scrollIntoView === "function") {
            target.scrollIntoView({ block: "center" });
          }
        }, 60);
      }
    }
  }
  IR.mountList = mountList;

  /* ---------- page bootstraps ---------- */
  function bootTopic() {
    var key = document.body.getAttribute("data-topic");
    var topic = IR.topics.filter(function (t) { return t.num + "-" + t.slug === key; })[0];
    var set = IR.q[key];
    var head = document.querySelector("[data-topic-head]");
    var host = document.querySelector("[data-topic-body]");
    if (!topic || !set || !host) return;

    document.title = topic.title + " — Interview Room";
    if (head) {
      head.innerHTML =
        '<div class="eyebrow">Topic ' + esc(topic.num) + "</div>" +
        "<h1>" + esc(topic.title) + "</h1>" +
        '<p class="lede">' + fmt(set.lede || topic.blurb) + "</p>" +
        '<div class="chip-row">' +
        '<span class="chip is-accent">' + set.cards.length + " questions</span>" +
        (set.grounding ? '<span class="chip">Grounded in: ' + esc(set.grounding) + "</span>" : "") +
        "</div>";
    }
    if (set.evening && set.evening.length) {
      var note = el("div", "note");
      note.innerHTML = "<strong>If you only have one evening:</strong> do these " +
        set.evening.length + " first — " +
        set.evening.map(function (id) {
          var c = set.cards.filter(function (x) { return x.id === id; })[0];
          return c ? '<a href="#' + esc(id) + '">' + fmt(c.q) + "</a>" : "";
        }).filter(Boolean).join(" · ");
      host.appendChild(note);
    }
    mountList(host, set.cards);
  }

  function bootIndex() {
    var host = document.querySelector("[data-topic-grid]");
    if (!host) return;
    var base = depth();
    var total = 0;
    var h = "";
    IR.topics.forEach(function (t) {
      var key = t.num + "-" + t.slug;
      var n = cardsFor(key).length;
      total += n;
      var live = t.status === "live";
      h += '<a class="tile' + (live ? "" : " is-planned") + '" href="' + base + "topics/" + key + '.html">' +
           '<span class="tile-num">TOPIC ' + t.num + "</span>" +
           "<h3>" + esc(t.title) + "</h3>" +
           "<p>" + esc(t.blurb) + "</p>" +
           '<div class="tile-foot">' + (live ? n + " questions" : "Planned") + "</div></a>";
    });
    host.innerHTML = h;
    var c = document.querySelector("[data-total-count]");
    if (c) c.textContent = total;
    var d = document.querySelector("[data-delivered-count]");
    if (d) d.textContent = Object.keys(delivered()).length;
  }

  function bootRounds() {
    var host = document.querySelector("[data-round-body]");
    if (!host) return;
    mountList(host, allCards(), { showTopic: true });
  }

  /* ---------- employer tracks ----------
     A track owns no questions. It names ten existing cards in priority order and
     supplies the framing that changes how you answer them. Cards are looked up
     from the loaded set, so a track can never drift out of sync with the bank —
     a missing id shows as a visible gap rather than a silent omission. */
  function bootTracks() {
    var host = document.querySelector("[data-tracks-body]");
    if (!host || !IR.tracks) return;

    var byId = {};
    allCards().forEach(function (c) { byId[c.id] = c; });
    var base = depth();

    var h = "";
    IR.tracks.forEach(function (t) {
      h += '<section class="track" id="track-' + esc(t.key) + '">';
      h += "<h2>" + esc(t.label) + "</h2>";
      h += '<div class="chip-row"><span class="chip">Grounded in: ' + esc(t.grounding) + "</span></div>";
      h += "<p><strong>Type includes:</strong> " + esc(t.includes) + "</p>";
      h += "<p><strong>What they press on:</strong> " + fmt(t.skew) + "</p>";
      h += "<p><strong>Round structure:</strong> " + fmt(t.rounds) + "</p>";
      h += '<div class="note"><strong>Watch for:</strong> ' + fmt(t.watch) + "</div>";

      h += "<h3>The ten most likely, in priority order</h3><ol class=\"track-ten\">";
      t.ten.forEach(function (id) {
        var c = byId[id];
        if (!c) { h += '<li class="is-missing">missing card: ' + esc(id) + "</li>"; return; }
        var key = c._topic.num + "-" + c._topic.slug;
        h += '<li><a href="' + base + "topics/" + key + ".html#" + esc(id) + '">' +
             fmt(c.q) + '</a> <span class="track-topic">' + esc(c._topic.title) + "</span></li>";
      });
      h += "</ol>";

      if (t.scenario) {
        h += '<h3>' + esc(t.scenario.title) + "</h3>";
        h += '<div class="note is-warn"><strong>Prompt:</strong> ' + fmt(t.scenario.prompt) + "</div>";
        h += "<ol class=\"track-moves\">" + t.scenario.moves.map(function (m) {
          return "<li>" + fmt(m) + "</li>";
        }).join("") + "</ol>";
      }
      h += "</section>";
    });
    host.innerHTML = h;
  }

  /* ---------- go ---------- */
  function boot() {
    IR.initTheme();
    buildSidebar();
    buildTopbar();
    var page = document.body.getAttribute("data-page");
    if (page === "topic") bootTopic();
    else if (page === "home") bootIndex();
    else if (page === "rounds") bootRounds();
    else if (page === "tracks") bootTracks();
    document.dispatchEvent(new CustomEvent("ir:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
