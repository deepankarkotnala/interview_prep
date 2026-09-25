/* Interview Room - runtime.
   Standalone: theme, sidebar, card rendering, search and filters.
   Loaded as a classic deferred script so it runs after the data files, which
   are plain assignments onto window.IR. No fetch, no modules - the portal has
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
    return inline(esc(s));
  }
  function inline(h) {
    return h
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  /* ---------- glossary tooltips ----------
     data/glossary.js maps a term (with "|" aliases) to a short definition.
     glossFmt() is fmt() plus: the first mention of each glossary term becomes a
     focusable <span class="term">, and one shared tooltip shows its definition. */
  var glossRe = null, glossTips = null;
  function buildGloss() {
    if (glossRe !== null) return glossRe;
    var g = IR.glossary;
    if (!g) { glossRe = false; return false; }
    glossTips = {};
    var forms = [];
    Object.keys(g).forEach(function (key) {
      key.split("|").forEach(function (f) {
        f = f.trim();
        if (!f) return;
        /* A value is a definition string, or {tip, only: ["rag", ...]} to limit
           a generic word ("generate", "index") to cards whose id starts with
           one of those prefixes - so a Python "generate" never gets a RAG tip. */
        var v = g[key];
        glossTips[f.toLowerCase()] = typeof v === "string" ? { tip: v } : v;
        forms.push(f);
      });
    });
    forms.sort(function (a, b) { return b.length - a.length; });
    var alt = forms.map(function (f) { return esc(f).replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); }).join("|");
    glossRe = new RegExp("(?<![A-Za-z0-9_-])(" + alt + ")(?:s|es)?(?![A-Za-z0-9_-])", "gi");
    return glossRe;
  }
  function glossFmt(s, used, cardId) {
    var h = esc(s), re = buildGloss();
    if (re) {
      used = used || {};
      h = h.replace(re, function (m, term) {
        var e = glossTips[term.toLowerCase()], tip = e && e.tip;
        if (!tip || used[tip]) return m;
        if (e.only && e.only.indexOf(String(cardId || "").split("-")[0]) < 0) return m;
        used[tip] = 1;
        return '<span class="term" tabindex="0" data-tip="' + esc(tip) + '">' + m + '</span>';
      });
    }
    return inline(h);
  }
  function setupTips() {
    var tip = document.createElement("div");
    tip.id = "ir-tip";
    tip.className = "term-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);
    var cur = null;
    function show(t) {
      if (cur && cur !== t) cur.removeAttribute("aria-describedby");
      cur = t;
      tip.textContent = t.getAttribute("data-tip");
      tip.hidden = false;
      t.setAttribute("aria-describedby", "ir-tip");
      var r = t.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, m = 8;
      var left = Math.max(m, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - m));
      var top = r.top - h - m;
      if (top < m) top = r.bottom + m;
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    }
    function hide() {
      if (cur) cur.removeAttribute("aria-describedby");
      cur = null;
      tip.hidden = true;
    }
    function termOf(e) { return e.target.closest ? e.target.closest(".term") : null; }
    document.addEventListener("mouseover", function (e) { var t = termOf(e); if (t) show(t); });
    document.addEventListener("mouseout", function (e) { var t = termOf(e); if (t && t === cur) hide(); });
    document.addEventListener("focusin", function (e) { var t = termOf(e); if (t) show(t); });
    document.addEventListener("focusout", function (e) { if (termOf(e)) hide(); });
    /* Touch has no hover: a tap toggles, a tap anywhere else closes. */
    document.addEventListener("click", function (e) {
      var t = termOf(e);
      if (t) { if (cur === t && !tip.hidden) hide(); else show(t); }
      else if (cur) hide();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && cur) hide(); });
    window.addEventListener("scroll", function () { if (cur) hide(); }, { passive: true, capture: true });
  }
  /* Lines indented by two or more spaces are a small aligned illustration -
     a latency budget, a shape table, a prompt layout. Rendered as prose, the
     browser collapses the spaces and the columns fall apart, so each indented
     run becomes a <pre> in place, dedented to its shallowest line. */
  var INDENTED = /^ {2,}\S/;
  /* Light block syntax, one line each: "### " heading, "- " bullet,
     "1. " numbered item, "> " callout. */
  function lineMode(l) {
    if (INDENTED.test(l)) return "pre";
    if (/^#{2,4} \S/.test(l)) return "h";
    if (/^- \S/.test(l)) return "ul";
    if (/^\d+\. \S/.test(l)) return "ol";
    if (/^> ?\S/.test(l)) return "quote";
    return "p";
  }
  /* gloss: underline glossary terms (first mention across the whole text). */
  function paras(s, gloss, cardId) {
    var used = {};
    var f = gloss ? function (x) { return glossFmt(x, used, cardId); } : fmt;
    return String(s || "").split(/\n\n+/).map(function (p) {
      p = p.replace(/^\n+|\s+$/g, "");
      var lines = p.split("\n");
      if (lines.every(function (l) { return lineMode(l) === "p"; })) {
        return "<p>" + f(p.trim()) + "</p>";
      }
      var out = "", buf = [], mode = null;
      function flush() {
        if (!buf.length) return;
        if (mode === "pre") {
          var ind = Math.min.apply(null, buf.map(function (l) { return l.match(/^ */)[0].length; }));
          out += '<pre class="q-code q-inline-pre"><code>' +
            esc(buf.map(function (l) { return l.slice(ind); }).join("\n")) + "</code></pre>";
        } else if (mode === "h") {
          buf.forEach(function (l) { out += '<h4 class="q-h">' + f(l.replace(/^#+ /, "")) + "</h4>"; });
        } else if (mode === "ul" || mode === "ol") {
          var start = mode === "ol" ? parseInt(buf[0], 10) : 1;
          out += "<" + mode + ' class="q-list"' + (start > 1 ? ' start="' + start + '"' : "") + ">" +
            buf.map(function (l) { return "<li>" + f(l.replace(/^(- |\d+\. )/, "")) + "</li>"; }).join("") +
            "</" + mode + ">";
        } else if (mode === "quote") {
          out += '<blockquote class="q-quote">' +
            f(buf.map(function (l) { return l.replace(/^> ?/, ""); }).join("\n").trim()) + "</blockquote>";
        } else {
          out += "<p>" + f(buf.join("\n").trim()) + "</p>";
        }
        buf = [];
      }
      lines.forEach(function (l) {
        var m = lineMode(l);
        if (m !== mode || m === "h") { flush(); mode = m; }
        buf.push(l);
      });
      flush();
      return out;
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
    if (m) m.content = t === "dark" ? "#1b1b1b" : "#f4f6fb";
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.innerHTML = t === "dark" ? ICON_SUN : ICON_MOON;
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function switchTheme(t) {
    var root = document.documentElement;
    var current = root.getAttribute("data-theme") || "light";
    if (t === current) return;

    /* Keep theme switching cheap: change the theme once, then run one tiny
       compositor-friendly fade on the page. No screenshots, clipping, blur or
       per-component color animations. */
    root.classList.add("theme-switching");
    applyTheme(t);

    var reduceMotion = false;
    try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

    if (!reduceMotion && document.body && typeof document.body.animate === "function") {
      var fade = document.body.animate(
        [{ opacity: 0.94 }, { opacity: 1 }],
        { duration: 90, easing: "linear" }
      );
      fade.finished.then(function () {
        root.classList.remove("theme-switching");
      }, function () {
        root.classList.remove("theme-switching");
      });
      return;
    }

    root.classList.remove("theme-switching");
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
         '<img src="' + base + 'assets/brand/interview-room-logo.png?v=7" alt="" ' +
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
      applyReading(readReading());
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

  /* One step smaller on desktop; phones keep "m" (scale 1 there). */
  function defaultSize() {
    return matchMedia("(max-width: 860px)").matches ? "m" : "s";
  }
  function readReading() {
    var raw = store(READING_KEY, {});
    return {
      size: SIZES.indexOf(raw.size) >= 0 ? raw.size : defaultSize(),
      width: WIDTHS.indexOf(raw.width) >= 0 ? raw.width : "wide",
      focusWidth: WIDTHS.indexOf(raw.focusWidth) >= 0 ? raw.focusWidth : "default",
      align: ALIGNS.indexOf(raw.align) >= 0 ? raw.align : "justify"
    };
  }
  function applyReading(s) {
    var doc = document.documentElement;
    doc.setAttribute("data-reading-size", s.size);
    var isFocus = document.body.classList.contains("focus-mode");
    var effectiveWidth = isFocus ? (s.focusWidth || "default") : ((!isFocus && s.width === "full") ? "wide" : s.width);
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
      { v: "left", label: "Left", name: "Ragged right edge - even word spacing" },
      { v: "justify", label: "Justified", name: "Flush right edge - word spacing varies per line" }
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
      var effectiveWidth = isFocus ? (settings.focusWidth || "default") : ((!isFocus && settings.width === "full") ? "wide" : settings.width);
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
        var val = b.getAttribute("data-value");
        if (g === "width") {
          var isFocus = document.body.classList.contains("focus-mode");
          if (isFocus) {
            settings.focusWidth = val;
          } else {
            settings.width = val;
          }
        } else {
          settings[g] = val;
        }
        commit();
      });
    });
    panel.querySelector(".reader-reset").addEventListener("click", function () {
      var isFocus = document.body.classList.contains("focus-mode");
      settings.size = defaultSize();
      settings.align = "justify";
      if (isFocus) {
        settings.focusWidth = "default";
      } else {
        settings.width = "wide";
      }
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
      settings = readReading();
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
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        switchTheme(next);
      });
    }

    buildFocus(host);
    buildDisplay(host);
    setupSidebarToggle();
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
  }

  /* ---------- whiteboard diagrams ----------
     Some questions are answered at a whiteboard, not in a paragraph. "Build a
     RAG agent in LangGraph - what nodes and edges?" is marked in its own `why`
     as a whiteboard question, and the answer only lands if you can draw it
     while you talk.

     So a card may carry a `diagram`, and this renders it as inline SVG, built
     from a small declarative spec rather than hand-written markup: the spec is
     short enough to review in a diff, check.js can validate it like any other
     slot, and layout stays consistent instead of drifting per author.

     Deliberately plain. This is a picture you have to reproduce on a
     whiteboard under pressure, so it is boxes, arrows and labels - nothing you
     could not draw with one marker in about forty seconds.

     ---- Why the layout is measured rather than guessed ----

     The first version placed boxes on a grid and drew lines between them, and
     it produced a mess: edge labels ran off the canvas, two back-edges wrote
     their labels on top of each other, and a curve between diagonal cells cut
     straight through the box sitting between them. All three have the same
     cause - nothing tracked how much room a thing actually needed before
     committing to a position.

     So this version measures first. Text width is estimated per string and
     boxes are sized to their content; the side lanes are allocated per edge so
     two loops never share an x; and every connector is routed orthogonally
     through the gaps between rows rather than sliced diagonally across them.
     Nothing is drawn until its extent is known.

     ---- Responsive ----

     The same spec renders at two widths. Above the breakpoint, rows lay out as
     authored. Below it, every row collapses to one column and the drawing
     becomes a single vertical track - which is the only honest way to show a
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
     something FITS - erring wide costs a little whitespace, which is the safe
     direction. Tuned against the Inter metrics the portal actually loads. */
  var DIA_CH_LABEL = 6.55;   /* 11.5px, weight 650 */
  var DIA_CH_NOTE  = 4.85;   /* 9px, weight 600   */
  var DIA_CH_EDGE  = 5.05;   /* 9.5px, weight 600 */

  /* On a phone the narrow SVG's 700-unit canvas is painted into ~320 CSS
     pixels, so authored type lands at under half its size and the drawing
     becomes unreadable. The narrow layout therefore authors its text larger in
     user units - the viewBox scales it back down to something legible on
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
    rowGap: 52,       /* vertical room between rows - connectors route in here */
    colGap: 26,
    padX: 18,
    padY: 16,
    laneStep: 15,     /* horizontal offset between two lanes on the same side */
    laneGap: 10       /* gap between the outermost lane and the boxes */
  };

  /* Greedy wrap to a pixel width. Returns every line - nothing is dropped,
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
       boxes have left. Each long connector gets its OWN lane on its own side - 
       that is what stops two loop labels landing on the same pixel. */
    /* Row index per node. When narrow, every row collapses to one column, so
       a node's effective row is its position in the FLATTENED list - not the
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
       label alone under-reserves as soon as a third lane appears - the label
       on the outermost lane then starts left of zero. */
    function reserve(list) {
      if (!list.length) return 0;
      var need = 0;
      list.forEach(function (l, i) {
        need = Math.max(need, i * DIA.laneStep + l.w);
      });
      return DIA.laneGap + need + 6;
    }
    /* Narrow reserves the same way - a label needs its width whatever the
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
       row shares the tallest - a ragged row reads as a mistake. */
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
         it in the same row - `grade → rewrite` passing through `retrieve` was
         exactly this. So drop out of the bottom edge into the gap below the
         row first, run sideways there where nothing is drawn, and only then
         take the lane. The same on arrival, entering through the target's top. */
      var upward = b.y < a.y;
      var sx = a.x + a.w / 2, tx = b.x + b.w / 2;
      /* Leave and arrive on the side the connector is heading, so the detour
         always uses a gap that exists. An upward loop that left through the
         source's BOTTOM had to travel below the last row - which is off the
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
         share - by which point they have been pushed apart as far as the
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
         and enters the target's bottom, through the gap the two rows share - 
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
       its own length - so data visibly moves in the direction of the arrow.
       Purely decorative: it is behind the label, respects reduced-motion, and
       the drawing is complete and correct with it switched off. */
    out += '<path class="dg-flow' + (back ? " is-back" : "") + '" d="' + d + '"/>';
    if (e.label) {
      /* Wrap the label to whatever room it actually has beside its lane, then
         plate it so a connector never reads through the text where the two
         cross. Wrapping rather than widening the reservation is what keeps a
         long branch label - "no · skip retrieval" - from either running off a
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
            /* Start below the last note line (its baseline sits ~0.3 line under
               noteH), so the wrap connector never runs through the text. */
            var nb = y + boxH + (noteH ? noteH + M.lhNote * 0.55 : 0) + 4;
            var ny = nb + 18 * M.k;
            d = diaPath([[x + w / 2, nb],
                         [x + w / 2, ny - 6], [DIA.padX + w / 2, ny - 6],
                         [DIA.padX + w / 2, ny + 4]]);
            if (narrow) d = diaPath([[x + w / 2, nb], [x + w / 2, ny + 4]]);
          } else {
            d = "M" + (x + w + 2) + " " + (y + boxH / 2) + " H" + (x + w + gap - 3);
          }
          body += '<path class="dg-edge" d="' + d + '" marker-end="url(#dg-ar)"/>' +
                  '<path class="dg-flow" d="' + d + '"/>';
        }
      });
      y += boxH + noteH + (noteH ? M.lhNote * 0.55 : 0) + 26 * M.k;
      maxY = y;
    }
    return { body: body, h: maxY - 26 * M.k + DIA.padY + 8 };
  }

  /* ---- compare / matrix / stack ----
     Three more shapes for things a flowchart draws badly:
       kind "compare": columns: [{label, note?, accent?, cells: [..]}], aspects?: [..]
                       side-by-side options; aspects are optional row labels.
       kind "matrix":  cols: [..], rows: [..], cells: [[{label, note?, accent?}]],
                       xLabel?, yLabel?   a 2x2 (or up to 3x3) grid.
       kind "stack":   layers: [{label, note?, accent?}], top?, bottom?
                       layers top to bottom, with an optional flow arrow.
     All reuse diaNode, so accents mean the same thing as in every other diagram. */
  var DIA_CH_CELL = 5.35;   /* 10px, weight 500 - cell text */
  function diaMeasure(label, note, w, M) {
    var lab = diaWrapPx(label, w - 14 * M.k, M.chLabel);
    var nt = note ? diaWrapPx(note, w - 10 * M.k, M.chNote) : [];
    var h = Math.max(DIA.minNodeH * M.k * (M.k > 1 ? 0.8 : 1),
                     M.padBox + lab.length * M.lhLabel + (nt.length ? 2 + nt.length * M.lhNote : 0));
    return { lab: lab, note: nt, h: h };
  }
  function diaBox(x, y, w, h, m, accent, M) {
    return diaNode({ node: { accent: accent }, x: x, y: y, w: w, h: h, lab: m.lab, note: m.note }, M);
  }
  function diaCell(x, y, w, text, M, measureOnly) {
    var ch = DIA_CH_CELL * M.k, lh = 13 * M.k;
    var lines = diaWrapPx(text, w - 16 * M.k, ch);
    var h = Math.max(30 * M.k * (M.k > 1 ? 0.8 : 1), 12 * M.k + lines.length * lh);
    if (measureOnly) return h;
    return function (hh) {
      var s = '<g class="dg-cellbox"><rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' +
              w.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="6"/>';
      var ty = y + (hh - lines.length * lh) / 2 + lh * 0.78;
      lines.forEach(function (ln, i) {
        s += '<text class="dg-cell" x="' + (x + w / 2).toFixed(1) + '" y="' + (ty + i * lh).toFixed(1) + '">' + esc(ln) + "</text>";
      });
      return s + "</g>";
    };
  }

  function renderCompare(spec, narrow) {
    var cols = spec.columns || [], aspects = spec.aspects || [];
    var M = diaMetrics(narrow), gap = 14, body = "", y = DIA.padY;
    var nRows = Math.max.apply(null, cols.map(function (c) { return (c.cells || []).length; }).concat([0]));
    if (narrow) {
      var w = DIA.w - DIA.padX * 2;
      cols.forEach(function (c, ci) {
        var m = diaMeasure(c.label, c.note, w, M);
        body += diaBox(DIA.padX, y, w, m.h, m, c.accent, M);
        y += m.h + 8 * M.k;
        (c.cells || []).forEach(function (t, r) {
          var text = aspects[r] ? aspects[r] + " - " + t : t;
          var hh = diaCell(DIA.padX, y, w, text, M, true);
          body += diaCell(DIA.padX, y, w, text, M)(hh);
          y += hh + 6 * M.k;
        });
        if (ci < cols.length - 1) y += 16 * M.k;
      });
      return { body: body, h: y + DIA.padY - 6 * M.k };
    }
    var aspectW = aspects.length ? 118 : 0;
    var x0 = DIA.padX + (aspectW ? aspectW + gap : 0);
    var cw = (DIA.w - DIA.padX - x0 - gap * (cols.length - 1)) / cols.length;
    var heads = cols.map(function (c) { return diaMeasure(c.label, c.note, cw, M); });
    var hh = Math.max.apply(null, heads.map(function (m) { return m.h; }));
    cols.forEach(function (c, i) { body += diaBox(x0 + i * (cw + gap), y, cw, hh, heads[i], c.accent, M); });
    y += hh + 10;
    for (var r = 0; r < nRows; r++) {
      var rh = 0;
      cols.forEach(function (c, i) { rh = Math.max(rh, diaCell(x0 + i * (cw + gap), y, cw, (c.cells || [])[r] || "", M, true)); });
      if (aspects[r]) {
        var al = diaWrapPx(aspects[r], aspectW - 4, DIA_CH_NOTE * 1.12);
        var ay = y + (rh - al.length * 12) / 2 + 9;
        al.forEach(function (ln, j) {
          body += '<text class="dg-aspect" x="' + (DIA.padX + aspectW) + '" y="' + (ay + j * 12).toFixed(1) + '">' + esc(ln) + "</text>";
        });
      }
      cols.forEach(function (c, i) { body += diaCell(x0 + i * (cw + gap), y, cw, (c.cells || [])[r] || "", M)(rh); });
      y += rh + 8;
    }
    return { body: body, h: y + DIA.padY - 8 };
  }

  function renderMatrix(spec, narrow) {
    var cols = spec.cols || [], rows = spec.rows || [], cells = spec.cells || [];
    var M = diaMetrics(narrow), gap = 10, body = "", y = DIA.padY;
    var yl = spec.yLabel ? 22 * M.k : 0;
    var rowHeadW = (narrow ? 150 : 120) + 0;
    var x0 = DIA.padX + yl + rowHeadW + gap;
    var cw = (DIA.w - DIA.padX - x0 - gap * (cols.length - 1)) / cols.length;
    if (spec.xLabel) {
      body += '<text class="dg-axis" x="' + (x0 + (DIA.w - DIA.padX - x0) / 2).toFixed(1) + '" y="' + (y + 11 * M.k).toFixed(1) + '">' + esc(spec.xLabel) + "</text>";
      y += 20 * M.k;
    }
    var chHead = DIA_CH_NOTE * 1.12 * M.k, lhHead = 12 * M.k;
    var headLines = cols.map(function (c) { return diaWrapPx(c, cw - 6, chHead); });
    var headH = Math.max.apply(null, headLines.map(function (l) { return l.length; })) * lhHead + 6 * M.k;
    headLines.forEach(function (ls, i) {
      ls.forEach(function (ln, j) {
        body += '<text class="dg-colhead" x="' + (x0 + i * (cw + gap) + cw / 2).toFixed(1) + '" y="' + (y + (j + 1) * lhHead - 2).toFixed(1) + '">' + esc(ln) + "</text>";
      });
    });
    y += headH;
    var gridTop = y;
    rows.forEach(function (rlab, r) {
      var ms = cols.map(function (c, i) { var cell = (cells[r] || [])[i] || {}; return diaMeasure(cell.label || "", cell.note, cw, M); });
      var rh = Math.max.apply(null, ms.map(function (m) { return m.h; }));
      var rl = diaWrapPx(rlab, rowHeadW - 8, chHead);
      var ry = y + (rh - rl.length * lhHead) / 2 + lhHead * 0.8;
      rl.forEach(function (ln, j) {
        body += '<text class="dg-rowhead" x="' + (DIA.padX + yl + rowHeadW).toFixed(1) + '" y="' + (ry + j * lhHead).toFixed(1) + '">' + esc(ln) + "</text>";
      });
      cols.forEach(function (c, i) {
        var cell = (cells[r] || [])[i] || {};
        body += diaBox(x0 + i * (cw + gap), y, cw, rh, ms[i], cell.accent, M);
      });
      y += rh + gap;
    });
    if (spec.yLabel) {
      var cy = (gridTop + y - gap) / 2, cx = DIA.padX + 9 * M.k;
      body += '<text class="dg-axis" transform="rotate(-90 ' + cx.toFixed(1) + " " + cy.toFixed(1) + ')" x="' + cx.toFixed(1) + '" y="' + (cy + 4 * M.k).toFixed(1) + '">' + esc(spec.yLabel) + "</text>";
    }
    return { body: body, h: y - gap + DIA.padY };
  }

  function renderStack(spec, narrow) {
    var layers = spec.layers || [];
    var M = diaMetrics(narrow), body = "", y = DIA.padY;
    var flow = spec.top || spec.bottom;
    var lx = DIA.padX + (flow ? 34 * (narrow ? 1.6 : 1) : 0);
    var w = DIA.w - DIA.padX - lx, gap = 8 * M.k;
    if (spec.top) {
      body += '<text class="dg-flowtext" x="' + lx + '" y="' + (y + 10 * M.k).toFixed(1) + '">' + esc(spec.top) + "</text>";
      y += 20 * M.k;
    }
    var start = y;
    layers.forEach(function (l, i) {
      var m = diaMeasure(l.label, l.note, w, M);
      body += diaBox(lx, y, w, m.h, m, l.accent, M);
      y += m.h + (i < layers.length - 1 ? gap : 0);
    });
    if (flow) {
      var ax = DIA.padX + 12 * (narrow ? 1.6 : 1);
      body += '<path class="dg-edge" d="M' + ax + " " + (start - (spec.top ? 6 : 0)) + " V" + (y + (spec.bottom ? 4 : 0)) + '" marker-end="url(#dg-ar)"/>';
    }
    if (spec.bottom) {
      y += 20 * M.k;
      body += '<text class="dg-flowtext" x="' + lx + '" y="' + (y - 2 * M.k).toFixed(1) + '">' + esc(spec.bottom) + "</text>";
    }
    return { body: body, h: y + DIA.padY };
  }

  function diaSvg(spec, narrow, cls) {
    var body, h;
    var custom = { lanes: renderLanes, compare: renderCompare, matrix: renderMatrix, stack: renderStack }[spec.kind];
    if (custom) {
      var lr = custom(spec, narrow);
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
    var need = { lanes: "lanes", compare: "columns", matrix: "cells", stack: "layers" }[spec.kind] || "rows";
    if (!(spec[need] || []).length) return "";
    return '<figure class="q-diagram">' +
      '<b class="slot-label">Picture it</b>' +
      '<div class="dg-frame">' +
      diaSvg(spec, false, "dg-wide") +
      diaSvg(spec, true, "dg-narrow") +
      "</div>" +
      (spec.caption ? "<figcaption>" + fmt(spec.caption) + "</figcaption>" : "") +
      "</figure>";
  }
  IR.renderDiagram = renderDiagram;


  /* ---------- card rendering ---------- */
  var PRIORITY = {
    high:   { label: "High",   hint: "High priority - asked in most interviews. Learn this first." },
    medium: { label: "Medium", hint: "Medium priority - common follow-up or deeper question." },
    low:    { label: "Low",    hint: "Low priority - niche or role-specific. Read once you have the rest." }
  };
  IR.priority = PRIORITY;

  var ICON_COPY =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
  var ICON_CHECK =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12l5 5L20 7"/></svg>';

  /* Clipboard API first; the textarea fallback covers browsers that block it
     on file:// pages. */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) resolve(); else reject(new Error("copy failed"));
    });
  }

  /* Lives inside <summary>, so the click must not also open or close the card. */
  function copyButton(question) {
    var plain = String(question).replace(/`([^`]+)`/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
    var b = el("button", "q-copy", ICON_COPY);
    b.type = "button";
    b.title = "Copy question";
    b.setAttribute("aria-label", "Copy question");
    var timer;
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      copyText(plain).then(function () {
        b.innerHTML = ICON_CHECK;
        b.classList.add("is-copied");
        b.title = "Copied";
        b.setAttribute("aria-label", "Question copied");
      }, function () {
        b.title = "Copy failed";
      });
      clearTimeout(timer);
      timer = setTimeout(function () {
        b.innerHTML = ICON_COPY;
        b.classList.remove("is-copied");
        b.title = "Copy question";
        b.setAttribute("aria-label", "Copy question");
      }, 1500);
    });
    return b;
  }

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
    /* Priority sits in the card's top-right corner. It floats inside the
       title so a long question wraps around it instead of losing width to a
       fixed column - which matters most on a phone. */
    /* Copy button floats beside the pill. Inserted first so the pill,
       inserted before it, stays rightmost. */
    titleWrap.insertBefore(copyButton(c.q), titleWrap.firstChild);
    var prio = PRIORITY[c.priority];
    if (prio) {
      var pill = el("span", "q-prio is-" + c.priority,
        '<span class="q-prio-dot" aria-hidden="true"></span>' + prio.label +
        '<span class="q-prio-word"> priority</span>');
      pill.title = prio.hint;
      titleWrap.insertBefore(pill, titleWrap.firstChild);
    }

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
      meta.innerHTML += '<span class="is-tag">#' + esc(t) + '</span>';
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
    /* Quick recall: 3-5 plain bullets to glance at just before an interview. */
    if (c.quick && c.quick.length) {
      bh += '<div class="q-quick"><span class="slot-label">Quick recall</span><ul>' +
        c.quick.map(function (b) { return '<li>' + fmt(b) + '</li>'; }).join("") + '</ul></div>';
    }
    if (c.simple) {
      bh += '<div class="q-simple"><span class="slot-label">Plain-language explanation</span>' + paras(c.simple, true, c.id) + '</div>';
    }
    if (c.points && c.points.length) {
      bh += '<ul class="q-points">' + c.points.map(function (p) {
        return '<li>' + fmt(p) + '</li>';
      }).join("") + '</ul>';
    }
    /* Diagram after the explanation and bullets: see the shape, then say it. */
    if (c.diagram) {
      bh += renderDiagram(c.diagram);
    }
    if (c.code) {
      bh += '<pre class="q-code"><code>' + esc(c.code) + '</code></pre>';
    }
    if (c.say) {
      bh += '<div class="q-say"><span class="slot-label">Say this in the room</span><p>' + glossFmt(c.say, null, c.id) + '</p></div>';
    }
    if (c.numbers) {
      bh += '<div class="q-numbers"><span class="slot-label">Numbers to attach</span><p>' + fmt(c.numbers) + '</p></div>';
    }
    if (c.wrong) {
      bh += '<div class="q-wrong"><span class="slot-label">The wrong answer that loses the offer</span><p>' + fmt(c.wrong) + '</p></div>';
    }
    if (c.follow) {
      var followAns = c.followAnswer || c.follow_answer || c.followSay || "";
      if (followAns) {
        bh += '<details class="q-follow is-expandable">' +
          '<summary class="q-follow-summary">' +
            '<div class="q-follow-head">' +
              '<span class="slot-label">The follow-up question</span>' +
              '<span class="q-follow-toggle">Sample answer <span class="q-follow-chev">›</span></span>' +
            '</div>' +
            '<p class="q-follow-q">' + fmt(c.follow) + '</p>' +
          '</summary>' +
          '<div class="q-follow-answer">' +
            '<span class="slot-label slot-label-ans">Sample answer in the room</span>' +
            '<p>' + fmt(followAns) + '</p>' +
          '</div>' +
        '</details>';
      } else {
        bh += '<div class="q-follow"><span class="slot-label">The follow-up question</span><p>' + fmt(c.follow) + '</p></div>';
      }
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

  /* ---------- question-card motion ---------- */
  /* One delegated listener animates the card's height with the Web Animations
     API: measure, animate, then hand back to native <details>. Only the one
     card moves (it already clips with overflow:hidden), the body fades on the
     compositor, and duration scales with distance so a short answer is quick
     and a long one glides instead of whipping open. Opening eases out (fast
     start, soft landing). Closing is deliberately brisk - a short range and a
     curve that moves on the first frame - because folding away should feel
     like it answered the click, not like it is taking its time. */
  function setupQuestionCardMotion() {
    if (setupQuestionCardMotion.done || !Element.prototype.animate) return;
    setupQuestionCardMotion.done = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");
    var EASE_OPEN = "cubic-bezier(.22, 1, .36, 1)";
    /* Same curve both ways: it moves on the first frame, so a close answers
       the click as quickly as an open does. */
    var EASE_CLOSE = EASE_OPEN;

    function duration(dist, closing) {
      if (closing) return Math.min(420, Math.max(240, 200 + dist * 0.3));
      return Math.min(620, Math.max(260, 220 + dist * 0.32));
    }
    function closedHeight(d, s) {
      return s.offsetHeight + (d.offsetHeight - d.clientHeight);
    }
    function finish(d) {
      d._qAnim = d._qFade = null;
      d.classList.remove("is-animating", "is-closing");
      d.style.height = "";
    }

    function run(d, s, opening) {
      var body = d.querySelector(":scope > .q-body");
      var from = d.offsetHeight;
      if (d._qAnim) { d._qAnim.cancel(); if (d._qFade) d._qFade.cancel(); }
      d.classList.add("is-animating");
      d.classList.toggle("is-closing", !opening);
      if (opening) d.open = true;
      d.style.height = "";
      var to = opening ? d.offsetHeight : closedHeight(d, s);
      /* Closing a card taller than the screen: start the collapse from the
         viewport's bottom edge, not the card's. The part below the fold is
         invisible anyway, so dropping it is free - and the whole motion now
         plays where you can see it, instead of mostly off-screen with only
         the slow tail of the curve visible at the end. */
      if (!opening) {
        var r = d.getBoundingClientRect();
        var bar = document.querySelector(".topbar");
        var line = bar ? bar.getBoundingClientRect().bottom : 0;
        var visible = window.innerHeight - Math.max(r.top, line) + 24;
        if (from > visible) from = Math.max(to, visible);
      }
      var ms = duration(Math.abs(to - from), !opening);

      d._qAnim = d.animate(
        { height: [from + "px", to + "px"] },
        { duration: ms, easing: opening ? EASE_OPEN : EASE_CLOSE }
      );
      if (body) {
        d._qFade = body.animate(
          opening ? { opacity: [0, 1], transform: ["translateY(-6px)", "none"] }
                  : { opacity: [1, 0], transform: ["none", "translateY(-4px)"] },
          { duration: opening ? ms * 0.9 : ms * 0.45, easing: opening ? EASE_OPEN : "ease-out", fill: "both" }
        );
      }
      var anim = d._qAnim, fade = d._qFade;
      function done() {
        if (d._qAnim !== anim) return; /* superseded by a reverse click */
        if (!opening) d.open = false;
        anim.cancel();
        if (fade) fade.cancel();
        finish(d);
      }
      anim.onfinish = done;
      /* finish events wait for a rendered frame; a hidden tab may never draw
         one, so a timer guarantees the card still lands in its end state. */
      setTimeout(done, ms + 80);
    }

    /* Bulk path (Expand all / Collapse all): no height animation. Height
       tweens re-lay out the whole page every frame, and a dozen of them at
       once is what stuttered. Cards snap to their end state; the caller may
       ask for a compositor-only fade on the few that are on screen. */
    IR.setCardOpen = function (d, open, fade) {
      if (d._qAnim) {
        var a = d._qAnim, f = d._qFade;
        finish(d);              /* clears d._qAnim, so a's onfinish is a no-op */
        a.cancel(); if (f) f.cancel();
      }
      d.open = open;
      if (open && fade && !(reduce && reduce.matches)) {
        var body = d.querySelector(":scope > .q-body");
        if (body) body.animate(
          { opacity: [0, 1], transform: ["translateY(-4px)", "none"] },
          { duration: 280, easing: EASE_OPEN }
        );
      }
    };

    IR.animateCard = function (d, open) {
      var s = d.querySelector(":scope > summary");
      if (!s || (reduce && reduce.matches)) { d.open = open; return; }
      var heading = d._qAnim ? !d.classList.contains("is-closing") : d.open;
      if (heading !== open) run(d, s, open);
    };

    document.addEventListener("click", function (e) {
      var s = e.target.closest && e.target.closest(".q-card > summary");
      if (!s || e.defaultPrevented || e.button !== 0) return;
      var d = s.parentElement;
      if (reduce && reduce.matches) return; /* native instant toggle */
      e.preventDefault();
      /* Mid-animation, the direction is whichever way the card is heading. */
      var opening = d._qAnim ? d.classList.contains("is-closing") : !d.open;
      /* Closing a card you have scrolled deep into: bring its header back so
         you do not lose your place when the body folds away above you. */
      if (!opening) {
        var top = d.getBoundingClientRect().top;
        var bar = document.querySelector(".topbar");
        var line = bar ? bar.getBoundingClientRect().bottom : 0;
        if (top < line) d.scrollIntoView({ block: "start", behavior: "smooth" });
      }
      run(d, s, opening);
    });
  }

  /* ---------- themed dropdown ----------
     A native <select> popup is drawn by the OS, so it ignores the theme (grey
     highlight, light list in dark mode). This wraps a select with a button and
     a listbox built from tokens. The select stays in the DOM as the source of
     truth: choosing an option sets its value and fires "change", so existing
     listeners keep working untouched. */
  var ddSeq = 0, ddOpen = null;
  var DD_CARET = '<svg class="dd-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var DD_CHECK = '<svg class="dd-check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  function enhanceSelect(sel, opts) {
    if (!sel || sel._dd) return;
    opts = opts || {};
    var id = "dd-" + (++ddSeq);
    var wrap = el("div", "dd" + (opts.inline ? " dd-inline" : ""));
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add("dd-native");
    sel.tabIndex = -1;
    sel.setAttribute("aria-hidden", "true");

    var btn = el("button", "dd-btn", '<span class="dd-value"></span>' + DD_CARET);
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", id);
    if (sel.getAttribute("aria-label")) btn.setAttribute("aria-label", sel.getAttribute("aria-label"));
    var menu = el("ul", "dd-menu");
    menu.id = id;
    menu.setAttribute("role", "listbox");
    menu.tabIndex = -1;
    var items = [].slice.call(sel.options).map(function (o, i) {
      var li = el("li", "dd-opt", '<span>' + esc(o.textContent) + '</span>' + DD_CHECK);
      li.id = id + "-" + i;
      li.setAttribute("role", "option");
      li.addEventListener("click", function () { choose(i); });
      li.addEventListener("mousemove", function () { setActive(i); });
      menu.appendChild(li);
      return li;
    });
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    var valueEl = btn.querySelector(".dd-value");
    var active = -1;

    function sync() {
      var i = sel.selectedIndex;
      valueEl.textContent = i >= 0 ? sel.options[i].textContent : "";
      items.forEach(function (li, j) { li.setAttribute("aria-selected", j === i ? "true" : "false"); });
    }
    function setActive(i) {
      if (i < 0 || i >= items.length) return;
      if (items[active]) items[active].classList.remove("is-active");
      active = i;
      items[i].classList.add("is-active");
      menu.setAttribute("aria-activedescendant", items[i].id);
      var li = items[i], top = li.offsetTop, bot = top + li.offsetHeight;
      if (top < menu.scrollTop) menu.scrollTop = top;
      else if (bot > menu.scrollTop + menu.clientHeight) menu.scrollTop = bot - menu.clientHeight;
    }
    function open() {
      if (ddOpen && ddOpen !== api) ddOpen.close(false);
      ddOpen = api;
      /* Open upward when there is not room below. */
      wrap.classList.remove("dd-up");
      var r = btn.getBoundingClientRect();
      if (window.innerHeight - r.bottom < Math.min(menu.scrollHeight, 256) + 16 && r.top > window.innerHeight - r.bottom) wrap.classList.add("dd-up");
      wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      setActive(Math.max(0, sel.selectedIndex));
      menu.focus({ preventScroll: true });
    }
    function close(focusBtn) {
      if (ddOpen === api) ddOpen = null;
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      if (focusBtn) btn.focus({ preventScroll: true });
    }
    function choose(i) {
      if (sel.selectedIndex !== i) {
        sel.selectedIndex = i;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
      }
      sync();
      close(true);
    }
    var api = { close: close, wrap: wrap };
    sel._dd = api;

    btn.addEventListener("click", function () {
      if (wrap.classList.contains("is-open")) close(false); else open();
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(); }
    });
    menu.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowDown") { e.preventDefault(); setActive(Math.min(items.length - 1, active + 1)); }
      else if (k === "ArrowUp") { e.preventDefault(); setActive(Math.max(0, active - 1)); }
      else if (k === "Home") { e.preventDefault(); setActive(0); }
      else if (k === "End") { e.preventDefault(); setActive(items.length - 1); }
      else if (k === "Enter" || k === " ") { e.preventDefault(); choose(active); }
      else if (k === "Escape") { e.preventDefault(); close(true); }
      else if (k === "Tab") { close(false); }
    });
    sel.addEventListener("change", sync);
    /* A <label> around the select would focus the hidden control; open instead. */
    var lab = wrap.closest("label");
    if (lab) lab.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) { e.preventDefault(); open(); }
    });
    sync();
  }
  document.addEventListener("pointerdown", function (e) {
    if (ddOpen && !ddOpen.wrap.contains(e.target)) ddOpen.close(false);
  });
  IR.enhanceSelect = enhanceSelect;

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

    /* A priority filter only appears on lists whose cards carry a priority. */
    var prioSel = null;
    if (cards.some(function (c) { return PRIORITY[c.priority]; })) {
      prioSel = el("select", "round-select");
      prioSel.setAttribute("aria-label", "Filter by priority");
      prioSel.style.cssText = roundSel.style.cssText;
      prioSel.innerHTML = '<option value="">All priorities</option>' +
        ["high", "medium", "low"].map(function (p) {
          return '<option value="' + p + '">' + PRIORITY[p].label + ' priority</option>';
        }).join("");
    }

    var count = el("span", "result-count", cards.length + " questions");
    count.style.fontSize = "0.75rem";
    count.style.color = "var(--text-muted)";

    /* Expand / collapse every card the filters currently show. The label
       tracks reality: it reads "Collapse all" only while every visible card
       is open, and updates as cards are toggled one by one. */
    var ICON_EXPAND = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>';
    var ICON_COLLAPSE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/></svg>';
    var expandBtn = el("button", "q-expand-all");
    expandBtn.type = "button";

    bar.appendChild(searchWrap);
    bar.appendChild(expandBtn);
    bar.appendChild(roundSel);
    if (prioSel) bar.appendChild(prioSel);
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
        var matchP = !prioSel || !prioSel.value || c.priority === prioSel.value;
        var ok = matchQ && matchR && matchP;
        cardEl.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + " " + (shown === 1 ? "question" : "questions");
      empty.hidden = shown !== 0;
    }

    function visibleCards() {
      return [].slice.call(list.querySelectorAll(".q-card")).filter(function (d) { return !d.hidden; });
    }
    /* A card mid-close is still [open]; count where it is heading instead. */
    function isOpening(d) { return d.open && !d.classList.contains("is-closing"); }
    function syncExpandBtn() {
      var vis = visibleCards();
      var allOpen = vis.length > 0 && vis.every(isOpening);
      expandBtn.innerHTML = (allOpen ? ICON_COLLAPSE : ICON_EXPAND) +
        '<span>' + (allOpen ? "Collapse all" : "Expand all") + '</span>';
      expandBtn.setAttribute("aria-label", allOpen ? "Collapse all questions" : "Expand all questions");
      expandBtn.setAttribute("aria-expanded", allOpen ? "true" : "false");
      expandBtn.disabled = vis.length === 0;
      expandBtn.dataset.state = allOpen ? "collapse" : "expand";
    }
    expandBtn.addEventListener("click", function () {
      var open = expandBtn.dataset.state !== "collapse";
      var cardsNow = visibleCards();
      /* Collapsing from deep in the list: jump back to the bar first (an
         instant jump - a smooth scroll across a page that is shrinking under
         it would fight the layout change). */
      if (!open && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" });
      /* Read every position before writing any state, so the loop below does
         not force a layout per card. */
      var vh = window.innerHeight;
      var onScreen = cardsNow.map(function (d) {
        var r = d.getBoundingClientRect();
        return r.bottom > 0 && r.top < vh;
      });
      cardsNow.forEach(function (d, i) {
        if (isOpening(d) === open && !d._qAnim) return;
        if (IR.setCardOpen) IR.setCardOpen(d, open, onScreen[i]);
        else d.open = open;
      });
      syncExpandBtn();
    });
    /* toggle does not bubble, so listen in the capture phase. */
    list.addEventListener("toggle", syncExpandBtn, true);
    list.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".q-card > summary")) setTimeout(syncExpandBtn, 0);
    });

    filterInput.addEventListener("input", filter);
    roundSel.addEventListener("change", filter);
    if (prioSel) prioSel.addEventListener("change", filter);
    roundSel.setAttribute("aria-label", "Filter by round");
    enhanceSelect(roundSel);
    if (prioSel) enhanceSelect(prioSel);
    [filterInput, roundSel, prioSel].forEach(function (c) {
      if (c) c.addEventListener(c === filterInput ? "input" : "change", syncExpandBtn);
    });
    syncExpandBtn();
  }

  /* ---------- CampusX comparison modal & trigger ---------- */
  function setupCampusXSummary(host) {
    var banner = el("div", "topic-summary-action");
    banner.innerHTML =
      '<button type="button" class="campusx-summary-btn" id="campusx-summary-trigger" aria-haspopup="dialog" aria-expanded="false">' +
      '<span class="campusx-btn-badge">🚀 Summary</span>' +
      '<span class="campusx-btn-text">Langgraph - CampusX comparison with Langchain - Summary</span>' +
      '<svg class="campusx-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</button>';

    if (host.firstChild) {
      host.insertBefore(banner, host.firstChild);
    } else {
      host.appendChild(banner);
    }

    var trigger = banner.querySelector("#campusx-summary-trigger");
    var modalId = "campusx-summary-modal";
    var modalWrap = document.getElementById(modalId);

    if (!modalWrap) {
      modalWrap = el("div", "cx-modal-backdrop");
      modalWrap.id = modalId;
      modalWrap.setAttribute("role", "dialog");
      modalWrap.setAttribute("aria-modal", "true");
      modalWrap.setAttribute("aria-labelledby", "cx-modal-title");

      modalWrap.innerHTML =
        '<div class="cx-modal-dialog">' +
          '<div class="cx-modal-header">' +
            '<h2 class="cx-modal-title" id="cx-modal-title">LangChain vs. LangGraph: Topic-Wise Notes (CampusX Style) 🚀</h2>' +
            '<button type="button" class="cx-modal-close-btn" aria-label="Close summary modal">&times;</button>' +
          '</div>' +
          '<div class="cx-modal-body">' +

            '<!-- What is LangGraph? -->' +
            '<section class="cx-article-section">' +
              '<h3 class="cx-section-title">What is LangGraph? (The Big Picture) 💡</h3>' +
              '<div class="cx-quote-box">' +
                '<p class="cx-quote-lead">If LangChain is a set of Lego blocks, LangGraph is the flow chart engine that orchestrates them.</p>' +
              '</div>' +
              '<p class="cx-subhead">Think of it this way:</p>' +
              '<ul class="cx-bullet-list">' +
                '<li><strong>LangChain</strong> gives you the individual pieces&mdash;the LLMs, prompt templates, vector databases, and tools. It also lets you build simple, straight-line connections (Chains).</li>' +
                '<li><strong>LangGraph</strong> is the actual flow chart canvas. You define your tasks as Nodes (just simple Python functions) and draw the connections between them as Edges. Because it is a graph, it naturally supports loops, decision-making forks, and pausing.</li>' +
              '</ul>' +
              '<p class="cx-body-text">So, LangGraph does not replace LangChain. You still use LangChain to talk to the LLM and run tools, but you use LangGraph to decide when and how those steps run in complex, real-world systems.</p>' +
            '</section>' +

            '<!-- Why LangGraph? Key Challenges -->' +
            '<section class="cx-article-section">' +
              '<h3 class="cx-section-title">Why LangGraph? Key Challenges in LangChain &amp; How LangGraph Solves Them</h3>' +

              '<!-- Challenge 1 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">1. Control Flow (Linear Chains vs. Flexible Graphs) 🔀</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> LangChain is built for linear chains (Step A -&gt; Step B -&gt; Step C). But real-world workflows are rarely linear. If you want to build loops (like "if the manager rejects the job description, rewrite it and check again"), LangChain has no built-in way to do it. You have to write a lot of custom Python "glue code" to force it to work, which makes the project hard to manage and debug.' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> It treats your entire workflow as a Graph. Every step is a Node (a Python function), and the paths between them are Edges. It has native support for loops and conditional branching. No messy glue code required.' +
                '</div>' +
              '</div>' +

              '<!-- Challenge 2 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">2. State Management (Stateless vs. Stateful) 💾</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> LangChain is stateless. It has conversational memory to remember chat history, but it cannot easily track custom variables (like candidate_score or is_jd_approved) across different steps. To do this, you have to manually maintain a massive global Python dictionary, which is highly error-prone.' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> It is stateful by default. It uses a central State object (a shared dictionary or Pydantic model). Every single node has access to this state&mdash;they can read from it, update it, and automatically pass the updated state to the next node.' +
                '</div>' +
              '</div>' +

              '<!-- Challenge 3 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">3. Execution Style (Sequential vs. Event-Driven) ⏳</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> LangChain expects your code to run continuously from start to finish without stopping. It cannot naturally pause to wait for days or weeks for an external trigger (like waiting 7 days for candidates to apply).' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> It supports event-driven execution. Using Checkpointers, it can save the exact progress of your graph and safely pause. When the external event occurs (e.g., 7 days are up), it resumes exactly where it left off.' +
                '</div>' +
              '</div>' +

              '<!-- Challenge 4 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">4. Fault Tolerance (Starting Over vs. Resuming) 🛠️</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> If you have a long 5-step chain and your server crashes at Step 3, LangChain has no way to remember where it was. You have to restart the entire chain from Step 1.' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> Because of its stateful design, it continuously saves snapshots (checkpoints) of the execution. If a server goes down or an API fails, you don\'t lose progress. You can trigger a resume function, and LangGraph will start right from the failed node.' +
                '</div>' +
              '</div>' +

              '<!-- Challenge 5 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">5. Human-in-the-Loop (HITL) 🙋‍♂️</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> Pausing a chain to wait for human approval (like a manager signing off on a budget) is incredibly difficult. Keeping a script running for hours or days waiting for input wastes server resources and risks crashing.' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> It treats humans as a first-class feature. It works exactly like saving a video game. You can play up to Level 3 (e.g., creating a job description), save your state, shut down the game, and resume tomorrow once the human supervisor hits "Approve".' +
                '</div>' +
              '</div>' +

              '<!-- Challenge 6 -->' +
              '<div class="cx-challenge-entry">' +
                '<h4 class="cx-challenge-heading">6. Observability (Partial vs. Complete Tracing in LangSmith) 🔍</h4>' +
                '<div class="cx-point-problem">' +
                  '<strong>The Problem in LangChain:</strong> LangSmith is great, but it can only track standard LangChain components (like LLM calls). It cannot track your custom Python loops or the glue code you wrote to hold the steps together. This gives you only partial visibility into what went wrong.' +
                '</div>' +
                '<div class="cx-point-solution">' +
                  '<strong>How LangGraph Solves It:</strong> Because there is zero custom glue code and every transition is defined via LangGraph nodes and edges, LangSmith can map the entire journey. It tracks every state change, node transition, and human approval step-by-step, giving you complete observability.' +
                '</div>' +
              '</div>' +
            '</section>' +

            '<!-- Quick Summary Checklist -->' +
            '<section class="cx-article-section">' +
              '<h3 class="cx-section-title">Quick Summary Checklist: When to use what? 📋</h3>' +
              '<div class="cx-checklist-box">' +
                '<div class="cx-checklist-item">' +
                  '<span class="cx-check-bullet">🔹</span>' +
                  '<span><strong>Use LangChain</strong> when building simple, linear workflows (e.g., simple prompt chains, a quick summarizer, or a basic RAG system).</span>' +
                '</div>' +
                '<div class="cx-checklist-item">' +
                  '<span class="cx-check-bullet">🔹</span>' +
                  '<span><strong>Use LangGraph</strong> when building complex, non-linear workflows that require loops, state tracking, human approvals, or multi-agent coordination.</span>' +
                '</div>' +
              '</div>' +
            '</section>' +

          '</div>' +
          '<div class="cx-modal-footer">' +
            '<div class="cx-modal-footer-hint">' +
              '<kbd>Esc</kbd> to close' +
            '</div>' +
            '<button type="button" class="btn primary cx-modal-done-btn">Close Notes</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(modalWrap);

      var closeBtn = modalWrap.querySelector(".cx-modal-close-btn");
      var doneBtn = modalWrap.querySelector(".cx-modal-done-btn");

      function closeModal() {
        modalWrap.classList.remove("is-visible");
        document.body.classList.remove("cx-modal-open");
        var trig = document.getElementById("campusx-summary-trigger");
        if (trig) {
          trig.setAttribute("aria-expanded", "false");
          trig.focus();
        }
      }

      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      if (doneBtn) doneBtn.addEventListener("click", closeModal);

      modalWrap.addEventListener("click", function (e) {
        if (e.target === modalWrap) {
          closeModal();
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modalWrap.classList.contains("is-visible")) {
          closeModal();
        }
      });
    }

    if (trigger) {
      trigger.addEventListener("click", function () {
        var m = document.getElementById(modalId);
        if (m) {
          m.classList.add("is-visible");
          document.body.classList.add("cx-modal-open");
          trigger.setAttribute("aria-expanded", "true");
          var cb = m.querySelector(".cx-modal-close-btn");
          if (cb) cb.focus();
        }
      });
    }
  }

  /* ---------- page bootstrap: topic ---------- */
  function bootTopic() {
    var key = document.body.getAttribute("data-topic");
    var topic = (IR.topics || []).filter(function (t) { return t.num + "-" + t.slug === key; })[0];
    var set = IR.q[key];
    var head = document.querySelector("[data-topic-head]");
    var host = document.querySelector("[data-topic-body]");
    if (!topic || !set || !host) return;

    document.title = topic.title + " - Interview Room";
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

    mountList(host, set.cards, { showTopic: false });

    if (set.evening && set.evening.length) {
      var note = el("div", "note");
      note.innerHTML = "<strong>If you only have one evening:</strong> do these " +
        set.evening.length + " first - " +
        set.evening.map(function (id) {
          var c = set.cards.filter(function (x) { return x.id === id; })[0];
          return c ? '<a href="#' + esc(id) + '">' + fmt(c.q) + '</a>' : "";
        }).filter(Boolean).join(" · ");
      if (host.firstChild) {
        host.insertBefore(note, host.firstChild);
      } else {
        host.appendChild(note);
      }
    }

    /* For LangGraph, insert the CampusX summary comparison button at top before questions */
    if (key === "19-langgraph" || key === "08-langchain-langgraph") {
      setupCampusXSummary(host);
    }
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
        /* The question text only - not the priority pill or the meta chips. */
        full = titleEl ? [].filter.call(titleEl.childNodes, function (n) {
          return !(n.classList && (n.classList.contains("q-prio") || n.classList.contains("q-copy") || n.classList.contains("q-meta")));
        }).map(function (n) { return n.textContent; }).join("").trim() : h.textContent.trim();
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
          return '<a href="#' + esc(it.id) + '" data-toc="' + esc(it.id) + '">' +
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

    /* No scroll spy: reading the page never lights up the rail. A click
       flashes the chosen row - it eases in, holds briefly, then fades out
       (the slower fade lives on .toc-fade in portal.css). */
    var flashTimer = null, fadeTimer = null;
    function flash(link) {
      clearTimeout(flashTimer); clearTimeout(fadeTimer);
      links.forEach(function (l) { l.classList.remove("active", "toc-fade"); });
      void link.offsetWidth; /* restart the ease-in on a repeat click */
      link.classList.add("active");
      flashTimer = setTimeout(function () {
        link.classList.add("toc-fade");
        link.classList.remove("active");
        fadeTimer = setTimeout(function () { link.classList.remove("toc-fade"); }, 1000);
      }, 1600);
    }

    /* Question rail: scroll to the card first, then open it once the scroll
       has come to rest - opening mid-scroll would move the target while the
       page is still travelling towards it. "At rest" is detected by the scroll
       position holding still for a few frames (scrollend is not universal). */
    var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)");
    var jumpToken = 0;
    function whenScrollSettles(cb) {
      var token = ++jumpToken, last = -1, still = 0, fired = false;
      function go() {
        if (fired || token !== jumpToken) return; /* once; newest click wins */
        fired = true; cb();
      }
      (function check() {
        if (fired || token !== jumpToken) return;
        var y = window.scrollY;
        still = y === last ? still + 1 : 0;
        last = y;
        if (still >= 4) go(); else requestAnimationFrame(check);
      })();
      /* Frames can stall (background tab); the card still opens. */
      setTimeout(go, 1600);
    }
    function jumpToCard(card) {
      var smooth = !(reduceMotion && reduceMotion.matches);
      card.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
      whenScrollSettles(function () {
        /* Off-screen cards are sized by estimate (content-visibility), so the
           landing spot can drift as cards render on the way. Snap the last
           few pixels, then open. */
        var bar = document.querySelector(".topbar");
        var want = (bar ? bar.getBoundingClientRect().bottom : 0);
        if (Math.abs(card.getBoundingClientRect().top - want) > 40) card.scrollIntoView({ block: "start" });
        if (!card.open || card.classList.contains("is-closing")) {
          if (IR.animateCard) IR.animateCard(card, true); else card.open = true;
        }
      });
    }

    links.forEach(function (l) {
      l.addEventListener("click", function (e) {
        nav.classList.remove("toc-open");
        if (tocToggle) tocToggle.setAttribute("aria-expanded", "false");
        flash(l);
        var target = document.getElementById(l.getAttribute("data-toc"));
        if (!target || !target.classList.contains("q-card")) return; /* section headings: native jump */
        e.preventDefault();
        jumpToCard(target);
        /* Keep the URL shareable without the native jump; never let a
           history error (e.g. a sandboxed file:// page) block the scroll. */
        try { history.replaceState(null, "", "#" + target.id); } catch (err) {}
      });
    });
    /* Mobile auto-hide: a downward scroll slides the "Jump to section / question" bar away,
       and the first pixel of upward scroll brings it back. Near the top of the
       page it always shows. The class only has an effect at <=980px (CSS). */
    (function () {
      var mq = window.matchMedia ? window.matchMedia("(max-width: 980px)") : null;
      var lastY = Math.max(0, window.scrollY || 0), down = 0, ticking = false, hidden = false;
      function setHidden(h) {
        if (h === hidden) return;
        hidden = h;
        rail.classList.toggle("toc-rail-hidden", h);
        if (h) { nav.classList.remove("toc-open"); if (tocToggle) tocToggle.setAttribute("aria-expanded", "false"); }
      }
      function evaluate() {
        ticking = false;
        var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        var y = Math.min(max, Math.max(0, window.scrollY || 0)); /* ignore iOS overscroll bounce */
        var delta = y - lastY;
        lastY = y;
        if (mq && !mq.matches) { down = 0; setHidden(false); return; }
        if (y <= 80 || delta < 0) { down = 0; setHidden(false); return; }
        if (delta > 0) { down += delta; if (down > 12) setHidden(true); }
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(evaluate); }
      }, { passive: true });
    })();
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
    setupQuestionCardMotion();
    [].forEach.call(document.querySelectorAll("select[data-round-filter]"), function (sel) {
      enhanceSelect(sel, { inline: true });
    });
    initResizers();
    initScrollState();
    setupTips();

    document.dispatchEvent(new CustomEvent("ir:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
