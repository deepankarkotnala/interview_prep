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
         '<img src="' + base + 'assets/brand/switch-job-logo.png" alt="" ' +
         'onerror="this.remove();this.parentNode.textContent=\'IR\'">' +
         '</span>' +
         '<span class="brand-text"><strong>Interview Room</strong>' +
         '<span>GenAI · India · Senior</span></span></div>';

    /* The box renders even when the index has not loaded (a topic page that
       has not been rebuilt yet); buildSearch simply finds no index and the box
       reports no matches rather than throwing. */
    h += '<div class="sb-search" data-search-box>' +
         '<span class="sb-icon" aria-hidden="true">' +
         '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
         'stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/>' +
         '<path d="M20 20l-3.5-3.5"/></svg></span>' +
         '<input type="search" placeholder="Search all topics" ' +
         'aria-label="Search every question in this portal" ' +
         'autocomplete="off" spellcheck="false">' +
         '<button type="button" class="sb-clear" hidden aria-label="Clear search">&times;</button>' +
         '</div>';
    h += '<div class="sb-results" data-search-results hidden role="listbox" ' +
         'aria-label="Search results"></div>';

    h += '<div data-nav-groups>';
    h += '<div class="nav-group"><div class="nav-label">Start here</div>';
    /* Each route carries its own glyph in the slot a topic row gives its
       number, so the four rows are told apart at a glance rather than by
       reading the label — the reference mockup's treatment. */
    [["index.html", "Home", "home", "⌂"],
     ["rounds.html", "By interview round", "rounds", "↗"],
     ["tracks.html", "By employer type", "tracks", "⌘"],
     ["rehearsal.html", "Rehearsal room", "rehearsal", "◌"]].forEach(function (r) {
      h += '<a class="nav-link" href="' + base + r[0] + '"' +
           (page === r[2] ? ' aria-current="page"' : "") + '>' +
           '<span class="nav-chev" aria-hidden="true">' + r[3] + '</span>' +
           '<span>' + esc(r[1]) + '</span></a>';
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
    h += "</div>";   /* data-nav-groups */
    host.innerHTML = h;
    buildSearch(host);
  }


  /* ---------- sidebar search UI ----------
     Sits directly under the brand, above the nav. While a query is active the
     nav is replaced by results rather than sitting below them: the sidebar is
     one column and pushing eighteen topic rows below a result list would put
     the answer off-screen on a laptop. Clearing the box puts the nav back. */
  function buildSearch(host) {
    var box = host.querySelector("[data-search-box]");
    if (!box) return;
    var input = box.querySelector("input");
    var results = host.querySelector("[data-search-results]");
    var nav = host.querySelector("[data-nav-groups]");
    var clear = box.querySelector(".sb-clear");
    var base = depth();
    var active = -1;      /* keyboard cursor into the result list */

    function setOpen(on) {
      results.hidden = !on;
      nav.hidden = on;
      clear.hidden = !on;
      host.classList.toggle("is-searching", on);
    }

    function render(rows, query) {
      if (!rows.length) {
        results.innerHTML = '<p class="sb-empty">No match for <strong>'
          + esc(query) + "</strong>.<br>Try a shorter phrase, or a single term.</p>";
        return;
      }
      var byTopic = {};
      var order = [];
      var h = "";

      rows.forEach(function (r) {
        if (r.kind === "topic") return;
        var k = r.card.k;
        if (!byTopic[k]) { byTopic[k] = []; order.push(k); }
        byTopic[k].push(r);
      });

      /* Topic hits lead — someone typing a subject name usually wants the
         subject, and it is one row rather than a block. */
      var topics = rows.filter(function (r) { return r.kind === "topic"; });
      if (topics.length) {
        h += '<div class="sb-sec">Topics</div>';
        topics.slice(0, 4).forEach(function (r) {
          var t = r.topic;
          var live = t.s === "live";
          h += '<a class="sb-hit sb-hit-topic' + (live ? "" : " is-planned") + '" href="'
            + base + "topics/" + t.k + '.html">'
            + '<span class="sb-num">' + esc(t.n) + "</span>"
            + '<span class="sb-hit-t">' + esc(t.t) + "</span></a>";
        });
      }

      order.forEach(function (k) {
        var list = byTopic[k];
        var meta = null;
        for (var i = 0; i < IR.searchIndex.topics.length; i++) {
          if (IR.searchIndex.topics[i].k === k) { meta = IR.searchIndex.topics[i]; break; }
        }
        h += '<div class="sb-sec">' + esc(meta ? meta.t : k) + "</div>";
        list.slice(0, 6).forEach(function (r) {
          /* Deep link straight to the card. The topic page opens it and
             scrolls to it — see the hash handling in bootTopic. */
          h += '<a class="sb-hit" href="' + base + "topics/" + k + ".html#" + esc(r.card.i) + '">'
            + '<span class="sb-hit-t">' + esc(r.card.q) + "</span></a>";
        });
      });
      results.innerHTML = h;
    }

    var timer = null;
    function run() {
      var q = input.value.trim();
      active = -1;
      if (q.length < 2) { setOpen(false); return; }
      var rows = IR.runSearch(q);
      render(rows, q);
      setOpen(true);
    }

    input.addEventListener("input", function () {
      /* The search itself is a few milliseconds, so this is not for throughput
         — it is so the result list is not re-rendering under the reader's eyes
         on every keystroke of a long word. */
      clearTimeout(timer);
      timer = setTimeout(run, 110);
    });

    function hits() { return results.querySelectorAll(".sb-hit"); }
    function move(d) {
      var list = hits();
      if (!list.length) return;
      if (active >= 0 && list[active]) list[active].classList.remove("is-active");
      active += d;
      if (active < 0) active = list.length - 1;
      if (active >= list.length) active = 0;
      list[active].classList.add("is-active");
      list[active].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); move(-1); return; }
      if (e.key === "Enter") {
        var list = hits();
        if (active >= 0 && list[active]) { e.preventDefault(); list[active].click(); }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (input.value) { input.value = ""; run(); }
        else input.blur();
      }
    });

    clear.addEventListener("click", function () {
      input.value = ""; run(); input.focus();
    });

    /* "/" focuses the box from anywhere, the convention every docs site uses.
       Never stolen from someone already typing. */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tag || "")) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
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

  /* ---------- whiteboard diagrams ----------
     Some questions are answered at a whiteboard, not in a paragraph. "Build a
     RAG agent in LangGraph — what nodes and edges?" is marked in its own `why`
     as a whiteboard question, and the answer only lands if you can draw it
     while you talk.

     So a card may carry a `diagram`, and this renders it as inline SVG, built
     from a small declarative spec rather than hand-written markup: the spec is
     short enough to review in a diff, check.js can validate it like any other
     slot, and layout stays consistent instead of drifting per author.

     Deliberately plain. This is a picture you have to reproduce on a
     whiteboard under pressure, so it is boxes, arrows and labels — nothing you
     could not draw with one marker in about forty seconds.

     ---- Why the layout is measured rather than guessed ----

     The first version placed boxes on a grid and drew lines between them, and
     it produced a mess: edge labels ran off the canvas, two back-edges wrote
     their labels on top of each other, and a curve between diagonal cells cut
     straight through the box sitting between them. All three have the same
     cause — nothing tracked how much room a thing actually needed before
     committing to a position.

     So this version measures first. Text width is estimated per string and
     boxes are sized to their content; the side lanes are allocated per edge so
     two loops never share an x; and every connector is routed orthogonally
     through the gaps between rows rather than sliced diagonally across them.
     Nothing is drawn until its extent is known.

     ---- Responsive ----

     The same spec renders at two widths. Above the breakpoint, rows lay out as
     authored. Below it, every row collapses to one column and the drawing
     becomes a single vertical track — which is the only honest way to show a
     graph on a 360px screen. Both are produced at build time and swapped with
     CSS, so there is no resize listener and no re-render.

     Spec:
       rows:  [[node, …], …]                 nodes per row, top to bottom
       node:  { id, label, note?, accent? }   accent: accent|warn|bad|muted
       edges: [{ from, to, label?, kind? }]   kind: "back" for a loop
       kind: "lanes" + lanes: [{label, note?, accent?}]   for a plain sequence
     */

  /* Character-width factors for the two type sizes used inside a drawing.
     There is no text measurement available while building a string, and an
     estimate is fine here because it is only ever used to decide whether
     something FITS — erring wide costs a little whitespace, which is the safe
     direction. Tuned against the Inter metrics the portal actually loads. */
  var DIA_CH_LABEL = 6.55;   /* 11.5px, weight 650 */
  var DIA_CH_NOTE  = 4.85;   /* 9px, weight 600   */
  var DIA_CH_EDGE  = 5.05;   /* 9.5px, weight 600 */

  /* On a phone the narrow SVG's 700-unit canvas is painted into ~320 CSS
     pixels, so authored type lands at under half its size and the drawing
     becomes unreadable. The narrow layout therefore authors its text larger in
     user units — the viewBox scales it back down to something legible on
     glass. Layout has to know this, or boxes get sized for 11.5px type and the
     bigger glyphs overflow them. Kept in step with the font-size rules for
     `.dg-narrow` in portal.css. */
  var DIA_NARROW_TYPE = 2.2;

  /* Line heights, per layout, so wrapping and box heights agree with what is
     actually painted. */
  function diaMetrics(narrow) {
    var k = narrow ? DIA_NARROW_TYPE : 1;
    return {
      k: k,
      chLabel: DIA_CH_LABEL * k,
      chNote: DIA_CH_NOTE * k,
      chEdge: DIA_CH_EDGE * k,
      lhLabel: 14 * k,
      lhNote: 11 * k,
      lhEdge: 11 * k,
      padBox: 14 * k
    };
  }

  function diaTextW(s, ch) { return String(s == null ? "" : s).length * ch; }

  var DIA = {
    w: 700,
    minNodeH: 44,
    rowGap: 52,       /* vertical room between rows — connectors route in here */
    colGap: 26,
    padX: 18,
    padY: 16,
    laneStep: 15,     /* horizontal offset between two lanes on the same side */
    laneGap: 10       /* gap between the outermost lane and the boxes */
  };

  /* Greedy wrap to a pixel width. Returns every line — nothing is dropped,
     because a silently truncated label is exactly the failure this is here to
     prevent; a box grows taller instead. */
  function diaWrapPx(text, maxPx, ch) {
    var words = String(text == null ? "" : text).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var lines = [], cur = words[0];
    for (var i = 1; i < words.length; i++) {
      if (diaTextW(cur + " " + words[i], ch) <= maxPx) cur += " " + words[i];
      else { lines.push(cur); cur = words[i]; }
    }
    lines.push(cur);
    return lines;
  }

  /* ---- layout ----
     `cols` forces one column per row when narrow. Returns absolute geometry
     for every node plus the canvas height, so the caller never guesses. */
  function diaLayout(spec, narrow) {
    var rows = spec.rows || [];
    var M = diaMetrics(narrow);
    var lanesL = [], lanesR = [];

    /* Lane allocation first, because it decides how much horizontal room the
       boxes have left. Each long connector gets its OWN lane on its own side —
       that is what stops two loop labels landing on the same pixel. */
    /* Row index per node. When narrow, every row collapses to one column, so
       a node's effective row is its position in the FLATTENED list — not the
       row it was authored in. Getting this wrong is what drew a three-row jump
       as a straight vertical line through the two boxes in between. */
    var rowOf = {};
    if (narrow) {
      var flat = 0;
      rows.forEach(function (row) { row.forEach(function (n) { rowOf[n.id] = flat++; }); });
    } else {
      rows.forEach(function (row, r) { row.forEach(function (n) { rowOf[n.id] = r; }); });
    }

    (spec.edges || []).forEach(function (e) {
      var ri = rowOf[e.from], rj = rowOf[e.to];
      if (ri == null || rj == null) return;
      /* A back edge between ADJACENT rows needs no lane: it is a short hop
         through the gap those two rows already share. Sending it round the
         side gave it a zero-length vertical run, which meant two such loops
         had identical label positions and no offset could separate them.
         Only genuinely long connectors get a lane. */
      var long = Math.abs(ri - rj) > 1;
      if (!long) return;
      var w = e.label ? diaTextW(e.label, M.chEdge) + 8 : 0;
      (e.kind === "back" ? lanesL : lanesR).push({ e: e, w: w });
    });

    /* Reserve: the widest label on each side, plus one step per extra lane. */
    /* Reserve for the WORST case: each lane sits one step further out than the
       last, and its label extends inward from there. Sizing to the widest
       label alone under-reserves as soon as a third lane appears — the label
       on the outermost lane then starts left of zero. */
    function reserve(list) {
      if (!list.length) return 0;
      var need = 0;
      list.forEach(function (l, i) {
        need = Math.max(need, i * DIA.laneStep + l.w);
      });
      return DIA.laneGap + need + 6;
    }
    /* Narrow reserves the same way — a label needs its width whatever the
       viewport, and an earlier version that reserved a flat 22px is exactly
       how "regenerate once" ended up hanging off the left edge. It is capped
       so a long label cannot squeeze the boxes to nothing; the label wraps
       instead. */
    var resL = reserve(lanesL);
    var resR = reserve(lanesR);
    if (narrow) {
      /* Cap the reservation so a long branch label cannot squeeze the boxes to
         nothing on a phone; the label wraps instead. Scaled with the type. */
      resL = Math.min(resL, 96 * M.k);
      resR = Math.min(resR, 96 * M.k);
    }

    /* Each long connector gets its own x AND its own vertical slot for the
       label. Sharing an x was what let two loop labels land on one another. */
    var laneX = {}, laneSlot = {}, li = 0, ri2 = 0;
    lanesL.forEach(function (l) {
      var k = l.e.from + ">" + l.e.to;
      laneX[k] = DIA.padX + resL - DIA.laneGap - li * DIA.laneStep;
      laneSlot[k] = li++;
    });
    lanesR.forEach(function (l) {
      var k = l.e.from + ">" + l.e.to;
      laneX[k] = DIA.w - DIA.padX - resR + DIA.laneGap + ri2 * DIA.laneStep;
      laneSlot[k] = ri2++;
    });

    var left = DIA.padX + resL;
    var inner = DIA.w - DIA.padX * 2 - resL - resR;

    /* Place boxes. Height is derived from wrapped content, and every box in a
       row shares the tallest — a ragged row reads as a mistake. */
    var widestRow = 0;
    rows.forEach(function (row) { widestRow = Math.max(widestRow, row.length); });

    var pos = {}, y = DIA.padY, rowY = [];
    rows.forEach(function (row) {
      var cols = narrow ? 1 : row.length;
      for (var c0 = 0; c0 < row.length; c0 += cols) {
        var slice = row.slice(c0, c0 + cols);
        var w = (inner - DIA.colGap * (slice.length - 1)) / slice.length;
        /* A row holding a single node would otherwise stretch the full width,
           which looks like a banner and forces every connector reaching it to
           detour around the whole drawing. Hold it to the width of the widest
           multi-column row instead, centred, so the columns line up. */
        var span = w, off = 0;
        if (!narrow && slice.length === 1 && widestRow > 1) {
          span = (inner - DIA.colGap * (widestRow - 1)) / widestRow;
          /* Wide enough for its own content, but never wider than the row it
             is aligning to plus one gutter. */
          var need = diaTextW(slice[0].label, M.chLabel) + 28 * M.k;
          span = Math.max(span, Math.min(need, inner));
          off = (inner - span) / 2;
        }
        w = span;
        var hMax = DIA.minNodeH * (narrow ? M.k : 1);
        var wrapped = slice.map(function (n) {
          var lab = diaWrapPx(n.label, w - 16 * M.k, M.chLabel);
          var note = n.note ? diaWrapPx(n.note, w - 12 * M.k, M.chNote) : [];
          var h = M.padBox + lab.length * M.lhLabel +
                  (note.length ? 2 + note.length * M.lhNote : 0);
          hMax = Math.max(hMax, h);
          return { lab: lab, note: note };
        });
        slice.forEach(function (n, c) {
          pos[n.id] = {
            node: n, row: rowY.length,
            x: left + off + c * (w + DIA.colGap), y: y, w: w, h: hMax,
            lab: wrapped[c].lab, note: wrapped[c].note
          };
        });
        rowY.push(y);
        y += hMax + DIA.rowGap * (narrow ? M.k : 1);
      }
    });

    return {
      pos: pos, laneX: laneX, laneSlot: laneSlot, M: M,
      h: y - DIA.rowGap * (narrow ? M.k : 1) + DIA.padY,
      left: left, right: left + inner
    };
  }

  /* ---- connectors ----
     Every edge is orthogonal: down out of the source, across in the gap
     between rows, then down into the target. Diagonals were what cut through
     the boxes in between, and a right-angled line is also what someone
     actually draws on a whiteboard. Arrowheads stop 3px short of the border so
     the head is visible against the box edge rather than merged into it. */
  var DIA_R = 7;   /* corner radius on a routed connector */

  function diaPath(pts) {
    /* Rounded elbows through a list of points, so a routed line reads as one
       stroke rather than a staircase of separate segments. */
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i], a = pts[i - 1], b = pts[i + 1];
      var d1x = Math.sign(p[0] - a[0]), d1y = Math.sign(p[1] - a[1]);
      var d2x = Math.sign(b[0] - p[0]), d2y = Math.sign(b[1] - p[1]);
      var r = Math.min(DIA_R,
        Math.max(0, Math.hypot(p[0] - a[0], p[1] - a[1]) / 2),
        Math.max(0, Math.hypot(b[0] - p[0], b[1] - p[1]) / 2));
      d += " L" + (p[0] - d1x * r) + " " + (p[1] - d1y * r) +
           " Q" + p[0] + " " + p[1] + " " + (p[0] + d2x * r) + " " + (p[1] + d2y * r);
    }
    var e = pts[pts.length - 1];
    return d + " L" + e[0] + " " + e[1];
  }

  function diaEdge(e, L, i) {
    var a = L.pos[e.from], b = L.pos[e.to];
    if (!a || !b) return "";
    var back = e.kind === "back";
    var key = e.from + ">" + e.to;
    var lane = L.laneX[key];
    var pts, lx, ly, anchor = "middle";
    var GAP = 3;   /* arrowhead standoff */

    if (lane != null) {
      /* Long or looping. Leaving through the side at the box's own centre
         height is what drove a line straight through whatever box sat beside
         it in the same row — `grade → rewrite` passing through `retrieve` was
         exactly this. So drop out of the bottom edge into the gap below the
         row first, run sideways there where nothing is drawn, and only then
         take the lane. The same on arrival, entering through the target's top. */
      var upward = b.y < a.y;
      var sx = a.x + a.w / 2, tx = b.x + b.w / 2;
      /* Leave and arrive on the side the connector is heading, so the detour
         always uses a gap that exists. An upward loop that left through the
         source's BOTTOM had to travel below the last row — which is off the
         canvas entirely, and is why the dashed edges ran off the bottom. */
      var leaveY = upward ? a.y - GAP : a.y + a.h + GAP;
      var outY = upward ? a.y - DIA.rowGap / 2 : a.y + a.h + DIA.rowGap / 2;
      var enterY = upward ? b.y + b.h + GAP : b.y - GAP;
      var enterAt = upward ? b.y + b.h + DIA.rowGap / 2 : b.y - DIA.rowGap / 2;
      pts = [[sx, leaveY], [sx, outY], [lane, outY], [lane, enterAt], [tx, enterAt], [tx, enterY]];
      lx = lane + (back ? -6 : 6);
      /* Slide the label along its own lane by slot, so two loops running down
         the same side never write at the same height.

         The offset is measured from the TOP of the lane's vertical run rather
         than from its midpoint. Midpoint-with-a-clamp looks right until two
         lanes have a short run: the clamp then pins both offsets to nearly
         zero and the labels land on the same pixel row anyway, which is what
         put "weak" and "new query" back on top of each other. Anchoring at the
         top means slot N is always 16px below slot N-1 for as long as the run
         allows, and only the last one or two lanes on a very short run need to
         share — by which point they have been pushed apart as far as the
         geometry permits. */
      var top = Math.min(outY, enterAt), bot = Math.max(outY, enterAt);
      var slot = (L.laneSlot && L.laneSlot[key]) || 0;
      ly = Math.min(top + 14 + slot * 16, bot - 6);
      anchor = back ? "end" : "start";
    } else if (a.row === b.row) {
      var y = a.y + a.h / 2;
      var x1 = a.x + a.w, x2 = b.x - GAP;
      if (b.x < a.x) { x1 = a.x; x2 = b.x + b.w + GAP; }
      pts = [[x1, y], [x2, y]];
      lx = (x1 + x2) / 2; ly = y - 8;
    } else if (back) {
      /* Adjacent-row loop, running back up. It leaves the source's top edge
         and enters the target's bottom, through the gap the two rows share —
         offset sideways from the box centres so it never sits underneath the
         forward connector going the other way. */
      var upB = b.y < a.y;
      var sxB = a.x + a.w * 0.25, exB = b.x + b.w * 0.25;
      var leaveB = upB ? a.y - GAP : a.y + a.h + GAP;
      var enterB = upB ? b.y + b.h + GAP : b.y - GAP;
      var midB = upB ? a.y - DIA.rowGap / 2 : a.y + a.h + DIA.rowGap / 2;
      pts = [[sxB, leaveB], [sxB, midB], [exB, midB], [exB, enterB]];
      lx = (sxB + exB) / 2; ly = midB - 6;
    } else {
      /* Adjacent rows. Straight drop when the boxes line up, otherwise a
         right-angled detour through the gap between the two rows. */
      var sx = a.x + a.w / 2, ex = b.x + b.w / 2;
      var y1 = a.y + a.h, y2 = b.y - GAP;
      if (Math.abs(sx - ex) < 2) {
        pts = [[sx, y1], [sx, y2]];
        lx = sx + 7; ly = (y1 + y2) / 2 + 3; anchor = "start";
      } else {
        var midY = y1 + (b.y - y1) / 2;
        pts = [[sx, y1], [sx, midY], [ex, midY], [ex, y2]];
        lx = (sx + ex) / 2; ly = midY - 6;
      }
    }

    var cls = "dg-edge" + (back ? " is-back" : "");
    var d = diaPath(pts);
    var out = '<path class="' + cls + '" d="' + d + '" marker-end="url(#dg-ar)"/>';
    /* The flow pulse. A second copy of the same path, dashed, animated along
       its own length — so data visibly moves in the direction of the arrow.
       Purely decorative: it is behind the label, respects reduced-motion, and
       the drawing is complete and correct with it switched off. */
    out += '<path class="dg-flow' + (back ? " is-back" : "") + '" d="' + d + '"/>';
    if (e.label) {
      /* Wrap the label to whatever room it actually has beside its lane, then
         plate it so a connector never reads through the text where the two
         cross. Wrapping rather than widening the reservation is what keeps a
         long branch label — "no · skip retrieval" — from either running off a
         phone canvas or squeezing every box to make room for itself. */
      var room = anchor === "end" ? lx - 4
               : anchor === "start" ? DIA.w - lx - 4
               : DIA.w - 8;
      var ME = L.M || diaMetrics(false);
      var lines = diaWrapPx(e.label, Math.max(34 * ME.k, room), ME.chEdge);
      var tw = 0;
      lines.forEach(function (ln) { tw = Math.max(tw, diaTextW(ln, ME.chEdge)); });
      var top = ly - ME.lhEdge * 0.73 - (lines.length - 1) * ME.lhEdge / 2;
      var px = anchor === "middle" ? lx - tw / 2 - 4 : (anchor === "end" ? lx - tw - 4 : lx - 4);
      out += '<rect class="dg-eplate" x="' + px.toFixed(1) + '" y="' + top.toFixed(1) +
             '" width="' + (tw + 8).toFixed(1) + '" height="' +
             (ME.lhEdge * 1.09 + (lines.length - 1) * ME.lhEdge).toFixed(1) + '" rx="3"/>';
      lines.forEach(function (ln, i) {
        out += '<text class="dg-elabel" x="' + lx.toFixed(1) + '" y="' +
               (ly + (i - (lines.length - 1) / 2) * ME.lhEdge).toFixed(1) +
               '" text-anchor="' + anchor + '">' + esc(ln) + "</text>";
      });
    }
    return out;
  }

  function diaNode(p, M) {
    var n = p.node;
    var cls = "dg-node" + (n.accent ? " is-" + n.accent : "");
    var total = p.lab.length * M.lhLabel + (p.note.length ? 2 + p.note.length * M.lhNote : 0);
    var ty = p.y + (p.h - total) / 2 + M.lhLabel * 0.79;
    var h = '<g class="' + cls + '">' +
            '<rect x="' + p.x.toFixed(1) + '" y="' + p.y.toFixed(1) +
            '" width="' + p.w.toFixed(1) + '" height="' + p.h.toFixed(1) + '" rx="8"/>';
    p.lab.forEach(function (ln, i) {
      h += '<text class="dg-label" x="' + (p.x + p.w / 2).toFixed(1) + '" y="' +
           (ty + i * M.lhLabel).toFixed(1) + '">' + esc(ln) + "</text>";
    });
    var ny = ty + p.lab.length * M.lhLabel + 1;
    p.note.forEach(function (ln, i) {
      h += '<text class="dg-note" x="' + (p.x + p.w / 2).toFixed(1) + '" y="' +
           (ny + i * M.lhNote).toFixed(1) + '">' + esc(ln) + "</text>";
    });
    return h + "</g>";
  }

  /* A plain left-to-right sequence with an annotation under each step. Wraps to
     a grid when there are more steps than fit at a readable size, and stacks
     to one column when narrow. */
  function renderLanes(spec, narrow) {
    var lanes = spec.lanes || [];
    var M = diaMetrics(narrow);
    var perRow = narrow ? 1 : (lanes.length > 4 ? Math.ceil(lanes.length / 2) : lanes.length);
    var gap = 16;
    var inner = DIA.w - DIA.padX * 2;
    var w = (inner - gap * (perRow - 1)) / perRow;
    var body = "", y = DIA.padY, maxY = y;

    for (var s = 0; s < lanes.length; s += perRow) {
      var slice = lanes.slice(s, s + perRow);
      var wrapped = slice.map(function (l) {
        return {
          lab: diaWrapPx(l.label, w - 14 * M.k, M.chLabel),
          note: l.note ? diaWrapPx(l.note, w - 8 * M.k, M.chNote) : []
        };
      });
      var boxH = DIA.minNodeH * (narrow ? M.k : 1), noteH = 0;
      wrapped.forEach(function (x) {
        boxH = Math.max(boxH, M.padBox + x.lab.length * M.lhLabel);
        noteH = Math.max(noteH, x.note.length * M.lhNote);
      });

      slice.forEach(function (l, i) {
        var x = DIA.padX + i * (w + gap);
        var cls = "dg-node" + (l.accent ? " is-" + l.accent : "");
        body += '<g class="' + cls + '"><rect x="' + x.toFixed(1) + '" y="' + y +
                '" width="' + w.toFixed(1) + '" height="' + boxH + '" rx="8"/>';
        var ty = y + (boxH - wrapped[i].lab.length * M.lhLabel) / 2 + M.lhLabel * 0.79;
        wrapped[i].lab.forEach(function (ln, j) {
          body += '<text class="dg-label" x="' + (x + w / 2).toFixed(1) + '" y="' +
                  (ty + j * M.lhLabel).toFixed(1) + '">' + esc(ln) + "</text>";
        });
        body += "</g>";
        wrapped[i].note.forEach(function (ln, j) {
          body += '<text class="dg-note" x="' + (x + w / 2).toFixed(1) + '" y="' +
                  (y + boxH + M.lhNote * 1.27 + j * M.lhNote).toFixed(1) + '">' + esc(ln) + "</text>";
        });
        /* Connector to the next step: sideways within a row, and down the left
           edge when the sequence wraps or is stacked. */
        var isLast = (s + i) === lanes.length - 1;
        if (!isLast) {
          var d;
          if (i === slice.length - 1) {
            var ny = y + boxH + noteH + 22 * M.k;
            d = diaPath([[x + w / 2, y + boxH + noteH + 4],
                         [x + w / 2, ny - 6], [DIA.padX + w / 2, ny - 6],
                         [DIA.padX + w / 2, ny + 4]]);
            if (narrow) d = diaPath([[x + w / 2, y + boxH + noteH + 4], [x + w / 2, ny + 4]]);
          } else {
            d = "M" + (x + w + 2) + " " + (y + boxH / 2) + " H" + (x + w + gap - 3);
          }
          body += '<path class="dg-edge" d="' + d + '" marker-end="url(#dg-ar)"/>' +
                  '<path class="dg-flow" d="' + d + '"/>';
        }
      });
      y += boxH + noteH + 26 * M.k;
      maxY = y;
    }
    return { body: body, h: maxY - 26 * M.k + DIA.padY + 8 };
  }

  function diaSvg(spec, narrow, cls) {
    var body, h;
    if (spec.kind === "lanes") {
      var lr = renderLanes(spec, narrow);
      body = lr.body; h = lr.h;
    } else {
      var L = diaLayout(spec, narrow);
      h = L.h;
      body = "";
      /* Edges first so a box always paints over a line, never under it. */
      (spec.edges || []).forEach(function (e, i) { body += diaEdge(e, L, i); });
      Object.keys(L.pos).forEach(function (id) { body += diaNode(L.pos[id], L.M); });
    }
    return '<svg class="dg ' + cls + '" viewBox="0 0 ' + DIA.w + " " + Math.round(h) + '" ' +
           'preserveAspectRatio="xMidYMin meet" role="img" ' +
           'aria-label="' + esc(spec.alt || spec.caption || "Diagram") + '">' +
           '<defs><marker id="dg-ar" viewBox="0 0 10 10" refX="8.5" refY="5" ' +
           'markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">' +
           '<path d="M0.5 1 L9 5 L0.5 9 z"/></marker></defs>' + body + "</svg>";
  }

  /* Both widths are rendered up front and swapped with a media query. A resize
     listener would mean re-rendering inside an open <details>, which fights the
     open/close height animation; two static SVGs cost a few KB and never do. */
  function renderDiagram(spec) {
    if (!spec) return "";
    if (spec.kind === "lanes" ? !(spec.lanes || []).length : !(spec.rows || []).length) return "";
    return '<figure class="q-diagram">' +
      '<b class="slot-label">Draw this on the board</b>' +
      '<div class="dg-frame">' +
      diaSvg(spec, false, "dg-wide") +
      diaSvg(spec, true, "dg-narrow") +
      "</div>" +
      (spec.caption ? "<figcaption>" + fmt(spec.caption) + "</figcaption>" : "") +
      "</figure>";
  }
  IR.renderDiagram = renderDiagram;


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
    /* Before the code, after the explanation: on a whiteboard you draw the
       shape while you talk, and the code is what you would write afterwards. */
    if (c.diagram) {
      h += renderDiagram(c.diagram);
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

  /* ---------- filter bar auto-hide ----------
     Reading a page means going down it, so the bar gets out of the way on the
     way down and returns the instant you scroll back up — filtering is almost
     always something you decide to do after looking back at something. The
     small threshold keeps the trackpad's own jitter from flickering it. */
  function autoHideOnScroll(bar) {
    var last = window.pageYOffset || 0;
    var ticking = false;
    var THRESHOLD = 6;

    function busy() {
      /* An active filter session is the caret sitting in the bar. Hiding it
         mid-edit would pull the field out from under the person typing. */
      return bar.contains(document.activeElement);
    }

    function update() {
      ticking = false;
      var y = window.pageYOffset || 0;
      var delta = y - last;
      if (Math.abs(delta) < THRESHOLD) return;
      last = y;
      if (busy()) return;
      /* Near the top there is nothing to gain by hiding, and the collapse
         reads as a glitch on a short page. */
      if (delta > 0 && y > 120) bar.classList.add("is-hidden");
      else if (delta < 0) bar.classList.remove("is-hidden");
    }

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    /* A hidden bar is visibility:hidden, so tabbing skips it entirely and
       focusin can never fire on it — the keyboard route back has to be an
       explicit one. "/" brings it back and puts the caret in the box, which is
       what then keeps it open via busy(). */
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var t = ev.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      ev.preventDefault();
      bar.classList.remove("is-hidden");
      var input = bar.querySelector("input");
      /* Deferred: focus() does not take on an element the browser still had as
         visibility:hidden when the key was dispatched. */
      if (input) setTimeout(function () { input.focus(); }, 0);
    });
  }

  /* ---------- filter bar + list ---------- */
  function mountList(host, cards, opts) {
    opts = opts || {};
    var state = { text: "", tag: "" };

    var tags = {};
    cards.forEach(function (c) { (c.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
    var topTags = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).slice(0, 12);

    var bar = el("div", "filters");
    bar.innerHTML =
      '<div class="search-wrap"><span class="search-icon">⌕</span>' +
      '<input type="search" placeholder="Search questions" aria-label="Search questions"></div>' +
      (topTags.length ? '<div class="filter-tags" data-row="tag">' +
        topTags.map(function (t) {
          return '<button class="pill" type="button" aria-pressed="false" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
        }).join("") + "</div>" : '<div class="filter-tags"></div>') +
      '<span class="filter-actions"><span class="result-count"></span>' +
      '<button class="mini-btn" type="button" data-reset>Reset</button></span>';

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
        var val = p.getAttribute("data-tag");
        var on = state.tag !== val;
        state.tag = on ? val : "";
        Array.prototype.forEach.call(bar.querySelectorAll("[data-tag]"), function (x) {
          x.setAttribute("aria-pressed", String(on && x === p));
        });
        apply();
        return;
      }
      if (e.target.closest("[data-reset]")) {
        state = { text: "", tag: "" };
        bar.querySelector("input").value = "";
        Array.prototype.forEach.call(bar.querySelectorAll(".pill"), function (x) {
          x.setAttribute("aria-pressed", "false");
        });
        apply();
      }
    });

    apply();
    autoHideOnScroll(bar);

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
      /* The id sits on the heading as well as the section: the right rail
         indexes `h2[id]`, and an id one level up leaves this page — the longest
         one in the portal — without a contents list. The section keeps its own
         id so existing #track-… links still land. */
      h += '<h2 id="h-track-' + esc(t.key) + '">' + esc(t.label) + "</h2>";
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


  /* ---------- right rail: "on this page" ----------
     The parent portal's chapter-contents rail (assets/app.js buildTOC), ported
     with its behaviour intact: a filterable list on desktop, a "Jump to
     section" dropdown on tablet and phone, an IntersectionObserver marking the
     active entry, and the scroll-direction auto-hide on the mobile bar.

     What it indexes differs, and has to. The parent's chapters are prose under
     `h2[id]`. A topic page here is a flat list of question cards, so those are
     the sections — the rail lists `h2[id]` when a page has them (rounds,
     tracks) and falls back to the question cards when it does not. Either way
     each entry is a numbered anchor, which is what the parent's rail is.

     `.toc-open` goes on `.toc` rather than on `.toc-rail`, which is the
     parent's convention: the mobile dropdown CSS is written against the <nav>,
     and putting the class one level up makes it silently never open. */
  function buildRail() {
    var content = document.querySelector(".content");
    if (!content || document.querySelector(".toc-rail")) return;

    /* Section headings in the document flow. A card's <summary> is not one. */
    var heads = Array.prototype.filter.call(
      content.querySelectorAll("h2[id]"),
      function (h) { return !h.closest("dialog") && !h.closest(".q-card"); }
    );
    var kind = "section";
    if (!heads.length) {
      heads = Array.prototype.slice.call(content.querySelectorAll(".q-card[id]"));
      kind = "question";
    }
    /* One entry is not a table of contents. */
    if (heads.length < 2) return;

    function labelFor(node) {
      if (kind === "section") return node.textContent.trim();
      var t = node.querySelector(".q-title");
      if (!t) return node.id;
      /* .q-meta is the chip row inside the title; it is not part of the question. */
      var clone = t.cloneNode(true);
      var meta = clone.querySelector(".q-meta");
      if (meta) meta.remove();
      return clone.textContent.trim();
    }

    var rail = el("aside", "toc-rail");
    var nav = el("nav", "toc");
    nav.setAttribute("aria-label", "On this page");
    rail.appendChild(nav);

    var items = heads.map(function (node, i) {
      var full = labelFor(node);
      var m = full.match(/^\s*(\d+)\s*[.·)]\s*/);
      var num = String(m ? m[1] : i + 1);
      if (num.length < 2) num = "0" + num;
      return { id: node.id, num: num, full: full };
    });

    nav.innerHTML =
      '<button type="button" class="toc-toggle" aria-expanded="false" ' +
        'aria-label="Jump to a section on this page">' +
        '<svg class="toc-toggle-ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
          'stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>' +
        '<span class="toc-toggle-label">Jump to ' + (kind === "question" ? "question" : "section") + "</span>" +
        '<svg class="toc-toggle-caret" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
          'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="m6 9 6 6 6-6"/></svg>' +
      "</button>" +
      '<div class="toc-book-head">' +
        '<div><span class="toc-kicker">On this page</span>' +
        "<strong>" + items.length + " " + (kind === "question" ? "questions" : "topics") + "</strong></div>" +
        '<button type="button" class="toc-top" aria-label="Back to top" title="Back to top">↑</button>' +
      "</div>" +
      '<label class="toc-filter">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/>' +
          '<path d="m16 16 4 4"/></svg>' +
        '<input type="search" placeholder="Find on this page" aria-label="Find on this page">' +
      "</label>" +
      '<div class="toc-list">' +
        items.map(function (it) {
          return '<a href="#' + esc(it.id) + '" data-toc="' + esc(it.id) + '" title="' + esc(it.full) + '">' +
            '<span class="toc-num">' + esc(it.num) + "</span>" +
            '<span class="toc-label">' + esc(it.full) + "</span></a>";
        }).join("") +
        '<div class="toc-empty" hidden>No match on this page</div>' +
      "</div>";

    /* The rail is a grid sibling of .content, so both move into a wrapper. */
    var main = content.parentNode;
    var wrap = el("div", "content-wrap");
    main.insertBefore(wrap, content);
    wrap.appendChild(content);
    wrap.appendChild(rail);

    var toggle = nav.querySelector(".toc-toggle");
    var toggleLabel = nav.querySelector(".toc-toggle-label");
    var links = Array.prototype.slice.call(nav.querySelectorAll("[data-toc]"));
    var filter = nav.querySelector(".toc-filter input");
    var empty = nav.querySelector(".toc-empty");
    var top = nav.querySelector(".toc-top");

    function setOpen(open) {
      nav.classList.toggle("toc-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function (ev) {
      ev.stopPropagation();
      setOpen(!nav.classList.contains("toc-open"));
    });
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        setOpen(false);
        /* On a question page the target is a <details>; jumping to a closed one
           lands on a bare summary, so open it the way a deep link does. */
        var t = document.getElementById(a.getAttribute("data-toc"));
        if (t && t.tagName === "DETAILS") t.open = true;
      });
    });
    document.addEventListener("click", function (ev) {
      if (!nav.contains(ev.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") setOpen(false);
    });

    if (top) top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    if (filter) filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      var shown = 0;
      links.forEach(function (a) {
        var vis = !q || (a.title || "").toLowerCase().indexOf(q) >= 0 ||
                  a.textContent.toLowerCase().indexOf(q) >= 0;
        a.hidden = !vis;
        if (vis) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });

    if (typeof IntersectionObserver === "function") {
      var list = nav.querySelector(".toc-list");
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var active = null;
          links.forEach(function (a) {
            var on = a.getAttribute("data-toc") === en.target.id;
            a.classList.toggle("active", on);
            if (on) active = a;
          });
          if (active && list) active.scrollIntoView({ block: "nearest" });
          if (active && toggleLabel) {
            var lbl = active.querySelector(".toc-label");
            if (lbl) toggleLabel.textContent = lbl.textContent;
          }
        });
      }, { rootMargin: "-72px 0px -72% 0px" });
      heads.forEach(function (h) { obs.observe(h); });
    }

    /* Mobile bar auto-hide: slide away on scroll-down, return on scroll-up.
       The hidden transform is mobile-only in CSS, so this is inert on desktop. */
    var lastY = window.scrollY;
    var ticking = false;
    function evaluate() {
      ticking = false;
      var y = Math.max(0, window.scrollY);
      var d = y - lastY;
      if (Math.abs(d) < 6) return;
      if (y <= 100 || d < 0) {
        rail.classList.remove("toc-rail-hidden");
      } else {
        rail.classList.add("toc-rail-hidden");
        setOpen(false);
      }
      lastY = y;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(evaluate); }
    }, { passive: true });
  }


  /* ---------- sidebar search ----------
     The filter bar on a topic page does substring matching on that page's own
     cards. This is a different tool and deliberately so: it searches the whole
     portal from every page, and it matches on meaning rather than on letters.

     The requirement that shapes the whole design: "llm tabular data" has to
     find a card that says "table" and "LLM". A substring test cannot do that —
     "tabular" is not a substring of "table", and no card contains the phrase
     as typed. So the query is broken into words and each word is scored
     independently against an inverted index, with four ways to match:

       exact       tabular = tabular          strongest
       prefix      tabul... -> tabular        strong; this is what live typing
                                              produces on the way to a word
       stem        tabular -> tabul <- table  the case above
       fuzzy       tabuler ~ tabular          one typo, edit distance 1

     A card scores by how many query words it matched and how well, weighted by
     where the word appears (a title hit outranks a hit deep in prose) and by
     how rare the word is across the corpus (idf — "model" appears in half the
     cards and tells you almost nothing; "hnsw" appears in three and tells you
     everything). Cards matching more of the query always outrank cards matching
     fewer, whatever the individual word scores. */

  /* Mirrors tokens() in tools/build-search-index.js. If these two disagree the
     index is unsearchable — a word split one way at build time and another way
     here simply never matches. Change one, change both. */
  var SEARCH_STOP = {};
  ("a an and are as at be but by for from has have how i in is it its of on or "
   + "that the this to was what when where which who why will with you your do does did "
   + "not no so if then than there their they we us our can could would should may might")
    .split(" ").forEach(function (w) { SEARCH_STOP[w] = 1; });

  function searchTokens(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .split(/[\s\-_.]+/)
      .filter(function (w) { return w.length >= 2 && !SEARCH_STOP[w]; });
  }

  /* A crude, deliberately conservative suffix strip. It exists to collapse the
     handful of English endings that separate a query word from the same idea
     written differently — tabular/table, chunking/chunk, embeddings/embedding.
     It is not a real stemmer (Porter would fold far more aggressively and
     start producing false matches in a corpus this technical); it only has to
     be good enough that the plural and the participle of a term meet. */
  function stem(w) {
    if (w.length <= 4) return w;
    var s = w
      .replace(/(ational|ization|isation)$/, "")
      .replace(/(iveness|fulness|ousness)$/, "")
      .replace(/(ability|ibility)$/, "")
      .replace(/(ations|itions)$/, "")
      .replace(/(ular|ulary)$/, "")
      .replace(/(ings|ing)$/, "")
      .replace(/(edly|ed)$/, "")
      .replace(/(ies)$/, "y")
      .replace(/(es|s)$/, "")
      .replace(/(ly)$/, "")
      .replace(/(ions|ion)$/, "");
    /* Never stem a word down to nothing meaningful. */
    return s.length >= 3 ? s : w;
  }

  /* Bounded edit distance. Returns true if a and b are within `max` edits.
     Bailing out on the length gap first is what keeps this cheap enough to run
     across a whole vocabulary on every keystroke. */
  function within(a, b, max) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > max) return false;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur[0] = i;
      var best = cur[0];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(
          prev[j] + 1,
          cur[j - 1] + 1,
          prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
        );
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return false;   /* whole row already too far — stop */
      for (j = 0; j <= b.length; j++) prev[j] = cur[j];
    }
    return prev[b.length] <= max;
  }

  /* Built once, lazily, on first use: term id -> list of card indices, plus the
     stem map that lets a query word reach words it is not spelled like. */
  var SX = null;
  function searchIndex() {
    if (SX) return SX;
    var ix = IR.searchIndex;
    if (!ix) return null;

    var postings = {};      /* term id -> [card index, ...] */
    var byStem = {};        /* stem -> [term id, ...] */
    var i, j;

    for (i = 0; i < ix.cards.length; i++) {
      var b = ix.cards[i].b;
      for (j = 0; j < b.length; j++) {
        (postings[b[j]] || (postings[b[j]] = [])).push(i);
      }
    }
    for (i = 0; i < ix.vocab.length; i++) {
      var st = stem(ix.vocab[i]);
      (byStem[st] || (byStem[st] = [])).push(i);
    }

    /* Title and tag terms are held separately so a hit there can outweigh the
       same word buried in an answer. */
    var titleTerms = [], tagTerms = [];
    for (i = 0; i < ix.cards.length; i++) {
      var t = {}, g = {};
      searchTokens(ix.cards[i].q).forEach(function (w) { t[w] = 1; });
      searchTokens(ix.cards[i].g).forEach(function (w) { g[w] = 1; });
      titleTerms.push(t); tagTerms.push(g);
    }

    /* Topic rows are searched alongside cards so that typing a subject name
       offers the topic page itself, not only the questions inside it. Inverted
       the same way as the cards — scanning every topic bag per term was both
       slower and, because bag entries are numbers and Object.keys hands back
       strings, quietly never matched. */
    var topicPostings = {};
    for (i = 0; i < ix.topics.length; i++) {
      var tb = ix.topics[i].b;
      for (j = 0; j < tb.length; j++) {
        (topicPostings[tb[j]] || (topicPostings[tb[j]] = [])).push(i);
      }
    }
    /* A topic title hit is the strongest signal this index has — it is the
       name of the subject, not a word inside an answer about it. */
    var topicTitleTerms = ix.topics.map(function (t) {
      var m = {};
      searchTokens(t.t).forEach(function (w) { m[w] = 1; });
      return m;
    });

    SX = {
      ix: ix, postings: postings, byStem: byStem,
      titleTerms: titleTerms, tagTerms: tagTerms,
      topicPostings: topicPostings, topicTitleTerms: topicTitleTerms,
      n: ix.cards.length
    };
    return SX;
  }

  /* Every vocabulary term a single query word should reach, each with a weight
     for how good that kind of match is. */
  function expand(word, sx) {
    var ix = sx.ix, out = {}, i;
    var w = word, st = stem(word);

    function add(termId, weight) {
      if (out[termId] === undefined || out[termId] < weight) out[termId] = weight;
    }

    for (i = 0; i < ix.vocab.length; i++) {
      var v = ix.vocab[i];
      if (v === w) { add(i, 1); continue; }
      /* Prefix: what a half-typed word looks like. Also catches the common
         "embedding" vs "embeddings" case without needing the stemmer. */
      if (v.length > w.length && v.indexOf(w) === 0) { add(i, w.length >= 4 ? 0.85 : 0.6); continue; }
      if (w.length > v.length && w.indexOf(v) === 0 && v.length >= 4) { add(i, 0.7); continue; }
    }
    /* Stem class: tabular and table both reduce to tab-, so each reaches the
       other even though neither is a prefix or a near-spelling of the other. */
    var fam = sx.byStem[st];
    if (fam) for (i = 0; i < fam.length; i++) add(fam[i], 0.65);

    /* Typos, but only for words long enough that one edit is not a different
       word entirely — at 3 letters "rag" and "tag" are one edit apart. */
    if (w.length >= 5) {
      for (i = 0; i < ix.vocab.length; i++) {
        if (out[i] !== undefined) continue;
        if (within(w, ix.vocab[i], 1)) add(i, 0.5);
      }
    }
    return out;
  }

  /* Score every card against the query. Returns ranked results, cards and
     topics together, best first. */
  function runSearch(query) {
    var sx = searchIndex();
    if (!sx) return [];
    var words = searchTokens(query);
    if (!words.length) return [];

    var ix = sx.ix;
    var scores = {};        /* card index -> accumulated score */
    var hits = {};          /* card index -> how many distinct query words hit */
    var tScores = {};       /* topic index -> score */
    var tHits = {};

    words.forEach(function (word) {
      var expansion = expand(word, sx);
      var termIds = Object.keys(expansion);
      var touched = {};
      var tTouched = {};

      termIds.forEach(function (tid) {
        var weight = expansion[tid];
        var list = sx.postings[tid];
        var term = ix.vocab[tid];

        /* Topics carry their own small bag (title + blurb) and are scored on
           the same expansion, so "vector database" surfaces topic 04 itself. */
        var tList = sx.topicPostings[tid];
        if (tList) {
          for (var t = 0; t < tList.length; t++) {
            var ti = tList[t];
            var ts = weight * (sx.topicTitleTerms[ti][term] ? 3.2 : 1);
            if (!tTouched[ti] || tTouched[ti] < ts) tTouched[ti] = ts;
          }
        }

        if (!list || !list.length) return;
        /* Rarity: a word in three cards is worth far more than one in half of
           them. Damped with a log so a rare term does not swamp everything. */
        var idf = Math.log(1 + sx.n / list.length);

        for (var i = 0; i < list.length; i++) {
          var ci = list[i];
          var s = weight * idf;
          /* Where it appeared. A question title is what the card is about; the
             body is merely what it mentions. */
          if (sx.titleTerms[ci][term]) s *= 3.2;
          else if (sx.tagTerms[ci][term]) s *= 2.4;

          if (!touched[ci] || touched[ci] < s) touched[ci] = s;
        }
      });

      Object.keys(touched).forEach(function (ci) {
        scores[ci] = (scores[ci] || 0) + touched[ci];
        hits[ci] = (hits[ci] || 0) + 1;
      });
      Object.keys(tTouched).forEach(function (ti) {
        tScores[ti] = (tScores[ti] || 0) + tTouched[ti];
        tHits[ti] = (tHits[ti] || 0) + 1;
      });
    });

    var out = [];
    Object.keys(scores).forEach(function (ci) {
      var i = +ci;
      /* Coverage dominates raw score: a card matching every word of the query
         must beat one matching a single word very strongly. Without this,
         "llm tabular data" ranks a card that says "LLM" forty times above the
         one card that actually discusses tables. */
      var coverage = hits[i] / words.length;
      out.push({
        kind: "card", card: ix.cards[i],
        score: scores[i] * (coverage * coverage), hits: hits[i]
      });
    });
    Object.keys(tScores).forEach(function (ti) {
      var i = +ti;
      var coverage = tHits[i] / words.length;
      /* Topic rows are few and broad. The 1.6 lifts a genuine subject-name
         match above the individual questions inside it, which is what someone
         typing a subject name is asking for. */
      out.push({
        kind: "topic", topic: ix.topics[i],
        score: tScores[i] * (coverage * coverage) * 1.6, hits: tHits[i]
      });
    });

    /* A multi-word query should not return everything mentioning any one word.
       Requiring half the words keeps the result list about the query. */
    var need = words.length >= 3 ? 2 : 1;
    out = out.filter(function (r) { return r.hits >= need; });

    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 40);
  }
  IR.runSearch = runSearch;

  /* ---------- previous / next pager ----------
     One linear reading order for the whole portal, in exactly the order the
     sidebar lists it: the four route pages, then the eighteen topics. Both the
     rail and this pager read `sequence()`, so a topic added to IR.topics shows
     up in the pager without a second registry to keep in sync.

     Planned topics are skipped rather than linked: their pages render greyed
     out from the same manifest, and stepping "next" into a page with no
     questions on it is a dead end, not a step forward.

     The markup mirrors the roadmap portal's `.page-nav` — a wrapping flex row
     of link cards, direction label above, page title below — so the two sites
     read as one family. */
  var ROUTE_PAGES = [
    { page: "home",      href: "index.html",     label: "Home" },
    { page: "rounds",    href: "rounds.html",    label: "By interview round" },
    { page: "tracks",    href: "tracks.html",    label: "By employer type" },
    { page: "rehearsal", href: "rehearsal.html", label: "Rehearsal room" }
  ];

  function sequence() {
    var seq = ROUTE_PAGES.map(function (r) {
      return { href: r.href, title: r.label, page: r.page, topic: null };
    });
    (IR.topics || []).forEach(function (t) {
      if (t.status !== "live") return;
      var key = t.num + "-" + t.slug;
      seq.push({
        href: "topics/" + key + ".html",
        title: t.title,
        page: "topic",
        topic: key,
        num: t.num
      });
    });
    return seq;
  }

  /* Identify the current page inside the sequence. A topic page is matched on
     its `data-topic` key, not on data-page, because all eighteen share the
     same data-page value. */
  function hereIndex(seq) {
    var page = document.body.getAttribute("data-page");
    var topic = document.body.getAttribute("data-topic");
    for (var i = 0; i < seq.length; i++) {
      if (seq[i].page !== page) continue;
      if (page === "topic") { if (seq[i].topic === topic) return i; }
      else return i;
    }
    return -1;
  }

  function pagerCard(entry, dir, cls) {
    return '<a class="' + cls + '" href="' + depth() + entry.href + '">' +
           '<span class="pn-dir">' + dir + "</span>" +
           '<span class="pn-ttl">' +
           (entry.num ? '<span class="pn-num">' + esc(entry.num) + "</span> " : "") +
           esc(entry.title) + "</span></a>";
  }

  function buildPager() {
    var content = document.querySelector(".content");
    if (!content || content.querySelector("[data-page-nav]")) return;

    var seq = sequence();
    var i = hereIndex(seq);
    if (i < 0) return;

    var prev = i > 0 ? seq[i - 1] : null;
    var next = i < seq.length - 1 ? seq[i + 1] : null;
    if (!prev && !next) return;

    var h = '<nav class="page-nav" data-page-nav aria-label="Previous and next page">';
    h += '<p class="pn-progress">Page ' + (i + 1) + " of " + seq.length + "</p>";
    if (prev) h += pagerCard(prev, "← Previous", "pn-link pn-prev");
    if (next) h += pagerCard(next, "Next →", "pn-link pn-next");
    h += "</nav>";

    var nav = el("div", null, h);
    content.appendChild(nav.firstChild);
  }

  IR.buildPager = buildPager;


  /* ---------- smooth card open/close ----------
     A <details> element has no in-between state: the moment `open` flips, the
     browser reflows to the full height in a single frame. The old CSS animated
     only the body's opacity and a 5px slide, so the card snapped to its final
     size while the text faded in behind — the jump was the layout, and no
     amount of tuning the fade could hide it.

     So the height itself has to be animated, and that means taking over the
     toggle: on open, let the element open (the content has no height until it
     is in the layout), measure it, then animate from 0 to that height. On
     close, animate down first and only flip `open` off at the end, or the
     content vanishes before the animation can play.

     Web Animations rather than CSS transitions, because each card animates
     to its own measured height — a value CSS cannot know — and because an
     animation can be cancelled cleanly mid-flight when someone clicks the same
     card twice quickly, which is exactly when height animations usually break.

     `interpolate-size: allow-keywords` would let CSS transition to height:auto
     natively, but it is Chrome-only at time of writing; this path works
     everywhere and degrades to the native snap where WAAPI is missing. */

  var CARD_OPEN_MS = 260;
  var CARD_CLOSE_MS = 200;

  function prefersReducedMotion() {
    return window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function animateCard(card) {
    var body = card.querySelector(".q-body");
    if (!body || typeof card.animate !== "function") return false;

    /* A card mid-animation carries its own; cancel it so a fast second click
       starts from where the card actually is rather than fighting it. */
    if (card._anim) { card._anim.cancel(); card._anim = null; }
    card.classList.remove("is-closing");
    return body;
  }

  function openCard(card) {
    var body = animateCard(card);
    if (body === false) { card.open = true; return; }

    card.open = true;              /* in the layout, so it can be measured */
    /* offsetHeight, not scrollHeight: it includes the body's own padding, and
       the padding is animated alongside the height below. Measuring the two
       apart is how these animations end with a visible jolt on the last frame. */
    var h = body.offsetHeight;
    var pad = window.getComputedStyle(body);
    var padTop = pad.paddingTop, padBottom = pad.paddingBottom;
    card.classList.add("is-animating");

    /* The body is the thing that grows — animating the card wrapper would
       collapse the summary row along with it. Padding collapses with the
       height so the content does not appear to sit in a gap on frame one. */
    var anim = body.animate(
      [
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0 },
        { height: h + "px", paddingTop: padTop, paddingBottom: padBottom, opacity: 1 }
      ],
      { duration: CARD_OPEN_MS, easing: "cubic-bezier(.4, 0, .2, 1)" }
    );
    card._anim = anim;
    anim.onfinish = function () {
      card.classList.remove("is-animating");
      card._anim = null;
    };
    anim.oncancel = function () {
      card.classList.remove("is-animating");
      card._anim = null;
    };
  }

  function closeCard(card) {
    var body = animateCard(card);
    if (body === false) { card.open = false; return; }

    var h = body.offsetHeight;
    var pad = window.getComputedStyle(body);
    var padTop = pad.paddingTop, padBottom = pad.paddingBottom;
    card.classList.add("is-animating");
    /* `open` cannot come off yet — the content is still being animated out —
       but every [open] rule (chevron rotation, the accent number badge, the
       border) would otherwise hold its open look for the whole close and then
       snap at the last frame. This class lets those rules stand down now, so
       the furniture animates out in step with the height. */
    card.classList.add("is-closing");

    var anim = body.animate(
      [
        { height: h + "px", paddingTop: padTop, paddingBottom: padBottom, opacity: 1 },
        { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0 }
      ],
      { duration: CARD_CLOSE_MS, easing: "cubic-bezier(.4, 0, .2, 1)" }
    );
    card._anim = anim;
    anim.onfinish = function () {
      card.open = false;           /* only now — the animation needed the content */
      card.classList.remove("is-animating");
      card.classList.remove("is-closing");
      card._anim = null;
    };
    anim.oncancel = function () {
      card.classList.remove("is-animating");
      card.classList.remove("is-closing");
      card._anim = null;
    };
  }

  /* One delegated listener rather than one per card: the lists are rebuilt on
     every filter change, and per-card listeners would have to be rebound each
     time. Bound on the document so it covers every page that renders cards. */
  function initCardAnimation() {
    document.addEventListener("click", function (e) {
      var summary = e.target.closest && e.target.closest(".q-card > summary");
      if (!summary) return;
      var card = summary.parentNode;

      /* Reduced motion keeps the native instant toggle — the browser default is
         already the no-motion behaviour, so the correct thing is to not
         interfere at all. */
      if (prefersReducedMotion()) return;

      e.preventDefault();          /* we drive the state ourselves */
      if (card.open) closeCard(card); else openCard(card);
    });

    /* Keyboard: a <summary> fires a click on Enter/Space, so the handler above
       already covers it. Nothing extra needed. */
  }

  /* ---------- go ---------- */
  function boot() {
    IR.initTheme();
    buildSidebar();
    buildTopbar();
    initCardAnimation();
    var page = document.body.getAttribute("data-page");
    if (page === "topic") bootTopic();
    else if (page === "home") bootIndex();
    else if (page === "rounds") bootRounds();
    else if (page === "tracks") bootTracks();
    /* After the page bootstraps, never before: the rail indexes rendered
       content, and on a topic page none of it exists until bootTopic runs. */
    buildRail();
    buildPager();
    document.dispatchEvent(new CustomEvent("ir:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
