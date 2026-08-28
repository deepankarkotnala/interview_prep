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
  var SIDEBAR_KEY = "ir.sidebar";

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
  function slug(t) {
    return String(t || "").toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50) || "section";
  }

  /* ---------- topbar icons ---------- */
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
    document.dispatchEvent(new CustomEvent("ir:delivered", { detail: { id: id, on: on } }));
  }

  /* ---------- card counting ---------- */
  function cardsFor(slugKey) {
    var set = IR.q[slugKey];
    return set && set.cards ? set.cards : [];
  }
  function allCards() {
    var out = [];
    (IR.topics || []).forEach(function (t) {
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
    h += '<a href="' + base + 'index.html" class="brand" style="text-decoration: none; color: inherit;" aria-label="Go to homepage">' +
         '<span class="brand-mark" aria-hidden="true">' +
         '<img src="' + base + 'assets/brand/interview-room-logo.png?v=3" alt="" ' +
         'onerror="this.remove();this.parentNode.textContent=\'IR\'">' +
         '</span>' +
         '<span class="brand-text"><strong>Interview Room</strong>' +
         '<span>GenAI · India · Senior</span></span></a>';

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
    (IR.topics || []).forEach(function (t) {
      var key = t.num + "-" + t.slug;
      var on = here === key;
      var live = t.status === "live";
      h += '<a class="nav-link' + (on ? " active" : "") + (live ? "" : " is-planned") + '" ' +
           'href="' + base + "topics/" + key + '.html"' +
           (on ? ' aria-current="page"' : "") + '>' +
           '<span class="nav-num">' + esc(t.num) + '</span>' +
           '<span class="nav-title">' + esc(t.title) + '</span>' +
           (live ? '' : '<span class="nav-pill">planned</span>') + '</a>';
    });
    h += "</div></div>";

    host.innerHTML = h;
    buildSearch(host);
  }

  /* ---------- sidebar search ---------- */
  function buildSearch(host) {
    var box = host.querySelector("[data-search-box]");
    if (!box) return;
    var input = box.querySelector("input");
    var results = host.querySelector("[data-search-results]");
    var nav = host.querySelector("[data-nav-groups]");
    var clear = box.querySelector(".sb-clear");
    var base = depth();

    function setOpen(on) {
      results.hidden = !on;
      nav.hidden = on;
      clear.hidden = !on;
      host.classList.toggle("is-searching", on);
    }

    function render(rows, query) {
      if (!rows.length) {
        results.innerHTML = '<p class="sb-empty">No match for <strong>' +
          esc(query) + '</strong>.<br>Try a shorter phrase or a single term.</p>';
        return;
      }
      var h = "";
      var topics = rows.filter(function (r) { return r.kind === "topic"; });
      if (topics.length) {
        h += '<div class="sb-sec">Topics</div>';
        topics.slice(0, 4).forEach(function (r) {
          var t = r.topic;
          var live = t.status === "live";
          h += '<a class="sb-hit sb-hit-topic' + (live ? "" : " is-planned") + '" href="' +
            base + "topics/" + t.num + "-" + t.slug + '.html">' +
            '<span class="sb-num">' + esc(t.num) + '</span>' +
            '<span class="sb-title">' + esc(t.title) + '</span></a>';
        });
      }
      var cards = rows.filter(function (r) { return r.kind === "card"; });
      if (cards.length) {
        h += '<div class="sb-sec">Questions</div>';
        cards.slice(0, 15).forEach(function (r) {
          var c = r.card;
          var key = c._topic ? c._topic.num + "-" + c._topic.slug : "";
          h += '<a class="sb-hit" href="' + base + "topics/" + key + '.html#' + esc(c.id) + '">' +
            '<span class="sb-title">' + fmt(c.q) + '</span>' +
            (c._topic ? '<span class="sb-sub">' + esc(c._topic.title) + '</span>' : '') + '</a>';
        });
      }
      results.innerHTML = h;
    }

    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) { setOpen(false); return; }
      setOpen(true);
      var rows = [];
      (IR.topics || []).forEach(function (t) {
        if (t.title.toLowerCase().indexOf(q) >= 0 || t.blurb.toLowerCase().indexOf(q) >= 0) {
          rows.push({ kind: "topic", topic: t });
        }
      });
      allCards().forEach(function (c) {
        var hay = (c.q + " " + (c.why || "") + " " + (c.simple || "") + " " + (c.say || "")).toLowerCase();
        if (hay.indexOf(q) >= 0) {
          rows.push({ kind: "card", card: c });
        }
      });
      render(rows, q);
    }

    input.addEventListener("input", function (e) { search(e.target.value); });
    clear.addEventListener("click", function () { input.value = ""; setOpen(false); input.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
      if (e.key === "Escape" && !results.hidden) {
        input.value = ""; setOpen(false); input.blur();
      }
    });
  }

  /* ---------- sidebar toggle (desktop collapse + mobile drawer) ---------- */
  function setupSidebarToggle() {
    var app = document.querySelector(".app");
    var menuBtn = document.querySelector(".menu-btn");
    if (!app || !menuBtn) return;

    var saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved === "collapsed" && window.innerWidth > 860) {
      app.classList.add("sidebar-collapsed");
    }

    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (window.innerWidth <= 860) {
        document.body.classList.toggle("nav-open");
      } else {
        var collapsed = app.classList.toggle("sidebar-collapsed");
        localStorage.setItem(SIDEBAR_KEY, collapsed ? "collapsed" : "open");
      }
    });

    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 860 && document.body.classList.contains("nav-open")) {
        var sb = document.querySelector(".sidebar");
        if (sb && !sb.contains(e.target) && !menuBtn.contains(e.target)) {
          document.body.classList.remove("nav-open");
        }
      }
    });
  }

  /* ---------- focus mode ---------- */
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
      document.dispatchEvent(new CustomEvent("ir-focus-change", { detail: { focus: active } }));
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
      var tag = document.activeElement && document.activeElement.tagName;
      if (/INPUT|TEXTAREA|SELECT/.test(tag || "")) return;
      ev.preventDefault();
      btn.click();
    });
  }

  /* ---------- Display panel ---------- */
  var READING_KEY = "ir.reading";
  var SIZES = ["xs", "s", "m", "l", "xl"];
  var WIDTHS = ["default", "wide", "full"];
  var ALIGNS = ["left", "justify"];

  function defaultSize() {
    return window.matchMedia && window.matchMedia("(max-width:860px)").matches ? "s" : "xs";
  }
  function readReading() {
    var raw = store(READING_KEY, {});
    return {
      size: SIZES.indexOf(raw.size) >= 0 ? raw.size : defaultSize(),
      width: WIDTHS.indexOf(raw.width) >= 0 ? raw.width : "default",
      align: ALIGNS.indexOf(raw.align) >= 0 ? raw.align : "left"
    };
  }
  function applyReading(s) {
    var doc = document.documentElement;
    doc.setAttribute("data-reading-size", s.size);
    var isFocus = document.body.classList.contains("focus-mode");
    var effectiveWidth = (!isFocus && s.width === "full") ? "wide" : s.width;
    doc.setAttribute("data-reading-width", effectiveWidth);
    doc.setAttribute("data-reading-align", s.align);
  }
  IR.initReading = function () { applyReading(readReading()); };

  function buildDisplay(host) {
    var wrap = host.querySelector(".reader-wrap");
    var trigger = wrap && wrap.querySelector(".reader-btn");
    if (!trigger) return;

    var settings = readReading();
    applyReading(settings);

    var panel = el("div", "reader-popover");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Reading and display settings");
    panel.setAttribute("aria-hidden", "true");

    var scrim = el("div", "reader-scrim");
    scrim.setAttribute("aria-hidden", "true");

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
      { v: "default", label: "Standard", name: "Optimal reading line-length (70–80 chars)" },
      { v: "wide", label: "Wide", name: "Wider column for diagrams and wide code" },
      { v: "full", label: "Full", name: "Expand to fill the reading pane" }
    ];

    panel.innerHTML =
      '<div class="reader-head">' +
        '<h3>Display</h3>' +
        '<button type="button" class="reader-close" aria-label="Close display settings">&times;</button>' +
      '</div>' +
      '<p>Customize font size, line width and text alignment for comfortable reading.</p>' +
      '<div class="reader-row">' +
        '<span>Text size</span>' +
        '<div class="reader-segment" data-reader-size>' +
          SIZE_CHOICES.map(function (c) {
            return '<button type="button" class="' + c.cls + '" data-value="' + c.v + '" title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '">' + c.label + '</button>';
          }).join("") +
        '</div>' +
      '</div>' +
      '<div class="reader-row">' +
        '<span>Alignment</span>' +
        '<div class="reader-segment" data-reader-align>' +
          ALIGN_CHOICES.map(function (c) {
            return '<button type="button" data-value="' + c.v + '" title="' + esc(c.name) + '">' + c.label + '</button>';
          }).join("") +
        '</div>' +
      '</div>' +
      '<div class="reader-row reader-row-width">' +
        '<span>Reading width</span>' +
        '<div class="reader-segment" data-reader-width>' +
          WIDTH_CHOICES.map(function (c) {
            return '<button type="button" data-value="' + c.v + '" title="' + esc(c.name) + '">' + c.label + '</button>';
          }).join("") +
        '</div>' +
      '</div>' +
      '<button type="button" class="reader-reset">Reset to default</button>';

    document.body.appendChild(panel);
    document.body.appendChild(scrim);

    function isOpen() { return panel.classList.contains("open"); }
    function commit() {
      applyReading(settings);
      save(READING_KEY, settings);
      refresh();
    }
    function refresh() {
      var isFocus = document.body.classList.contains("focus-mode");
      var effectiveWidth = (!isFocus && settings.width === "full") ? "wide" : settings.width;
      var groups = { size: settings.size, align: settings.align, width: effectiveWidth };
      Object.keys(groups).forEach(function (g) {
        var btns = panel.querySelectorAll("[data-reader-" + g + "] button");
        for (var i = 0; i < btns.length; i++) {
          var on = btns[i].getAttribute("data-value") === groups[g];
          btns[i].classList.toggle("active", on);
          btns[i].setAttribute("aria-pressed", on ? "true" : "false");
        }
      });
    }

    function place() {
      var r = trigger.getBoundingClientRect();
      panel.style.top = Math.round(r.bottom + 8) + "px";
      panel.style.right = Math.max(12, Math.round(window.innerWidth - r.right)) + "px";
    }

    function open(v) {
      if (v) {
        settings = readReading();
        refresh();
        place();
      }
      panel.classList.toggle("open", v);
      scrim.classList.toggle("open", v);
      document.body.classList.toggle("reader-open", v);
      trigger.setAttribute("aria-expanded", v ? "true" : "false");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      open(!isOpen());
    });
    panel.querySelector(".reader-close").addEventListener("click", function () { open(false); trigger.focus(); });
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
      if (ev.key === "Escape" && isOpen()) { open(false); trigger.focus(); }
    });
    window.addEventListener("resize", function () { if (isOpen()) place(); });
    window.addEventListener("scroll", function () { if (isOpen()) place(); }, { passive: true });
    document.addEventListener("ir-focus-change", function () {
      refresh();
      if (isOpen()) place();
    });
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

    host.innerHTML =
      '<button type="button" class="menu-btn" aria-label="Toggle sidebar">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' +
      '</button>' +
      '<nav class="crumbs" aria-label="Breadcrumb">' + crumbs + '</nav>' +
      '<div class="topbar-spacer"></div>' +
      '<a class="home-btn" href="' + base + 'index.html" aria-label="Go to Interview Room home">' +
        ICON_HOME + '<span class="home-lbl">Home</span></a>' +
      '<button class="focus-btn" type="button" aria-pressed="false" ' +
        'aria-label="Toggle distraction-free focus mode" title="Focus mode (F)">' +
        ICON_FOCUS_OFF + '<span class="focus-lbl">Focus</span></button>' +
      '<div class="reader-wrap">' +
        '<button class="reader-btn" type="button" aria-expanded="false" aria-haspopup="dialog" ' +
          'aria-label="Reading and display settings" title="Display settings">' +
          '<span class="reader-glyph" aria-hidden="true">A<i>a</i></span><span class="reader-lbl">Display</span></button>' +
      '</div>' +
      '<button class="theme-btn" type="button" data-theme-toggle aria-label="Toggle dark/light theme">' +
        ICON_MOON + '</button>';

    var themeBtn = host.querySelector("[data-theme-toggle]");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme") || "light";
        var next = cur === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }

    buildFocus(host);
    buildDisplay(host);
    setupSidebarToggle();
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
  }

  /* ---------- card rendering ---------- */
  function renderCard(c, i, opts) {
    opts = opts || {};
    var d = el("details", "q-card");
    d.id = c.id;
    var num = String(i + 1).padStart(2, "0");

    var isDone = delivered()[c.id] === 1;

    var s = el("summary");
    var no = el("span", "q-no", num);
    var titleWrap = el("div", "q-title");
    titleWrap.innerHTML = fmt(c.q);

    var meta = el("div", "q-meta");
    if (opts.showTopic && c._topic) {
      meta.innerHTML += '<span class="is-round">' + esc(c._topic.title) + '</span>';
    }
    (c.round || []).forEach(function (r) {
      meta.innerHTML += '<span class="is-round">' + esc(r) + '</span>';
    });
    if (c.level) {
      meta.innerHTML += '<span class="is-level">' + esc(c.level) + ' yrs</span>';
    }
    (c.tags || []).forEach(function (t) {
      meta.innerHTML += '<span>#' + esc(t) + '</span>';
    });
    titleWrap.appendChild(meta);

    var chev = el("span", "q-chev", "+");
    s.appendChild(no);
    s.appendChild(titleWrap);
    s.appendChild(chev);
    d.appendChild(s);

    var body = el("div", "q-body");
    var bh = "";
    if (c.why) {
      bh += '<div class="q-why"><span class="slot-label">What they are testing</span>' + fmt(c.why) + '</div>';
    }
    if (c.simple) {
      bh += '<div class="q-simple"><span class="slot-label">Plain-language explanation</span>' + paras(c.simple) + '</div>';
    }
    if (c.points && c.points.length) {
      bh += '<ul class="q-points">' + c.points.map(function (p) {
        return '<li>' + fmt(p) + '</li>';
      }).join("") + '</ul>';
    }
    if (c.code) {
      bh += '<pre class="q-code"><code>' + esc(c.code) + '</code></pre>';
    }
    if (c.say) {
      bh += '<div class="q-say"><span class="slot-label">Say this in the room</span><p>' + fmt(c.say) + '</p></div>';
    }
    if (c.numbers) {
      bh += '<div class="q-numbers"><span class="slot-label">Numbers to attach</span><p>' + fmt(c.numbers) + '</p></div>';
    }
    if (c.wrong) {
      bh += '<div class="q-wrong"><span class="slot-label">The wrong answer that loses the offer</span><p>' + fmt(c.wrong) + '</p></div>';
    }
    if (c.follow) {
      bh += '<div class="q-follow"><span class="slot-label">The follow-up question</span><p>' + fmt(c.follow) + '</p></div>';
    }
    bh += '<div class="q-actions"><button type="button" class="mini-btn is-ghost" data-delivered-btn>' +
      (isDone ? "✓ Delivered out loud" : "Mark delivered out loud") + '</button></div>';

    body.innerHTML = bh;
    d.appendChild(body);

    var delBtn = body.querySelector("[data-delivered-btn]");
    if (delBtn) {
      delBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var cur = delivered()[c.id] === 1;
        markDelivered(c.id, !cur);
        delBtn.textContent = !cur ? "✓ Delivered out loud" : "Mark delivered out loud";
        delBtn.classList.toggle("primary", !cur);
      });
    }

    return d;
  }
  IR.renderCard = renderCard;

  /* ---------- list mounting & filtering ---------- */
  function mountList(host, cards, opts) {
    opts = opts || {};
    host.innerHTML = "";

    var bar = el("div", "list-filter-bar");
    bar.style.display = "flex";
    bar.style.gap = "0.75rem";
    bar.style.alignItems = "center";
    bar.style.marginBottom = "1.25rem";
    bar.style.flexWrap = "wrap";

    var searchWrap = el("div", "search-wrap");
    searchWrap.style.flex = "1";
    searchWrap.style.minWidth = "180px";
    searchWrap.innerHTML =
      '<label class="toc-filter" style="width:100%;margin:0;">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>' +
        '<input type="search" placeholder="Filter questions" aria-label="Filter questions">' +
      '</label>';

    var rounds = ["screening", "tech1", "tech2", "manager", "hr"];
    var roundSel = el("select", "round-select");
    roundSel.style.minHeight = "1.8125rem";
    roundSel.style.borderRadius = "var(--radius-sm)";
    roundSel.style.border = "1px solid var(--border-strong)";
    roundSel.style.background = "var(--bg-elevated)";
    roundSel.style.color = "var(--text)";
    roundSel.style.fontSize = "0.75rem";
    roundSel.style.padding = "0 0.5rem";
    roundSel.innerHTML = '<option value="">All rounds</option>' + rounds.map(function (r) {
      return '<option value="' + r + '">' + r + '</option>';
    }).join("");

    var count = el("span", "result-count", cards.length + " questions");
    count.style.fontSize = "0.75rem";
    count.style.color = "var(--text-muted)";

    bar.appendChild(searchWrap);
    bar.appendChild(roundSel);
    bar.appendChild(count);

    var list = el("div", "q-list");
    var empty = el("div", "q-empty", "No questions match your filter.");
    empty.hidden = true;

    cards.forEach(function (c, i) {
      list.appendChild(renderCard(c, i, opts));
    });

    host.appendChild(bar);
    host.appendChild(list);
    host.appendChild(empty);

    var filterInput = searchWrap.querySelector("input");
    function filter() {
      var q = filterInput.value.trim().toLowerCase();
      var r = roundSel.value;
      var shown = 0;
      var cardEls = list.querySelectorAll(".q-card");
      cards.forEach(function (c, idx) {
        var cardEl = cardEls[idx];
        if (!cardEl) return;
        var matchQ = !q || (c.q + " " + (c.why || "") + " " + (c.simple || "") + " " + (c.say || "")).toLowerCase().indexOf(q) >= 0;
        var matchR = !r || (c.round || []).indexOf(r) >= 0;
        var ok = matchQ && matchR;
        cardEl.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + " " + (shown === 1 ? "question" : "questions");
      empty.hidden = shown !== 0;
    }

    filterInput.addEventListener("input", filter);
    roundSel.addEventListener("change", filter);
  }

  /* ---------- page bootstrap: topic ---------- */
  function bootTopic() {
    var key = document.body.getAttribute("data-topic");
    var topic = (IR.topics || []).filter(function (t) { return t.num + "-" + t.slug === key; })[0];
    var set = IR.q[key];
    var head = document.querySelector("[data-topic-head]");
    var host = document.querySelector("[data-topic-body]");
    if (!topic || !set || !host) return;

    document.title = topic.title + " — Interview Room";
    if (head) {
      head.innerHTML =
        '<div class="eyebrow">Topic ' + esc(topic.num) + '</div>' +
        '<h1>' + esc(topic.title) + '</h1>' +
        '<p class="lede">' + fmt(set.lede || topic.blurb) + '</p>' +
        (set.svg ? '<div class="topic-diagram" style="margin: 32px 0; overflow-x: auto;">' + set.svg + '</div>' : "") +
        '<div class="chip-row">' +
        '<span class="chip is-accent">' + set.cards.length + ' questions</span>' +
        (set.grounding ? '<span class="chip">Grounded in: ' + esc(set.grounding) + '</span>' : "") +
        '</div>';
    }
    if (set.evening && set.evening.length) {
      var note = el("div", "note");
      note.innerHTML = "<strong>If you only have one evening:</strong> do these " +
        set.evening.length + " first — " +
        set.evening.map(function (id) {
          var c = set.cards.filter(function (x) { return x.id === id; })[0];
          return c ? '<a href="#' + esc(id) + '">' + fmt(c.q) + '</a>' : "";
        }).filter(Boolean).join(" · ");
      host.appendChild(note);
    }
    mountList(host, set.cards, { showTopic: false });
  }

  /* ---------- page bootstrap: index ---------- */
  function bootIndex() {
    var host = document.querySelector("[data-topic-grid]");
    if (!host) return;
    var base = depth();
    var total = 0;
    var h = "";
    (IR.topics || []).forEach(function (t) {
      var key = t.num + "-" + t.slug;
      var n = cardsFor(key).length;
      total += n;
      var live = t.status === "live";
      h += '<a class="tile' + (live ? "" : " is-planned") + '" href="' + base + "topics/" + key + '.html">' +
           '<span class="tile-num">TOPIC ' + t.num + '</span>' +
           '<h3>' + esc(t.title) + '</h3>' +
           '<p>' + esc(t.blurb) + '</p>' +
           '<div class="tile-foot">' + (live ? n + " questions" : "Planned") + '</div></a>';
    });
    host.innerHTML = h;
    var c = document.querySelector("[data-total-count]");
    if (c) c.textContent = total;
    var d = document.querySelector("[data-delivered-count]");
    if (d) d.textContent = Object.keys(delivered()).length;
  }

  /* ---------- page bootstrap: rounds ---------- */
  function bootRounds() {
    var host = document.querySelector("[data-round-body]");
    if (!host) return;
    mountList(host, allCards(), { showTopic: true });
  }

  /* ---------- page bootstrap: tracks ---------- */
  function bootTracks() {
    var host = document.querySelector("[data-tracks-body]");
    if (!host || !IR.tracks) return;

    var byId = {};
    allCards().forEach(function (c) { byId[c.id] = c; });
    var base = depth();

    var h = "";
    IR.tracks.forEach(function (t) {
      h += '<section class="track" id="track-' + esc(t.key) + '">';
      h += '<h2 id="h-track-' + esc(t.key) + '">' + esc(t.label) + '</h2>';
      h += '<div class="chip-row"><span class="chip">Grounded in: ' + esc(t.grounding) + '</span></div>';
      h += '<p><strong>Type includes:</strong> ' + esc(t.includes) + '</p>';
      h += '<p><strong>What they press on:</strong> ' + fmt(t.skew) + '</p>';
      h += '<p><strong>Round structure:</strong> ' + fmt(t.rounds) + '</p>';
      h += '<div class="note"><strong>Watch for:</strong> ' + fmt(t.watch) + '</div>';

      h += '<h3>The ten most likely, in priority order</h3><ol class="track-ten">';
      t.ten.forEach(function (id) {
        var c = byId[id];
        if (!c) { h += '<li class="is-missing">missing card: ' + esc(id) + '</li>'; return; }
        var key = c._topic.num + "-" + c._topic.slug;
        h += '<li><a href="' + base + "topics/" + key + ".html#" + esc(id) + '">' +
             fmt(c.q) + '</a> <span class="track-topic">' + esc(c._topic.title) + '</span></li>';
      });
      h += '</ol>';

      if (t.scenario) {
        h += '<h3>' + esc(t.scenario.title) + '</h3>';
        h += '<div class="note is-warn"><strong>Prompt:</strong> ' + fmt(t.scenario.prompt) + '</div>';
        h += '<ol class="track-moves">' + t.scenario.moves.map(function (m) {
          return '<li>' + fmt(m) + '</li>';
        }).join("") + '</ol>';
      }
      h += '</section>';
    });
    host.innerHTML = h;
  }

  /* ---------- right rail: "on this page" ---------- */
  function buildRail() {
    var content = document.querySelector(".content");
    if (!content) return;

    var existingRail = document.querySelector(".toc-rail");
    if (existingRail) existingRail.remove();

    var heads = [];
    var isQuestions = !!content.querySelector(".q-card[id]");

    if (isQuestions) {
      heads = [].slice.call(content.querySelectorAll(".q-card[id]"));
    } else {
      var allH2 = [].slice.call(content.querySelectorAll("h2"));
      var used = {};
      allH2.forEach(function (h) {
        if (!h.id) {
          var s = slug(h.textContent);
          var b = s, i = 2;
          while (used[s] || document.getElementById(s)) s = b + "-" + (i++);
          used[s] = 1;
          h.id = s;
        }
      });
      heads = allH2.filter(function (h) { return !!h.id; });
    }

    if (!heads.length) return;

    /* Wrap content and rail inside content-wrap for the 2-column layout */
    var wrap = content.parentElement;
    if (!wrap || !wrap.classList.contains("content-wrap")) {
      wrap = el("div", "content-wrap");
      content.parentNode.insertBefore(wrap, content);
      wrap.appendChild(content);
    }
    wrap.classList.add("has-toc");

    var rail = el("aside", "toc-rail");
    var nav = el("nav", "toc");
    var kind = isQuestions ? "question" : "section";

    var items = heads.map(function (h, idx) {
      var id = h.id;
      var full = "";
      if (h.classList && h.classList.contains("q-card")) {
        var titleEl = h.querySelector(".q-title");
        full = titleEl ? titleEl.childNodes[0].textContent.trim() : h.textContent.trim();
      } else {
        full = h.textContent.trim();
      }
      var num = String(idx + 1).padStart(2, "0");
      return { id: id, full: full, num: num };
    });

    nav.innerHTML =
      '<button type="button" class="toc-toggle" aria-expanded="false" ' +
        'aria-label="Jump to a section on this page">' +
        '<svg class="toc-toggle-ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
          'stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>' +
        '<span class="toc-toggle-label">Jump to ' + (kind === "question" ? "question" : "section") + '</span>' +
        '<svg class="toc-toggle-caret" viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
          'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="m6 9 6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="toc-book-head">' +
        '<div><span class="toc-kicker">On this page</span>' +
        '<strong>' + items.length + ' ' + (kind === "question" ? "questions" : "sections") + '</strong></div>' +
        '<button type="button" class="toc-top" aria-label="Back to top" title="Back to top">↑</button>' +
      '</div>' +
      '<label class="toc-filter">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>' +
        '<input type="search" placeholder="Find on this page" aria-label="Find on this page">' +
      '</label>' +
      '<div class="toc-list">' +
        items.map(function (it) {
          return '<a href="#' + esc(it.id) + '" data-toc="' + esc(it.id) + '" title="' + esc(it.full) + '">' +
            '<span class="toc-num">' + esc(it.num) + '</span>' +
            '<span class="toc-label">' + esc(it.full) + '</span></a>';
        }).join("") +
        '<div class="toc-empty" hidden>No match on this page</div>' +
      '</div>';

    rail.appendChild(nav);
    wrap.appendChild(rail);

    var links = [].slice.call(nav.querySelectorAll("[data-toc]"));
    var filterInput = nav.querySelector(".toc-filter input");
    var empty = nav.querySelector(".toc-empty");
    var topBtn = nav.querySelector(".toc-top");
    var tocToggle = nav.querySelector(".toc-toggle");

    if (tocToggle) {
      tocToggle.addEventListener("click", function () {
        var open = nav.classList.toggle("toc-open");
        tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    if (topBtn) {
      topBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", function () {
        var q = filterInput.value.trim().toLowerCase();
        var shown = 0;
        links.forEach(function (link) {
          var ok = !q || link.textContent.toLowerCase().indexOf(q) >= 0;
          link.hidden = !ok;
          if (ok) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
    }

    links.forEach(function (l) {
      l.addEventListener("click", function () {
        nav.classList.remove("toc-open");
        if (tocToggle) tocToggle.setAttribute("aria-expanded", "false");
      });
    });

    if (window.IntersectionObserver) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("data-toc") === en.target.id);
            });
          }
        });
      }, { rootMargin: "-72px 0px -70% 0px" });
      heads.forEach(function (h) { obs.observe(h); });
    }
  }

  /* ---------- sidebar & rail resizers ---------- */
  function initResizers() {
    var existingLeft = document.querySelector(".sidebar-resizer.left-resizer");
    if (!existingLeft) {
      var leftResizer = document.createElement("div");
      leftResizer.className = "sidebar-resizer left-resizer";
      document.body.appendChild(leftResizer);

      var isResizingLeft = false;
      leftResizer.addEventListener("mousedown", function (e) {
        isResizingLeft = true;
        document.body.classList.add("resizing-left");
      });

      window.addEventListener("mousemove", function (e) {
        if (isResizingLeft) {
          var w = Math.max(200, Math.min(e.clientX, 500));
          document.documentElement.style.setProperty("--sidebar-w", w + "px");
        }
      });

      window.addEventListener("mouseup", function () {
        isResizingLeft = false;
        document.body.classList.remove("resizing-left");
      });
    }

    var existingRight = document.querySelector(".sidebar-resizer.right-resizer");
    if (!existingRight) {
      var rightResizer = document.createElement("div");
      rightResizer.className = "sidebar-resizer right-resizer";
      document.body.appendChild(rightResizer);

      var isResizingRight = false;
      rightResizer.addEventListener("mousedown", function (e) {
        isResizingRight = true;
        document.body.classList.add("resizing-right");
      });

      window.addEventListener("mousemove", function (e) {
        if (isResizingRight) {
          var w = Math.max(200, Math.min(window.innerWidth - e.clientX, 500));
          document.documentElement.style.setProperty("--toc-w", w + "px");
        }
      });

      window.addEventListener("mouseup", function () {
        isResizingRight = false;
        document.body.classList.remove("resizing-right");
      });
    }
  }

  /* ---------- scroll state (lifts topbar shadow) ---------- */
  function initScrollState() {
    var THRESHOLD = 8;
    var scrolled = false;
    var ticking = false;

    function apply() {
      ticking = false;
      var next = window.scrollY > THRESHOLD;
      if (next === scrolled) return;
      scrolled = next;
      document.body.classList.toggle("is-scrolled", scrolled);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pageshow", apply);
    apply();
  }

  /* ---------- page navigation (prev / next) ---------- */
  var ROUTE_PAGES = [
    { page: "home",      href: "index.html",     label: "Home" },
    { page: "rounds",    href: "rounds.html",    label: "By interview round" },
    { page: "tracks",    href: "tracks.html",    label: "By employer type" },
    { page: "rehearsal", href: "rehearsal.html", label: "Rehearsal room" }
  ];

  function getSequence() {
    var seq = ROUTE_PAGES.map(function (r) {
      return { href: r.href, title: r.label, page: r.page, topic: null, num: null };
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

  function getHereIndex(seq) {
    var page = document.body.getAttribute("data-page");
    var topic = document.body.getAttribute("data-topic");
    for (var i = 0; i < seq.length; i++) {
      if (seq[i].page !== page) continue;
      if (page === "topic") {
        if (seq[i].topic === topic) return i;
      } else {
        return i;
      }
    }
    return -1;
  }

  function getPageHref(entry) {
    var isCurrentTopic = document.body.getAttribute("data-page") === "topic";
    if (entry.page === "topic") {
      return isCurrentTopic ? (entry.topic + ".html") : ("topics/" + entry.topic + ".html");
    } else {
      return (isCurrentTopic ? "../" : "") + entry.href;
    }
  }

  function pagerCard(entry, dir, cls) {
    var href = getPageHref(entry);
    var ttl = (entry.num ? '<span class="pn-num">' + esc(entry.num) + '</span> · ' : '') + esc(entry.title);
    return '<a class="' + cls + '" href="' + href + '">' +
           '<div class="dir pn-dir">' + dir + '</div>' +
           '<div class="ttl pn-ttl">' + ttl + '</div></a>';
  }

  function buildPager() {
    var content = document.querySelector(".content");
    if (!content || content.querySelector("[data-page-nav]")) return;

    var seq = getSequence();
    var i = getHereIndex(seq);
    if (i < 0) return;

    var current = seq[i];
    var prev = i > 0 ? seq[i - 1] : null;
    var next = i < seq.length - 1 ? seq[i + 1] : null;

    // For the last topic in the portal, provide a Finish / Back to home card
    if (!next && i === seq.length - 1) {
      next = { href: "index.html", title: "Interview Room Home", page: "home", topic: null, num: null };
    }

    if (!prev && !next) return;

    var nav = document.createElement("nav");
    nav.className = "page-nav";
    nav.setAttribute("data-page-nav", "");
    nav.setAttribute("aria-label", "Previous and next page");

    var liveTopics = (IR.topics || []).filter(function (t) { return t.status === "live"; });
    var progText = "";
    if (current.page === "topic" && current.num) {
      progText = "Topic " + current.num + " of " + String(liveTopics.length).padStart(2, "0") + " · " + current.title;
    } else if (current.page === "home") {
      progText = "Page 1 of " + seq.length + " · Start here";
    } else {
      progText = "Page " + (i + 1) + " of " + seq.length + " · " + current.title;
    }

    var h = '<p class="pn-progress">' + esc(progText) + '</p>';
    if (prev) {
      var prevDir = "← Previous";
      if (current.page === "rounds") {
        prevDir = "← Home";
      } else if (current.page === "topic" && prev.page !== "topic") {
        prevDir = "← " + prev.title;
      }
      h += pagerCard(prev, prevDir, "pn-link pn-prev prev");
    }
    if (next) {
      var nextDir = "Next →";
      if (current.page === "home") {
        nextDir = "Start here →";
      } else if (current.page === "rehearsal") {
        nextDir = "Start topics →";
      } else if (i === seq.length - 1) {
        nextDir = "Finish →";
      }
      h += pagerCard(next, nextDir, "pn-link pn-next next");
    }

    nav.innerHTML = h;
    content.appendChild(nav);
  }

  IR.buildPager = buildPager;

  /* ---------- main boot sequence ---------- */
  function boot() {
    IR.initTheme();
    buildSidebar();
    buildTopbar();

    var page = document.body.getAttribute("data-page");
    if (page === "topic") bootTopic();
    else if (page === "home") bootIndex();
    else if (page === "rounds") bootRounds();
    else if (page === "tracks") bootTracks();

    buildRail();
    buildPager();
    initResizers();
    initScrollState();

    document.dispatchEvent(new CustomEvent("ir:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
