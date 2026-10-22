/* Interview Room - visual explanations.

   Draws a page in visuals/<slug>.html from its scene, data/v-<slug>.js: an SVG
   of parts and links, walked through one step at a time. Hovering a part shows
   a short tip; clicking it opens the full explanation. The scene format is in
   README.md ("Visual explanations"); tools/check.js validates every scene.

   Motion follows the portal's rule for diagrams - nothing loops forever. Each
   step lights its parts, runs its packets along the arrows once, then holds.
   With reduced motion on, every step goes straight to its final state.

   Loaded only on visual pages, after portal.js; it starts through IR.onReady,
   once the scene file (added by needs() in portal.js) has loaded. */
(function () {
  "use strict";

  var IR = window.IR = window.IR || {};
  var NS = "http://www.w3.org/2000/svg";
  var mqMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var mqPhone = window.matchMedia ? window.matchMedia("(max-width: 720px)") : null;
  function reduced() { return !!(mqMotion && mqMotion.matches); }
  function isPhone() { return !!(mqPhone && mqPhone.matches); }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* Narration and explanations allow **bold** and `code`, nothing else. */
  function fmt(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
  }
  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function num(v, d) { return typeof v === "number" && isFinite(v) ? v : d; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function arr(v) { return v == null ? [] : (Array.isArray(v) ? v : [v]); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function svgEl(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  /* Text width in viewBox units. Same idea as the card diagrams (portal.js
     DIA_CH_*): an average advance per character, a little wider for bold. */
  function textW(s, fs, bold) { return String(s == null ? "" : s).length * fs * (bold ? 0.58 : 0.54); }
  function wrap(s, width, fs, bold) {
    var out = [], line = "";
    String(s == null ? "" : s).split(/\s+/).filter(Boolean).forEach(function (w) {
      var t = line ? line + " " + w : w;
      if (line && textW(t, fs, bold) > width) { out.push(line); line = w; } else line = t;
    });
    if (line) out.push(line);
    return out;
  }
  /* Seeded values, so a vector drawn from a seed looks the same on every load. */
  function seeded(seed, n) {
    var a = ((seed | 0) * 2654435761 >>> 0) || 1, out = [];
    for (var i = 0; i < n; i++) {
      a ^= a << 13; a >>>= 0; a ^= a >>> 17; a ^= a << 5; a >>>= 0;
      out.push(Math.round(((a % 2001) / 1000 - 1) * 100) / 100);
    }
    return out;
  }

  /* Font sizes in viewBox units; keep in step with the .vx-* text rules in portal.css. */
  var FS = { label: 16.5, sub: 13, chip: 14, small: 12, mono: 13, msg: 14, cap: 11.5 };
  var SPEED = 0.42;   /* packet speed, viewBox units per ms */
  var PRE = 320;      /* the pause after a step lights up, before packets move */
  var HOLD = 2500;    /* while playing, how long a step stays after its packets land */

  /* Small line icons, drawn on a 24-unit grid like the sidebar's. */
  var ICONS = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2.4.6 4 2.4 4 5.5"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    server: '<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 17.5h.01"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    graph: '<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7 7.5l4 8M17 7.5l-4 8M7.5 6h9"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
    scale: '<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    memory: '<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 7v10M11 7v10M15 7v10M19 7v10"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    loop: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3M14.5 8.5l2.5 2.5"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>'
  };
  function icon(name, x, y, size) {
    if (!ICONS[name]) return "";
    return '<g class="vx-icon" transform="translate(' + r1(x) + ',' + r1(y) + ') scale(' + r1(size / 24 * 100) / 100 + ')">' +
      ICONS[name] + '</g>';
  }

  /* Label + sub-lines, centred in a w x h area starting at `top`. */
  function labelBlock(p, g, top) {
    top = top || 0;
    var lines = p.lines ? p.lines.slice() : (p.sub ? wrap(p.sub, g.w - 20, FS.sub) : []);
    var hasLabel = p.label != null && p.label !== "";
    var lh = 16, block = (hasLabel ? 21 : 0) + lines.length * lh;
    var y0 = top + (g.h - top - block) / 2, cx = g.w / 2, out = "";
    if (hasLabel) {
      var lw = textW(p.label, FS.label, true);
      if (p.icon && ICONS[p.icon]) {
        var total = 20 + 7 + lw, sx = cx - total / 2;
        out += icon(p.icon, sx, y0, 20);
        out += '<text class="vx-label" x="' + r1(sx + 27) + '" y="' + r1(y0 + 15.5) + '">' + esc(p.label) + '</text>';
      } else {
        out += '<text class="vx-label" x="' + r1(cx) + '" y="' + r1(y0 + 15.5) + '" text-anchor="middle">' + esc(p.label) + '</text>';
      }
    }
    lines.forEach(function (l, i) {
      out += '<text class="vx-sub" x="' + r1(cx) + '" y="' + r1(y0 + (hasLabel ? 21 : 0) + 12 + i * lh) +
        '" text-anchor="middle">' + esc(l) + '</text>';
    });
    return out;
  }
  function cap(text, x, y, anchor) {
    return text ? '<text class="vx-cap" x="' + r1(x || 0) + '" y="' + r1(y) + '"' +
      (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + esc(text) + '</text>' : "";
  }
  function vecValues(p, i) {
    var v = i == null ? p.values : (p.values || [])[i];
    if (Array.isArray(v)) return v;
    return seeded(num(p.seed, 7) + (i || 0) * 31, num(p.n, 8));
  }
  function vcell(x, y, c, v, i) {
    var a = clamp(Math.abs(num(v, 0)), 0, 1);
    return '<rect class="vx-cell ' + (v < 0 ? "is-neg" : "is-pos") + '"' + (i != null ? ' data-i="' + i + '"' : '') +
      ' x="' + r1(x) + '" y="' + r1(y) + '" width="' + c + '" height="' + c + '" rx="2" style="fill-opacity:' +
      r1(0.12 + 0.88 * a) + '"/>';
  }
  function tokItem(t) { return typeof t === "object" && t ? { t: t.t, s: t.s } : { t: t, s: null }; }
  function rowsOf(scene) {
    var r = scene.rows || {};
    return { y: num(r.y, 120), gap: num(r.gap, 48) };
  }

  /* ---------- part kinds ----------
     size() returns the part's geometry for its current state (w, h, plus what
     draw() needs); draw() returns the markup in the part's own coordinates.
     `top`/`bottom` in the geometry extend the hover area past the box for a
     caption above or a label below. rowY(i) gives row centres for anchors. */
  var KINDS = {
    box: {
      size: function (p) { return { w: num(p.w, 150), h: num(p.h, 56) }; },
      draw: function (p, g) {
        var rx = p.shape === "pill" ? g.h / 2 : num(p.rx, 10);
        return '<rect class="vx-body" width="' + g.w + '" height="' + g.h + '" rx="' + rx + '"/>' + labelBlock(p, g);
      }
    },
    stack: {
      size: function (p) { var n = num(p.count, 3); return { w: num(p.w, 150), h: num(p.h, 70), n: n, top: (n - 1) * 6 }; },
      draw: function (p, g) {
        var out = "";
        for (var k = g.n - 1; k >= 1; k--) {
          out += '<rect class="vx-layer" x="' + k * 6 + '" y="' + (-k * 6) + '" width="' + g.w + '" height="' + g.h + '" rx="10"/>';
        }
        out += '<rect class="vx-body" width="' + g.w + '" height="' + g.h + '" rx="10"/>' + labelBlock(p, g);
        if (p.badge) {
          var bw = textW(p.badge, FS.small, true) + 14;
          out += '<g class="vx-badge"><rect x="' + r1(g.w - bw - 8) + '" y="8" width="' + r1(bw) + '" height="20" rx="10"/>' +
            '<text x="' + r1(g.w - 8 - bw / 2) + '" y="22.5" text-anchor="middle">' + esc(p.badge) + '</text></g>';
        }
        return out;
      }
    },
    db: {
      size: function (p) { return { w: num(p.w, 120), h: num(p.h, 84) }; },
      draw: function (p, g) {
        var w = g.w, h = g.h, ry = Math.min(10, h / 6);
        return '<path class="vx-body" d="M0,' + ry + ' V' + r1(h - ry) + ' A' + r1(w / 2) + ',' + ry + ' 0 0 0 ' + w + ',' + r1(h - ry) +
          ' V' + ry + '"/><ellipse class="vx-body vx-db-top" cx="' + r1(w / 2) + '" cy="' + ry + '" rx="' + r1(w / 2) + '" ry="' + ry + '"/>' +
          labelBlock(p, g, ry * 2);
      }
    },
    doc: {
      size: function (p) {
        var n = num(p.count, 1), lines = p.sub ? wrap(p.sub, num(p.w, 64) + 50, FS.sub) : [];
        return { w: num(p.w, 64), h: num(p.h, 80), n: n, top: (n - 1) * 6, bottom: (p.label ? 24 : 0) + lines.length * 16, lines: lines };
      },
      draw: function (p, g) {
        var w = g.w, h = g.h, out = "";
        function page(dx, dy, cls) {
          return '<g transform="translate(' + dx + ',' + dy + ')" class="' + cls + '"><path class="vx-body" d="M0,0 H' + (w - 14) +
            ' L' + w + ',14 V' + h + ' H0 Z"/><path class="vx-fold" d="M' + (w - 14) + ',0 V14 H' + w + '"/></g>';
        }
        for (var k = g.n - 1; k >= 1; k--) out += page(k * 6, -k * 6, "vx-page is-back");
        out += page(0, 0, "vx-page");
        for (var i = 0; i < 4; i++) {
          var lw = (i === 3 ? 0.45 : 0.72) * (w - 20);
          if (22 + i * 11 < h - 8) out += '<rect class="vx-doc-line" x="10" y="' + (22 + i * 11) + '" width="' + r1(lw) + '" height="4" rx="2"/>';
        }
        if (p.label) out += '<text class="vx-label is-small" x="' + r1(w / 2) + '" y="' + (h + 19) + '" text-anchor="middle">' + esc(p.label) + '</text>';
        g.lines.forEach(function (l, i) {
          out += '<text class="vx-sub" x="' + r1(w / 2) + '" y="' + (h + (p.label ? 36 : 15) + i * 16) + '" text-anchor="middle">' + esc(l) + '</text>';
        });
        return out;
      }
    },
    note: {
      size: function (p) {
        var w = num(p.w, 180), lines = p.lines || (p.sub ? wrap(p.sub, w, FS.sub) : []);
        return { w: w, h: num(p.h, (p.label ? 20 : 0) + lines.length * 16 + 2), lines: lines };
      },
      draw: function (p, g) {
        var a = p.align === "center" ? "middle" : (p.align === "right" ? "end" : "start");
        var x = a === "middle" ? g.w / 2 : (a === "end" ? g.w : 0), out = "";
        if (p.label) out += '<text class="vx-note-l" x="' + r1(x) + '" y="14" text-anchor="' + a + '">' + esc(p.label) + '</text>';
        g.lines.forEach(function (l, i) {
          out += '<text class="vx-sub" x="' + r1(x) + '" y="' + r1((p.label ? 20 : 0) + 12 + i * 16) + '" text-anchor="' + a + '">' + esc(l) + '</text>';
        });
        return out;
      }
    },
    tokens: {
      size: function (p) {
        var items = (p.items || []).map(tokItem), hasSub = items.some(function (t) { return t.s != null; });
        var ch = hasSub ? 44 : 32, gap = num(p.gap, 6), xs = [], ys = [], w = 0, h = ch;
        var ws = items.map(function (t) {
          return Math.max(32, Math.max(textW(t.t, FS.chip, true), t.s != null ? textW(t.s, 11.5) : 0) + 20);
        });
        if (p.dir === "col") {
          w = num(p.w, Math.max.apply(null, ws.concat([30])));
          items.forEach(function (t, i) { xs.push(0); ys.push(i * (ch + gap)); });
          h = items.length ? items.length * (ch + gap) - gap : ch;
          ws = ws.map(function () { return w; });
        } else {
          items.forEach(function (t, i) { xs.push(w); ys.push(0); w += ws[i] + (i < items.length - 1 ? gap : 0); });
        }
        return {
          w: Math.max(w, 32), h: h, items: items, xs: xs, ys: ys, ws: ws, ch: ch, top: p.label ? 22 : 0,
          rowY: function (i) { return (ys[i] || 0) + ch / 2; }
        };
      },
      draw: function (p, g) {
        var out = cap(p.label, 0, -8);
        g.items.forEach(function (t, i) {
          out += '<g class="vx-chip" data-i="' + i + '" transform="translate(' + r1(g.xs[i]) + ',' + r1(g.ys[i]) + ')">' +
            '<rect width="' + r1(g.ws[i]) + '" height="' + g.ch + '" rx="7"/>' +
            '<text class="vx-chip-t" x="' + r1(g.ws[i] / 2) + '" y="' + (t.s != null ? 19 : 21) + '" text-anchor="middle">' + esc(t.t) + '</text>' +
            (t.s != null ? '<text class="vx-chip-s" x="' + r1(g.ws[i] / 2) + '" y="35" text-anchor="middle">' + esc(t.s) + '</text>' : '') +
            '</g>';
        });
        return out;
      }
    },
    vector: {
      size: function (p) {
        var vals = vecValues(p), c = num(p.cell, 14), gap = 2, len = vals.length * c + (vals.length - 1) * gap;
        var col = p.dir === "col";
        return { w: col ? c : len, h: col ? len : c, vals: vals, c: c, gap: gap, top: p.label ? 20 : 0 };
      },
      draw: function (p, g) {
        var out = cap(p.label, 0, -8), col = p.dir === "col";
        g.vals.forEach(function (v, i) {
          out += vcell(col ? 0 : i * (g.c + g.gap), col ? i * (g.c + g.gap) : 0, g.c, v, i);
        });
        return out;
      }
    },
    matrix: {
      size: function (p) {
        var rows = p.rows || [], cols = p.cols || rows, c = num(p.cell, 26);
        var lw = rows.length ? Math.max.apply(null, rows.map(function (r) { return textW(r, FS.small, true); })) + 12 : 0;
        var lh = p.colLabels === "none" ? 0 : (p.colLabels === "flat" ? 18 :
          Math.max.apply(null, cols.map(function (r) { return textW(r, FS.small, true); }).concat([10])) * 0.68 + 12);
        return {
          w: lw + cols.length * c, h: lh + rows.length * c, rows: rows, cols: cols, c: c, lw: lw, lh: lh,
          top: p.label ? 20 : 0, rowY: function (i) { return lh + i * c + c / 2; }
        };
      },
      draw: function (p, g) {
        var out = cap(p.label, 0, -8), vals = p.values || [];
        g.rows.forEach(function (r, i) {
          out += '<g class="vx-mrow" data-i="' + i + '"><rect class="vx-mrow-bg" x="' + r1(g.lw - 4) + '" y="' + r1(g.lh + i * g.c + 1) +
            '" width="' + r1(g.w - g.lw + 6) + '" height="' + (g.c - 2) + '" rx="6"/>' +
            '<text class="vx-mlabel" x="' + r1(g.lw - 8) + '" y="' + r1(g.lh + i * g.c + g.c / 2 + 4.5) + '" text-anchor="end">' + esc(r) + '</text>';
          g.cols.forEach(function (cn, j) {
            var cx = r1(g.lw + j * g.c + g.c / 2), cy = r1(g.lh + i * g.c + g.c / 2);
            if (p.mask === "causal" && j > i) {
              out += '<circle class="vx-mdot is-masked" cx="' + cx + '" cy="' + cy + '" r="2"/>';
            } else {
              var v = clamp(num((vals[i] || [])[j], 0), 0, 1);
              out += '<circle class="vx-mdot" cx="' + cx + '" cy="' + cy + '" r="' + r1(2.5 + v * (g.c / 2 - 4.5)) +
                '" style="fill-opacity:' + r1(0.25 + 0.75 * v) + '"/>';
            }
          });
          out += '</g>';
        });
        if (p.colLabels !== "none") {
          g.cols.forEach(function (cn, j) {
            var x = g.lw + j * g.c + g.c / 2;
            out += p.colLabels === "flat"
              ? '<text class="vx-mlabel" x="' + r1(x) + '" y="12" text-anchor="middle">' + esc(cn) + '</text>'
              : '<text class="vx-mlabel" transform="translate(' + r1(x - 2) + ',' + r1(g.lh - 6) + ') rotate(-42)">' + esc(cn) + '</text>';
          });
        }
        return out;
      }
    },
    bars: {
      size: function (p) {
        var items = p.items || [], rh = num(p.rowH, 28);
        return { w: num(p.w, 280), h: Math.max(rh, items.length * rh), items: items, rh: rh, lw: num(p.lw, 92), top: p.label ? 20 : 0 };
      },
      draw: function (p, g) {
        var bw = g.w - g.lw - 54, out = cap(p.label, 0, -8);
        g.items.forEach(function (it, i) {
          var y = i * g.rh;
          out += '<g class="vx-barrow" data-i="' + i + '">' +
            '<text class="vx-bar-l" x="' + (g.lw - 8) + '" y="' + r1(y + g.rh / 2 + 5) + '" text-anchor="end">' + esc(it.label) + '</text>' +
            '<rect class="vx-bar-track" x="' + g.lw + '" y="' + r1(y + 5) + '" width="' + r1(bw) + '" height="' + (g.rh - 10) + '" rx="4"/>' +
            '<rect class="vx-bar" x="' + g.lw + '" y="' + r1(y + 5) + '" width="' + r1(bw) + '" height="' + (g.rh - 10) + '" rx="4" style="transform:scaleX(' +
              barScale(it, p) + ')"/>' +
            '<text class="vx-bar-v" x="' + r1(g.lw + bw + 8) + '" y="' + r1(y + g.rh / 2 + 5) + '">' + esc(barText(it, p)) + '</text></g>';
        });
        return out;
      },
      /* Same rows as before: move the bars instead of redrawing, so they slide. */
      update: function (el, p, g) {
        var rows = el.querySelectorAll(".vx-barrow");
        if (!rows.length || rows.length !== g.items.length || el.getAttribute("data-w") !== String(g.w)) return false;
        g.items.forEach(function (it, i) {
          rows[i].querySelector(".vx-bar").style.transform = "scaleX(" + barScale(it, p) + ")";
          rows[i].querySelector(".vx-bar-v").textContent = barText(it, p);
          rows[i].querySelector(".vx-bar-l").textContent = it.label;
        });
        return true;
      }
    },
    col: {
      size: function (p, scene) {
        var R = rowsOf(scene), n = colCount(p, scene), ch = colCellH(p), w = num(p.w, colW(p));
        return {
          w: w, h: (n - 1) * R.gap + ch, n: n, R: R, ch: ch, y0: R.y - ch / 2, top: p.label ? 22 : 0,
          rowY: function (i) { return ch / 2 + i * R.gap; }
        };
      },
      draw: function (p, g) {
        var out = cap(p.label, p.cell === "text" && p.align !== "left" ? g.w : 0, -9, p.cell === "text" && p.align !== "left" ? "end" : null);
        for (var i = 0; i < g.n; i++) {
          var cy = g.ch / 2 + i * g.R.gap, top = cy - g.ch / 2;
          out += '<g class="vx-crow" data-i="' + i + '" transform="translate(0,' + r1(top) + ')">' +
            '<rect class="vx-crow-bg" x="-4" y="-3" width="' + r1(g.w + 8) + '" height="' + (g.ch + 6) + '" rx="7"/>';
          if (p.cell === "text") {
            var right = p.align !== "left";
            out += '<text class="vx-col-t" x="' + (right ? g.w : 0) + '" y="' + r1(g.ch / 2 + 5.5) + '"' + (right ? ' text-anchor="end"' : '') + '>' +
              esc((p.items || [])[i]) + '</text>';
          } else if (p.cell === "chip") {
            out += '<rect class="vx-colchip" width="' + g.w + '" height="' + g.ch + '" rx="6"/>' +
              '<text class="vx-chip-t is-mono" x="' + r1(g.w / 2) + '" y="' + r1(g.ch / 2 + 5) + '" text-anchor="middle">' + esc((p.items || [])[i]) + '</text>';
          } else if (p.cell === "qkv") {
            ["q", "k", "v"].forEach(function (k, j) {
              out += '<g class="vx-qkv vx-t-' + k + '" transform="translate(' + (j * 24) + ',0)"><rect width="20" height="' + g.ch + '" rx="4"/>' +
                '<text x="10" y="' + r1(g.ch / 2 + 4.5) + '" text-anchor="middle">' + k.toUpperCase() + '</text></g>';
            });
          } else if (p.cell === "dot") {
            out += '<circle class="vx-coldot" cx="' + r1(g.w / 2) + '" cy="' + r1(g.ch / 2) + '" r="5"/>';
          } else {
            var vals = vecValues(p, i), c = num(p.cellSize, 10);
            vals.forEach(function (v, j) { out += vcell(j * (c + 1.5), (g.ch - c) / 2, c, v); });
          }
          out += '</g>';
        }
        return out;
      }
    },
    code: {
      size: function (p) {
        var lines = p.lines || [];
        var w = num(p.w, Math.max.apply(null, lines.map(function (l) { return textW(l, FS.mono) * 1.12; }).concat([120])) + 28);
        return { w: w, h: num(p.h, (p.title ? 36 : 12) + lines.length * 18 + 10), lines: lines };
      },
      draw: function (p, g) {
        var top = p.title ? 36 : 12;
        var out = '<rect class="vx-code-bg" width="' + r1(g.w) + '" height="' + r1(g.h) + '" rx="10"/>';
        if (p.title) {
          out += '<text class="vx-code-title" x="14" y="21">' + esc(p.title) + '</text>' +
            '<line class="vx-code-rule" x1="0" x2="' + r1(g.w) + '" y1="30" y2="30"/>';
        }
        g.lines.forEach(function (l, i) {
          out += '<g class="vx-code-line" data-i="' + i + '"><rect class="vx-code-hl" x="5" y="' + r1(top + i * 18 - 1) +
            '" width="' + r1(g.w - 10) + '" height="18" rx="3"/><text class="vx-code-t" x="14" y="' + r1(top + i * 18 + 13) + '">' +
            esc(l) + '</text></g>';
        });
        return out;
      }
    },
    msg: {
      size: function (p) {
        var w = num(p.w, 260), lines = p.lines || wrap(p.text, w - 26, FS.msg);
        return { w: w, h: num(p.h, (p.role ? 32 : 14) + lines.length * 19 + 6), lines: lines, bottom: 10 };
      },
      draw: function (p, g) {
        var tail = p.side === "r" ? "M" + (g.w - 28) + "," + (g.h - 1) + " l14,10 l-2,-10z" : "M14," + (g.h - 1) + " l-2,10 l14,-10z";
        var out = '<path class="vx-body vx-tail" d="' + tail + '"/><rect class="vx-body" width="' + g.w + '" height="' + g.h + '" rx="12"/>';
        if (p.role) out += '<text class="vx-role" x="13" y="21">' + esc(p.role) + '</text>';
        g.lines.forEach(function (l, i) {
          out += '<text class="vx-msg-t" x="13" y="' + r1((p.role ? 32 : 14) + 14 + i * 19) + '">' + esc(l) + '</text>';
        });
        return out;
      }
    },
    /* A 2-D map: points at fractions of the box (0,0 bottom-left), each with
       an optional label and tone; rings mark a search radius. */
    scatter: {
      size: function (p) { return { w: num(p.w, 300), h: num(p.h, 220), top: p.label ? 20 : 0 }; },
      draw: function (p, g) {
        var out = cap(p.label, 0, -8) + '<rect class="vx-plot" width="' + g.w + '" height="' + g.h + '" rx="10"/>';
        arr(p.rings).forEach(function (r) {
          out += '<circle class="vx-plot-ring" cx="' + r1(num(r.x, 0.5) * g.w) + '" cy="' + r1((1 - num(r.y, 0.5)) * g.h) +
            '" r="' + r1(num(r.r, 0.15) * Math.min(g.w, g.h)) + '"/>';
        });
        arr(p.points).forEach(function (pt, i) {
          var x = num(pt.x, 0.5) * g.w, y = (1 - num(pt.y, 0.5)) * g.h, rad = num(pt.r, 5);
          out += '<g class="vx-pt' + (pt.tone ? " vx-t-" + pt.tone : "") + (pt.query ? " is-query" : "") + '" data-i="' + i + '">' +
            '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + rad + '"/>' +
            (pt.label ? '<text x="' + r1(x + rad + 4) + '" y="' + r1(y + 4) + '">' + esc(pt.label) + '</text>' : '') + '</g>';
        });
        return out;
      }
    },
    art: {
      size: function (p) { return { w: num(p.w, 100), h: num(p.h, 100) }; },
      draw: function (p) { return String(p.svg || ""); }
    }
  };
  function barScale(it, p) { return clamp(num(it.value, 0) / num(p.max, 1), 0, 1).toFixed(3); }
  function barText(it, p) {
    if (it.text != null) return it.text;
    return p.fmt === "raw" ? String(it.value) : Math.round(num(it.value, 0) * 1000) / 10 + "%";
  }
  function colCount(p, scene) {
    if (p.items) return p.items.length;
    if (Array.isArray(p.values)) return p.values.length;
    return num(p.rows, (scene.rows && scene.rows.count) || 5);
  }
  function colCellH(p) { return p.cell === "text" ? 26 : (p.cell === "vec" || !p.cell ? 14 : 26); }
  function colW(p) {
    if (p.cell === "qkv") return 68;
    if (p.cell === "dot") return 14;
    if (p.cell === "text") return Math.max.apply(null, (p.items || [""]).map(function (t) { return textW(t, 15, true); }).concat([30]));
    if (p.cell === "chip") return Math.max.apply(null, (p.items || [""]).map(function (t) { return textW(t, FS.chip) + 16; }).concat([34]));
    return num(p.n, 8) * (num(p.cellSize, 10) + 1.5) - 1.5;
  }

  /* Halo (lit / hover), the part itself, focus ring, then a transparent hit
     area on top so the whole box responds, gaps between chips included. */
  function frame(g, inner) {
    var t = g.top || 0, b = g.bottom || 0;
    return '<rect class="vx-halo" x="-6" y="' + (-6 - t) + '" width="' + r1(g.w + 12) + '" height="' + r1(g.h + 12 + t + b) + '" rx="14"/>' +
      inner +
      '<rect class="vx-ring" x="-8" y="' + (-8 - t) + '" width="' + r1(g.w + 16) + '" height="' + r1(g.h + 16 + t + b) + '" rx="15"/>' +
      '<rect class="vx-hit" x="-6" y="' + (-6 - t) + '" width="' + r1(g.w + 12) + '" height="' + r1(g.h + 12 + t + b) + '"/>';
  }

  /* ---------- link geometry ---------- */
  function autoSide(g, toward) {
    var dx = toward.x - (g.x + g.w / 2), dy = toward.y - (g.y + g.h / 2);
    if (Math.abs(dx) * 0.6 > Math.abs(dy)) return dx > 0 ? "r" : "l";
    return dy > 0 ? "b" : "t";
  }
  function roundedPolyline(pts, r) {
    var d = "M" + r1(pts[0][0]) + "," + r1(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var rr = Math.min(r, l1 / 2, l2 / 2);
      var a = [p1[0] - (p1[0] - p0[0]) / (l1 || 1) * rr, p1[1] - (p1[1] - p0[1]) / (l1 || 1) * rr];
      var b = [p1[0] + (p2[0] - p1[0]) / (l2 || 1) * rr, p1[1] + (p2[1] - p1[1]) / (l2 || 1) * rr];
      d += " L" + r1(a[0]) + "," + r1(a[1]) + " Q" + r1(p1[0]) + "," + r1(p1[1]) + " " + r1(b[0]) + "," + r1(b[1]);
    }
    var last = pts[pts.length - 1];
    return d + " L" + r1(last[0]) + "," + r1(last[1]);
  }
  function pathFor(a, b, style, via) {
    if (via && via.length) return roundedPolyline([[a.x, a.y]].concat(via).concat([[b.x, b.y]]), 12);
    if (style === "straight") return "M" + r1(a.x) + "," + r1(a.y) + " L" + r1(b.x) + "," + r1(b.y);
    if (style === "elbow") {
      if (a.ny === 0 && a.nx !== 0) {
        var mx = (a.x + b.x) / 2;
        return roundedPolyline([[a.x, a.y], [mx, a.y], [mx, b.y], [b.x, b.y]], 12);
      }
      var my = (a.y + b.y) / 2;
      return roundedPolyline([[a.x, a.y], [a.x, my], [b.x, my], [b.x, b.y]], 12);
    }
    var d = Math.max(28, Math.hypot(b.x - a.x, b.y - a.y) * 0.42);
    return "M" + r1(a.x) + "," + r1(a.y) + " C" + r1(a.x + a.nx * d) + "," + r1(a.y + a.ny * d) + " " +
      r1(b.x + b.nx * d) + "," + r1(b.y + b.ny * d) + " " + r1(b.x) + "," + r1(b.y);
  }

  /* ---------- the hover tip (one per page) ---------- */
  var tip = null, tipFor = null;
  function tipEl() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "term-tip vx-tip";
    tip.id = "vx-tip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }
  function tipShow(target, c) {
    if (!c) return;
    var t = tipEl();
    if (tipFor && tipFor !== target) tipFor.removeAttribute("aria-describedby");
    tipFor = target;
    t.innerHTML = '<strong class="vx-tip-t">' + esc(c.title) + '</strong><span class="vx-tip-b">' + fmt(c.tip) + '</span>' +
      '<span class="vx-tip-h">' + (window.matchMedia && matchMedia("(hover: hover)").matches ? "Click" : "Tap") +
      ' for the full explanation</span>';
    t.hidden = false;
    target.setAttribute("aria-describedby", "vx-tip");
    var r = (target.querySelector(".vx-hit") || target).getBoundingClientRect();
    var w = t.offsetWidth, h = t.offsetHeight, m = 8;
    var left = clamp(r.left + r.width / 2 - w / 2, m, window.innerWidth - w - m);
    var top = r.top - h - 10;
    if (top < m + 50) top = r.bottom + 10;
    if (top + h > window.innerHeight - m) top = Math.max(m, r.top - h - 10);
    t.style.left = left + "px";
    t.style.top = top + "px";
  }
  function tipHide() {
    if (tipFor) tipFor.removeAttribute("aria-describedby");
    tipFor = null;
    if (tip) tip.hidden = true;
  }

  /* ---------- the explanation popup (one native <dialog> per page) ----------
     showModal() traps focus, closes on Esc and makes the page inert. While it
     is open a capture-phase guard keeps Esc, F and / from also reaching the
     portal's focus-mode and search shortcuts underneath. */
  var dlg = null, dlgReturn = null;
  function guard(e) {
    if (e.key === "Escape" || e.key === "f" || e.key === "F" || e.key === "/") e.stopPropagation();
  }
  function dialogEl() {
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.className = "vx-dialog";
    dlg.setAttribute("aria-labelledby", "vx-d-title");
    dlg.innerHTML =
      '<div class="vx-d-inner">' +
        '<div class="vx-d-head"><div class="vx-d-heading"><div class="vx-d-eyebrow"></div>' +
          '<h2 class="vx-d-title" id="vx-d-title"></h2></div>' +
          '<button type="button" class="vx-d-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" ' +
          'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<div class="vx-d-body"></div>' +
      '</div>';
    document.body.appendChild(dlg);
    dlg.querySelector(".vx-d-close").addEventListener("click", function () { dlg.close(); });
    /* A click on the backdrop lands on the <dialog> itself; the content sits in .vx-d-inner. */
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () {
      window.removeEventListener("keydown", guard, true);
      document.documentElement.classList.remove("vx-lock");
      var back = dlgReturn;
      dlgReturn = null;
      if (back && back.isConnected) { try { back.focus({ preventScroll: true }); } catch (err) { back.focus(); } }
    });
    return dlg;
  }
  function openDialog(c, eyebrow, returnTo) {
    if (!c) return;
    var d = dialogEl();
    tipHide();
    d.querySelector(".vx-d-eyebrow").textContent = eyebrow;
    d.querySelector(".vx-d-title").textContent = c.title;
    d.querySelector(".vx-d-body").innerHTML =
      arr(c.detail).map(function (para) { return '<p>' + fmt(para) + '</p>'; }).join("") +
      (c.oneLiner ? '<div class="vx-d-say"><span class="vx-d-say-l">Say it in the interview</span><p>' + fmt(c.oneLiner) + '</p></div>' : '');
    dlgReturn = returnTo || document.activeElement;
    window.addEventListener("keydown", guard, true);
    document.documentElement.classList.add("vx-lock");
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
    d.querySelector(".vx-d-body").scrollTop = 0;
  }

  /* ---------- the player ---------- */
  function Player(host, meta, scene) {
    var self = this;
    this.host = host;
    this.meta = meta;
    this.scene = scene;
    this.steps = scene.steps || [];
    this.view = scene.view || [1200, 640];
    this.concepts = scene.concepts || {};
    this.cur = -1;
    this.playing = false;
    this.follow = true;
    this.timer = 0;
    this.raf = 0;
    this.camRaf = 0;
    this.plan = null;
    this.pkEls = [];
    this.geo = {};
    this.shown = {};
    this.partEls = {};
    this.linkEls = {};
    this.zoneEls = {};
    this.debug = /[?&]debug\b/.test(location.search);
    this.parts = scene.parts || [];
    this.links = scene.links || [];
    this.zones = scene.zones || [];
    this.partById = {};
    this.parts.forEach(function (p) { self.partById[p.id] = p; });
    this.states = this.buildStates();
    this.vb = [0, 0, this.view[0], this.view[1]];
  }
  var P = Player.prototype;

  /* Each step's lasting state, worked out once from deep copies: the base
     scene plus every step's `set`, applied in order. Arrays replace rather
     than merge. Emphasis (focus, flow, packets, hl) is not in here - it
     belongs to its own step only. */
  P.buildStates = function () {
    var run = {};
    this.parts.forEach(function (p) { run[p.id] = clone(p); });
    this.links.forEach(function (l) { run[l.id] = { hidden: !!l.hidden }; });
    this.zones.forEach(function (z) { run[z.id] = { hidden: !!z.hidden }; });
    return this.steps.map(function (s) {
      Object.keys(s.set || {}).forEach(function (id) {
        if (!run[id]) return;
        var ch = s.set[id];
        Object.keys(ch).forEach(function (k) { run[id][k] = clone(ch[k]); });
      });
      return clone(run);
    });
  };

  P.mount = function () {
    var self = this, meta = this.meta, steps = this.steps, n = steps.length;
    var concepts = this.conceptOrder();
    var v = IR.visuals || [], vi = -1;
    v.forEach(function (x, i) { if (x.slug === meta.slug) vi = i; });

    var h = '';
    h += '<div class="page-head vx-head">' +
      '<div class="eyebrow">Visual explanation · ' + n + ' steps</div>' +
      '<h1>' + esc(meta.headline || meta.title) + '</h1>' +
      '<p class="lede">' + fmt(meta.blurb) + '</p>' +
      '<p class="vx-how"><span class="vx-how-mouse">Press <strong>Play</strong>, or step with <kbd>←</kbd> <kbd>→</kbd>. ' +
        'Hover any part of the diagram for a quick explanation; click it for the full story.</span>' +
        '<span class="vx-how-touch">Press <strong>Play</strong> or step through. Tap any part of the diagram for the full story.</span></p>' +
      '</div>';

    /* One card: controls, the diagram, then the narration and timeline - sized
       in portal.css so the whole card fits on a laptop screen at once. */
    h += '<section class="vx" aria-label="' + esc(meta.title) + ', animated diagram">' +
        '<div class="vx-controls">' +
          '<button type="button" class="vx-btn vx-play" data-vx="play"><span class="vx-play-ico" aria-hidden="true"></span><span class="vx-play-l">Play</span></button>' +
          '<button type="button" class="vx-btn vx-step-btn" data-vx="prev" aria-label="Previous step"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button>' +
          '<button type="button" class="vx-btn vx-step-btn" data-vx="next" aria-label="Next step"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button>' +
          '<span class="vx-count">Step <b class="vx-count-n">1</b> of ' + n + '</span>' +
        '</div>' +
      '<div class="vx-stage">' +
        '<svg class="vx-svg" viewBox="0 0 ' + this.view[0] + ' ' + this.view[1] + '" preserveAspectRatio="xMidYMid meet" role="group" ' +
          'aria-label="Diagram: ' + esc(meta.headline || meta.title) + '. Tab through the parts; press Enter on one for its full explanation."></svg>' +
        '<button type="button" class="vx-zoom" hidden></button>' +
      '</div>' +
      '<div class="vx-panel">' +
        '<div class="vx-narr" aria-live="polite" aria-atomic="true"><p class="vx-narr-title"></p><p class="vx-narr-text"></p></div>' +
        '<div class="vx-timeline" role="group" aria-label="Steps">' +
          steps.map(function (s, i) {
            return '<button type="button" class="vx-seg" data-step="' + i + '" aria-label="Step ' + (i + 1) + ': ' + esc(s.title) + '" title="' +
              (i + 1) + '. ' + esc(s.title) + '"><span class="vx-seg-bar"><span class="vx-seg-fill"></span></span></button>';
          }).join("") +
        '</div>' +
        '<p class="vx-caption">' + esc(this.scene.caption || "Numbers and words in the diagram are illustrative. They show how it works, not output from a real model.") + '</p>' +
      '</div>' +
    '</section>';

    if (concepts.length) {
      h += '<h2>Every part, explained</h2>' +
        '<p class="section-sub">The same explanations you get by clicking the diagram, one card per part.</p>' +
        '<div class="vx-parts">' + concepts.map(function (id) {
          var c = self.concepts[id];
          return '<button type="button" class="vx-pcard" data-concept="' + esc(id) + '"><span class="vx-pcard-t">' + esc(c.title) + '</span>' +
            '<span class="vx-pcard-b">' + fmt(c.tip) + '</span></button>';
        }).join("") + '</div>';
    }

    h += '<h2>Step by step</h2><ol class="vx-steps">' + steps.map(function (s, i) {
      return '<li><button type="button" class="vx-steps-go" data-step="' + i + '">' + esc(s.title) + '</button><p>' + fmt(s.text) + '</p></li>';
    }).join("") + '</ol>';

    h += this.practiseHTML();

    if (vi >= 0 && v.length > 1) {
      var prev = v[vi - 1], next = v[vi + 1];
      h += '<nav class="page-nav vx-pager" aria-label="Previous and next visual">' +
        '<p class="pn-progress">Visual ' + (vi + 1) + ' of ' + v.length + ' · ' + esc(meta.title) + '</p>' +
        (prev ? '<a class="pn-link pn-prev prev" href="' + esc(prev.slug) + '.html"><div class="dir pn-dir">← Previous visual</div><div class="ttl pn-ttl">' + esc(prev.title) + '</div></a>' : '') +
        (next ? '<a class="pn-link pn-next next" href="' + esc(next.slug) + '.html"><div class="dir pn-dir">Next visual →</div><div class="ttl pn-ttl">' + esc(next.title) + '</div></a>'
              : '<a class="pn-link pn-next next" href="../visuals.html"><div class="dir pn-dir">Finish →</div><div class="ttl pn-ttl">All visual explanations</div></a>') +
        '</nav>';
    }

    this.host.innerHTML = h;
    this.svg = this.host.querySelector(".vx-svg");
    this.zoomBtn = this.host.querySelector(".vx-zoom");
    this.playBtn = this.host.querySelector('[data-vx="play"]');
    this.buildScene();
    this.bind();
    var start = stepFromHash(n);
    this.go(start == null ? 0 : start, { initial: true });
  };

  /* Concepts in walkthrough order: by the first step that lights one of
     their parts, then by where the part sits in the scene. */
  P.conceptOrder = function () {
    var self = this, first = {}, seen = {}, out = [];
    this.steps.forEach(function (s, i) {
      arr(s.focus).forEach(function (id) {
        var p = self.partById[id];
        if (p && p.concept && first[p.concept] == null) first[p.concept] = i;
      });
    });
    this.parts.forEach(function (p, k) {
      if (!p.concept || !self.concepts[p.concept] || seen[p.concept]) return;
      seen[p.concept] = 1;
      out.push({ id: p.concept, s: first[p.concept] == null ? 999 : first[p.concept], k: k });
    });
    out.sort(function (a, b) { return a.s - b.s || a.k - b.k; });
    return out.map(function (o) { return o.id; });
  };

  P.practiseHTML = function () {
    var meta = this.meta, rows = (IR.catalog && IR.catalog.cards) || [], byId = {};
    rows.forEach(function (r) { byId[r[0]] = r; });
    var items = arr(meta.practise).map(function (id) { return byId[id]; }).filter(Boolean);
    var primary = arr(meta.topics)[0], topic = (IR.topics || []).filter(function (t) { return t.num + "-" + t.slug === primary; })[0];
    if (!items.length && !topic) return "";
    return '<h2>Practise these questions</h2>' +
      '<p class="section-sub">Each opens in the question popup, where you can read the answer and rate yourself.</p>' +
      '<ul class="vx-practise">' + items.map(function (r) {
        var t = (IR.topics || []).filter(function (x) { return x.num + "-" + x.slug === r[1]; })[0];
        return '<li><a href="../topics/' + esc(r[1]) + '.html#' + esc(r[0]) + '">' + esc(r[2]) + '</a>' +
          (t ? '<span class="vx-practise-topic">' + esc(t.title) + '</span>' : '') + '</li>';
      }).join("") + '</ul>' +
      (topic ? '<p class="vx-alltopic"><a href="../topics/' + esc(primary) + '.html">All ' + esc(topic.title) + ' questions →</a></p>' : '');
  };

  P.buildScene = function () {
    var self = this;
    this.svg.innerHTML = '<g class="vx-zones"></g><g class="vx-links"></g><g class="vx-parts"></g><g class="vx-packets" aria-hidden="true"></g>';
    this.gZones = this.svg.querySelector(".vx-zones");
    this.gLinks = this.svg.querySelector(".vx-links");
    this.gParts = this.svg.querySelector(".vx-parts");
    this.gPackets = this.svg.querySelector(".vx-packets");
    this.zones.forEach(function (z) {
      var g = svgEl("g", { "class": "vx-zone vx-t-" + (z.tone || "neutral"), "data-zone": z.id });
      g.innerHTML = '<rect class="vx-zone-box" x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" rx="16"/>' +
        (z.label ? '<text class="vx-zone-l" x="' + (z.x + 14) + '" y="' + (z.y + 22) + '">' + esc(z.label) + '</text>' : '') +
        (z.sub ? '<text class="vx-zone-s" x="' + (z.x + 14) + '" y="' + (z.y + 38) + '">' + esc(z.sub) + '</text>' : '');
      self.gZones.appendChild(g);
      self.zoneEls[z.id] = g;
    });
    this.links.forEach(function (l) {
      var g = svgEl("g", {
        "class": "vx-link vx-t-" + (l.tone || "neutral") + (l.kind === "ribbon" ? " vx-ribbon" : "") + (l.dashed ? " is-dashed" : ""),
        "data-link": l.id
      });
      self.gLinks.appendChild(g);
      self.linkEls[l.id] = { g: g, d: null };
    });
    this.parts.forEach(function (p) {
      var c = p.concept && self.concepts[p.concept];
      var g = svgEl("g", { "class": "vx-part vx-k-" + p.kind + " vx-t-" + (p.tone || "neutral") + (p.keep ? " vx-keep" : ""), "data-part": p.id });
      if (c) {
        g.setAttribute("data-concept", p.concept);
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", c.title);
      }
      self.gParts.appendChild(g);
      self.partEls[p.id] = g;
    });
  };

  P.drawPart = function (id, p) {
    var el = this.partEls[id], K = KINDS[p.kind] || KINDS.box;
    var g = K.size(p, this.scene);
    g.x = num(p.x, 0);
    g.y = p.kind === "col" ? g.y0 : num(p.y, 0);
    this.geo[id] = g;
    el.setAttribute("transform", "translate(" + r1(g.x) + "," + r1(g.y) + ")");
    if (!(K.update && K.update(el, p, g))) {
      el.innerHTML = frame(g, K.draw(p, g, this.scene));
      el.setAttribute("data-w", String(g.w));
    }
  };

  P.anchor = function (spec, toward) {
    if (Array.isArray(spec)) return { x: spec[0], y: spec[1], nx: 0, ny: 0 };
    var m = /^([\w-]+)(?::([lrtbc]))?(?::([\d.]+)|@(\d+))?$/.exec(String(spec));
    if (!m) return null;
    var g = this.geo[m[1]];
    if (!g) {
      var z = this.zones.filter(function (q) { return q.id === m[1]; })[0];
      if (!z) return null;
      g = { x: z.x, y: z.y, w: z.w, h: z.h };
    }
    var side = m[2] || autoSide(g, toward || { x: g.x + g.w + 1, y: g.y + g.h / 2 });
    var f = m[3] != null ? parseFloat(m[3]) : 0.5;
    if (m[4] != null && g.rowY && (side === "l" || side === "r")) {
      return { x: side === "l" ? g.x : g.x + g.w, y: g.y + g.rowY(+m[4]), nx: side === "l" ? -1 : 1, ny: 0 };
    }
    if (side === "l") return { x: g.x, y: g.y + g.h * f, nx: -1, ny: 0 };
    if (side === "r") return { x: g.x + g.w, y: g.y + g.h * f, nx: 1, ny: 0 };
    if (side === "t") return { x: g.x + g.w * f, y: g.y - (g.top || 0), nx: 0, ny: -1 };
    if (side === "b") return { x: g.x + g.w * f, y: g.y + g.h + (g.bottom || 0), nx: 0, ny: 1 };
    return { x: g.x + g.w / 2, y: g.y + g.h / 2, nx: 0, ny: 0 };
  };
  function centreOf(self, spec) {
    if (Array.isArray(spec)) return { x: spec[0], y: spec[1] };
    var g = self.geo[String(spec).split(/[:@]/)[0]];
    return g ? { x: g.x + g.w / 2, y: g.y + g.h / 2 } : { x: 0, y: 0 };
  }

  /* The path(s) for a link in the current geometry: one for an arrow or a
     line, one per row for a ribbon. Ends are pulled back from the box edge so
     the arrowhead tip lands on it. */
  P.linkPaths = function (l) {
    var self = this;
    if (l.path) return [l.path];
    if (l.kind === "ribbon") {
      var ga = this.geo[l.from], gb = this.geo[l.to];
      if (!ga || !gb) return [];
      var n = ga.rowY ? (ga.n || (ga.items || []).length) : (gb.n || (gb.items || []).length);
      var rows = l.rows ? arr(l.rows) : Array.apply(null, { length: n }).map(function (x, i) { return i; });
      return rows.map(function (i) {
        var y0 = ga.rowY ? ga.y + ga.rowY(i) : ga.y + (i + 0.5) * ga.h / n;
        var y1 = gb.rowY ? gb.y + gb.rowY(i) : gb.y + (i + 0.5) * gb.h / n;
        var x0 = ga.x + ga.w + 6, x1 = gb.x - 6, dx = (x1 - x0) * 0.5;
        return "M" + r1(x0) + "," + r1(y0) + " C" + r1(x0 + dx) + "," + r1(y0) + " " + r1(x1 - dx) + "," + r1(y1) + " " + r1(x1) + "," + r1(y1);
      });
    }
    var ca = centreOf(this, l.from), cb = centreOf(this, l.to);
    var a = this.anchor(l.from, cb), b = this.anchor(l.to, ca);
    if (!a || !b) return [];
    var gapA = l.kind === "line" ? 0 : 3, gapB = (l.kind === "line" || l.arrow === false) ? 0 : 4;
    a = { x: a.x + a.nx * gapA, y: a.y + a.ny * gapA, nx: a.nx, ny: a.ny };
    b = { x: b.x + b.nx * gapB, y: b.y + b.ny * gapB, nx: b.nx, ny: b.ny };
    return [pathFor(a, b, l.style, l.via)];
  };

  P.drawLink = function (l) {
    var rec = this.linkEls[l.id], ds = this.linkPaths(l), key = ds.join("|");
    if (rec.d === key) return;
    rec.d = key;
    var g = rec.g;
    g.innerHTML = ds.map(function (d) { return '<path class="vx-wire" d="' + d + '"/>'; }).join("");
    var first = g.querySelector(".vx-wire");
    if (!first || l.kind === "ribbon") return;
    var len = first.getTotalLength(), extra = "";
    var arrowAt = function (atEnd) {
      var tipPt = first.getPointAtLength(atEnd ? len : 0), back = first.getPointAtLength(atEnd ? Math.max(0, len - 2) : Math.min(len, 2));
      var ang = Math.atan2(tipPt.y - back.y, tipPt.x - back.x), L = 9, W = 4.5;
      var bx = tipPt.x - Math.cos(ang) * L, by = tipPt.y - Math.sin(ang) * L;
      return '<path class="vx-arrow" d="M' + r1(tipPt.x) + ',' + r1(tipPt.y) + ' L' + r1(bx - Math.sin(ang) * W) + ',' + r1(by + Math.cos(ang) * W) +
        ' L' + r1(bx + Math.sin(ang) * W) + ',' + r1(by - Math.cos(ang) * W) + ' Z"/>';
    };
    if (l.kind !== "line" && l.arrow !== false) extra += arrowAt(true);
    if (l.both) extra += arrowAt(false);
    if (l.label) {
      var pt = first.getPointAtLength(len * num(l.labelAt, 0.5)), lw = textW(l.label, FS.small, true) + 14;
      var ox = num(l.labelDx, 0), oy = num(l.labelDy, 0);
      extra += '<g class="vx-link-label" transform="translate(' + r1(pt.x + ox) + ',' + r1(pt.y + oy) + ')"><rect x="' + r1(-lw / 2) +
        '" y="-11" width="' + r1(lw) + '" height="22" rx="11"/><text y="4.5" text-anchor="middle">' + esc(l.label) + '</text></g>';
    }
    if (extra) g.insertAdjacentHTML("beforeend", extra);
  };

  /* ---------- moving to a step ---------- */
  P.go = function (i, opts) {
    opts = opts || {};
    i = clamp(i, 0, this.steps.length - 1);
    var prev = this.cur;
    this.stopAnim();
    this.apply(i, prev, opts);
    this.cur = i;
    var animate = !opts.initial && !opts.noAnim && !opts.back && !reduced();
    this.planStep = i;
    this.plan = null;
    if (animate) this.animate(i);
    if (!opts.initial) setHash(i);
    if (this.playing) this.schedule();
    else this.fill(false);
  };
  P.next = function () { if (this.cur < this.steps.length - 1) this.go(this.cur + 1, {}); else if (this.playing) this.pause(); };
  P.prev = function () { if (this.cur > 0) this.go(this.cur - 1, { back: true }); };

  P.apply = function (i, prevI, opts) {
    var self = this, st = this.states[i], step = this.steps[i];
    var stepForward = prevI >= 0 && i === prevI + 1 && !opts.initial;
    var before = stepForward ? this.states[prevI] : null;

    /* 1. lasting content: redraw only what changed */
    this.parts.forEach(function (bp) {
      var p = st[bp.id], key = JSON.stringify(p), el = self.partEls[bp.id];
      if (self.shown[bp.id] !== key) { self.drawPart(bp.id, p); self.shown[bp.id] = key; }
      var hidden = !!p.hidden;
      el.classList.toggle("is-hidden", hidden);
      if (el.hasAttribute("data-concept")) el.setAttribute("tabindex", hidden ? "-1" : "0");
      el.setAttribute("aria-hidden", hidden ? "true" : "false");
      if (before && JSON.stringify(before[bp.id]) !== key && !hidden && !reduced()) {
        el.classList.remove("is-pulse");
        void el.getBoundingClientRect();
        el.classList.add("is-pulse");
        setTimeout(function () { el.classList.remove("is-pulse"); }, 950);
      }
    });
    this.zones.forEach(function (z) { self.zoneEls[z.id].classList.toggle("is-hidden", !!(st[z.id] && st[z.id].hidden)); });
    this.links.forEach(function (l) {
      self.drawLink(l);
      var endHidden = [l.from, l.to].some(function (s) {
        var id = Array.isArray(s) ? null : String(s).split(/[:@]/)[0];
        return id && st[id] && st[id].hidden;
      });
      self.linkEls[l.id].g.classList.toggle("is-hidden", !!(st[l.id] && st[l.id].hidden) || endHidden);
    });

    /* 2. this step's emphasis */
    var focus = arr(step.focus), flow = arr(step.flow);
    this.svg.classList.toggle("vx-has-focus", focus.length > 0);
    this.parts.forEach(function (p) { self.partEls[p.id].classList.toggle("is-on", focus.indexOf(p.id) >= 0); });
    this.links.forEach(function (l) { self.linkEls[l.id].g.classList.toggle("is-flow", flow.indexOf(l.id) >= 0); });
    [].forEach.call(this.svg.querySelectorAll(".is-hl"), function (n) { n.classList.remove("is-hl"); });
    Object.keys(step.hl || {}).forEach(function (id) {
      var el = self.partEls[id];
      if (!el) return;
      arr(step.hl[id]).forEach(function (ix) {
        var n = el.querySelector('[data-i="' + ix + '"]');
        if (n) n.classList.add("is-hl");
      });
    });

    /* 3. narration, counter, timeline */
    this.host.querySelector(".vx-narr-title").textContent = step.title;
    this.host.querySelector(".vx-narr-text").innerHTML = fmt(step.text);
    this.host.querySelector(".vx-count-n").textContent = String(i + 1);
    [].forEach.call(this.host.querySelectorAll(".vx-seg"), function (b, k) {
      b.classList.toggle("is-done", k < i);
      b.classList.toggle("is-current", k === i);
      if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    [].forEach.call(this.host.querySelectorAll(".vx-steps li"), function (li, k) { li.classList.toggle("is-current", k === i); });
    this.host.querySelector('[data-vx="prev"]').disabled = i === 0;
    this.syncPlay(i);

    /* 4. camera (phones), debug overlay */
    this.camera(i, !opts.initial);
    if (this.debug) this.drawDebug();
  };

  /* ---------- packets ---------- */
  P.packetPlan = function (i) {
    var self = this, step = this.steps[i], items = [], groupEnd = PRE;
    arr(step.packets).forEach(function (pk) {
      var rec = self.linkEls[pk.on];
      if (!rec || rec.g.classList.contains("is-hidden")) return;
      var wires = rec.g.querySelectorAll(".vx-wire"), path = wires[pk.row != null ? pk.row : 0];
      if (!path) return;
      var len = path.getTotalLength(), dur = clamp(len / SPEED, 520, 1600);
      var start = pk["with"] && items.length ? items[items.length - 1].start : groupEnd;
      var link = self.links.filter(function (l) { return l.id === pk.on; })[0];
      /* On a short link a labelled pill would only cover the parts at either
         end, so it travels as a plain dot. */
      items.push({ pk: pk, path: path, len: len, start: start, dur: dur, link: pk.on, dot: len < 70,
        tone: pk.tone || (link && link.tone) || "output" });
      groupEnd = Math.max(groupEnd, start + dur);
    });
    var flowOnly = arr(step.flow).filter(function (id) { return !items.some(function (it) { return it.link === id; }); });
    var total = items.length ? groupEnd + 260 : (flowOnly.length ? PRE + 1100 : 0);
    return { items: items, flowOnly: flowOnly, total: Math.max(total, flowOnly.length ? PRE + 1100 : 0) };
  };
  P.makePackets = function (plan) {
    var self = this;
    return plan.items.map(function (it) {
      var g = svgEl("g", { "class": "vx-pk vx-t-" + it.tone });
      var text = it.dot ? "" : it.pk.text, w = text ? textW(text, FS.small, true) + 16 : 0;
      g.innerHTML = text
        ? '<rect x="' + r1(-w / 2) + '" y="-11" width="' + r1(w) + '" height="22" rx="11"/><text y="4.5" text-anchor="middle">' + esc(text) + '</text>'
        : '<circle r="6.5"/>';
      g.style.opacity = "0";
      self.gPackets.appendChild(g);
      return g;
    });
  };
  P.drawPackets = function (plan, els, t) {
    var running = {};
    plan.items.forEach(function (it, k) {
      var el = els[k], p = (t - it.start) / it.dur;
      if (p < 0 || p > 1.3) { el.style.opacity = "0"; return; }
      var q = p > 1 ? 1 : ease(p), pt = it.path.getPointAtLength(it.pk.rev ? it.len * (1 - q) : it.len * q);
      el.setAttribute("transform", "translate(" + r1(pt.x) + "," + r1(pt.y) + ")");
      el.style.opacity = p > 1 ? String(r1(1 - (p - 1) / 0.3)) : "1";
      if (p <= 1) running[it.link] = 1;
    });
    if (t >= PRE && t < PRE + 1100) plan.flowOnly.forEach(function (id) { running[id] = 1; });
    var self = this;
    this.runningIds = this.runningIds || {};
    Object.keys(this.runningIds).concat(Object.keys(running)).forEach(function (id) {
      var rec = self.linkEls[id];
      if (rec) rec.g.classList.toggle("is-running", !!running[id]);
    });
    this.runningIds = running;
  };
  P.animate = function (i) {
    var self = this, plan = this.packetPlan(i);
    this.plan = plan;
    if (!plan.total) return;
    var els = this.makePackets(plan), t0 = performance.now();
    this.pkEls = els;
    function frameFn(now) {
      var t = now - t0;
      self.drawPackets(plan, els, t);
      if (t < plan.total) self.raf = requestAnimationFrame(frameFn);
      else self.stopAnim();
    }
    this.raf = requestAnimationFrame(frameFn);
  };
  P.stopAnim = function () {
    var self = this;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.pkEls.forEach(function (n) { n.remove(); });
    this.pkEls = [];
    Object.keys(this.runningIds || {}).forEach(function (id) { var r = self.linkEls[id]; if (r) r.g.classList.remove("is-running"); });
    this.runningIds = {};
  };
  /* Test hook: show step i frozen at t ms into its animation. */
  P.seek = function (i, t) {
    this.pause();
    this.go(i, { noAnim: true });
    var plan = this.packetPlan(this.cur);
    this.plan = plan;
    this.pkEls = this.makePackets(plan);
    this.drawPackets(plan, this.pkEls, num(t, 0));
  };

  /* ---------- playback ---------- */
  /* A step's packets, then a short hold. Holding for the narration's reading
     time (about 10 s a step) left the diagram still for so long that playback
     looked stuck; to read at your own pace, pause or step with the arrows. */
  P.dwell = function (i) {
    return (this.plan && this.planStep === i ? this.plan.total : 0) + HOLD;
  };
  /* Play moves to the next step at once, since the step on screen has already
     been seen; if its packets are still moving they finish first. Replay
     starts again from step 1. */
  P.play = function () {
    this.playing = true;
    if (this.cur >= this.steps.length - 1) this.go(0, {});
    else if (this.raf) { this.schedule(); this.syncPlay(this.cur); }
    else this.go(this.cur + 1, {});
  };
  P.pause = function () {
    this.playing = false;
    clearTimeout(this.timer);
    this.fill(false);
    this.syncPlay(this.cur);
  };
  P.schedule = function () {
    var self = this;
    clearTimeout(this.timer);
    if (!this.playing) return;
    var ms = this.dwell(this.cur);
    this.fill(true, ms);
    this.timer = setTimeout(function () {
      if (!self.playing) return;
      if (self.cur < self.steps.length - 1) self.go(self.cur + 1, {});
      else self.pause();
    }, ms);
  };
  /* The current timeline segment fills over the step's dwell while playing. */
  P.fill = function (run, ms) {
    var seg = this.host.querySelector(".vx-seg.is-current .vx-seg-fill");
    [].forEach.call(this.host.querySelectorAll(".vx-seg-fill"), function (f) { f.style.transition = "none"; f.style.transform = ""; });
    if (!seg) return;
    if (!run || reduced()) { seg.style.transform = "scaleX(1)"; return; }
    seg.style.transform = "scaleX(0)";
    void seg.getBoundingClientRect();
    seg.style.transition = "transform " + ms + "ms linear";
    seg.style.transform = "scaleX(1)";
  };
  P.syncPlay = function (i) {
    var b = this.playBtn;
    if (!b) return;
    var atEnd = i >= this.steps.length - 1;
    var label = this.playing ? "Pause" : (atEnd ? "Replay" : (i > 0 ? "Resume" : "Play"));
    b.querySelector(".vx-play-l").textContent = label;
    b.setAttribute("data-state", this.playing ? "pause" : (atEnd ? "replay" : "play"));
    b.setAttribute("aria-label", label + (this.playing ? " the walkthrough" : " the walkthrough from step " + (atEnd ? 1 : i + 1)));
  };

  /* ---------- camera: on phones, zoom to the step's parts ---------- */
  P.focusBox = function (i) {
    var self = this, step = this.steps[i], ids = arr(step.focus), box = null;
    if (step.camera) return { x: step.camera[0], y: step.camera[1], w: step.camera[2], h: step.camera[3] };
    ids.forEach(function (id) {
      var g = self.geo[id];
      if (!g) return;
      var x0 = g.x - 6, y0 = g.y - (g.top || 0) - 6, x1 = g.x + g.w + 6, y1 = g.y + g.h + (g.bottom || 0) + 6;
      if (!box) box = { x0: x0, y0: y0, x1: x1, y1: y1 };
      else { box.x0 = Math.min(box.x0, x0); box.y0 = Math.min(box.y0, y0); box.x1 = Math.max(box.x1, x1); box.y1 = Math.max(box.y1, y1); }
    });
    return box ? { x: box.x0, y: box.y0, w: box.x1 - box.x0, h: box.y1 - box.y0 } : null;
  };
  P.camera = function (i, animate) {
    var full = [0, 0, this.view[0], this.view[1]], target = full, phone = isPhone();
    this.zoomBtn.hidden = !phone;
    this.zoomBtn.textContent = this.follow ? "Whole diagram" : "Follow the step";
    var b = phone && this.follow ? this.focusBox(i) : null;
    this.svg.classList.remove("is-whole");   /* measure the zoom frame, not the fitted one */
    if (b) {
      var pad = 26, x = b.x - pad, y = b.y - pad, w = b.w + pad * 2, h = b.h + pad * 2;
      var cw = this.svg.clientWidth || 1, ch = this.svg.clientHeight || 1, aspect = cw / ch;
      w = Math.max(w, 380); h = Math.max(h, 260);
      if (w / h < aspect) { var nw = h * aspect; x -= (nw - w) / 2; w = nw; } else { var nh = w / aspect; y -= (nh - h) / 2; h = nh; }
      if (w < full[2] && h < full[3]) {
        x = clamp(x, 0, full[2] - w); y = clamp(y, 0, full[3] - h);
        target = [x, y, w, h];
      }
    }
    /* Showing the whole diagram, the stage takes the diagram's own shape
       instead of the tall zoom frame (portal.css, phones only). */
    this.svg.classList.toggle("is-whole", target === full);
    this.setView(target, animate && !reduced());
  };
  P.setView = function (vb, animate) {
    var self = this, from = this.vb.slice();
    if (this.camRaf) cancelAnimationFrame(this.camRaf);
    function put(v) { self.vb = v; self.svg.setAttribute("viewBox", v.map(r1).join(" ")); }
    if (!animate) { put(vb); return; }
    var t0 = performance.now();
    function step(now) {
      var p = Math.min(1, (now - t0) / 460), q = ease(p);
      put(from.map(function (f, k) { return f + (vb[k] - f) * q; }));
      if (p < 1) self.camRaf = requestAnimationFrame(step);
    }
    this.camRaf = requestAnimationFrame(step);
  };

  /* ---------- debug overlay (?debug): grid, ids, boxes ---------- */
  P.drawDebug = function () {
    var old = this.svg.querySelector(".vx-debug");
    if (old) old.remove();
    var v = this.view, out = '<g class="vx-debug" aria-hidden="true">', self = this;
    for (var x = 0; x <= v[0]; x += 50) {
      out += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + v[1] + '"' + (x % 100 ? '' : ' class="is-major"') + '/>' +
        (x % 100 ? '' : '<text x="' + (x + 2) + '" y="10">' + x + '</text>');
    }
    for (var y = 0; y <= v[1]; y += 50) {
      out += '<line x1="0" y1="' + y + '" x2="' + v[0] + '" y2="' + y + '"' + (y % 100 ? '' : ' class="is-major"') + '/>' +
        (y % 100 ? '' : '<text x="2" y="' + (y - 2) + '">' + y + '</text>');
    }
    Object.keys(this.geo).forEach(function (id) {
      var g = self.geo[id];
      out += '<rect class="vx-dbg-box" x="' + r1(g.x) + '" y="' + r1(g.y) + '" width="' + r1(g.w) + '" height="' + r1(g.h) + '"/>' +
        '<text class="vx-dbg-id" x="' + r1(g.x + 2) + '" y="' + r1(g.y + g.h + 10) + '">' + esc(id) + '</text>';
    });
    this.svg.insertAdjacentHTML("beforeend", out + '</g>');
  };

  /* ---------- events ---------- */
  function partOf(n) { return n && n.closest ? n.closest(".vx-part[data-concept]") : null; }
  P.eyebrow = function () { return this.meta.title + " · visual explanation"; };
  P.open = function (id, returnTo) {
    if (!this.concepts[id]) return;
    if (this.playing) this.pause();
    openDialog(this.concepts[id], this.eyebrow(), returnTo);
  };
  P.bind = function () {
    var self = this, svg = this.svg, hoverPart = null;
    svg.addEventListener("pointerover", function (e) {
      if (e.pointerType === "touch") return;
      var part = partOf(e.target);
      if (!part || part === hoverPart) return;
      hoverPart = part;
      tipShow(part, self.concepts[part.getAttribute("data-concept")]);
    });
    svg.addEventListener("pointerout", function (e) {
      var part = partOf(e.target);
      if (!part || partOf(e.relatedTarget) === part) return;
      hoverPart = null;
      tipHide();
    });
    svg.addEventListener("click", function (e) {
      var part = partOf(e.target);
      if (part) self.open(part.getAttribute("data-concept"), part);
    });
    svg.addEventListener("keydown", function (e) {
      var part = partOf(e.target);
      if (!part || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      self.open(part.getAttribute("data-concept"), part);
    });
    svg.addEventListener("focusin", function (e) {
      var part = partOf(e.target), vis = false;
      try { vis = part && part.matches(":focus-visible"); } catch (err) { vis = !!part; }
      if (vis) tipShow(part, self.concepts[part.getAttribute("data-concept")]);
    });
    svg.addEventListener("focusout", function () { tipHide(); });

    this.host.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button") : null;
      if (!b || !self.host.contains(b)) return;
      var act = b.getAttribute("data-vx");
      if (act === "play") { if (self.playing) self.pause(); else self.play(); }
      else if (act === "prev") self.prev();
      else if (act === "next") self.next();
      else if (b.classList.contains("vx-seg")) self.go(+b.getAttribute("data-step"), {});
      else if (b.classList.contains("vx-steps-go")) {
        self.go(+b.getAttribute("data-step"), {});
        var sec = self.host.querySelector(".vx");
        if (sec) sec.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
      } else if (b.classList.contains("vx-pcard")) self.open(b.getAttribute("data-concept"), b);
      else if (b.classList.contains("vx-zoom")) { self.follow = !self.follow; self.camera(self.cur, true); }
    });
    /* Hovering a card under the diagram shows where that part is. */
    this.host.addEventListener("pointerover", function (e) {
      var c = e.target.closest ? e.target.closest(".vx-pcard") : null;
      [].forEach.call(svg.querySelectorAll(".is-peek"), function (n) { n.classList.remove("is-peek"); });
      if (!c) return;
      [].forEach.call(svg.querySelectorAll('.vx-part[data-concept="' + c.getAttribute("data-concept") + '"]'), function (n) { n.classList.add("is-peek"); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") tipHide();
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var t = e.target, tag = t && t.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
      if ((dlg && dlg.open) || document.documentElement.classList.contains("cd-lock") ||
          document.body.classList.contains("cx-modal-open")) return;
      if (t && t.closest && t.closest('[role="tablist"], [role="listbox"], [role="menu"]')) return;
      e.preventDefault();
      if (e.key === "ArrowRight") self.next(); else self.prev();
    });
    window.addEventListener("scroll", function () { tipHide(); }, { passive: true, capture: true });
    document.addEventListener("visibilitychange", function () { if (document.hidden && self.playing) self.pause(); });
    window.addEventListener("hashchange", function () {
      var s = stepFromHash(self.steps.length);
      if (s != null && s !== self.cur) self.go(s, {});
    });
    var resizeRaf = 0;
    window.addEventListener("resize", function () {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () { self.camera(self.cur, false); });
    });
    if (mqPhone && mqPhone.addEventListener) mqPhone.addEventListener("change", function () { self.camera(self.cur, false); });
  };

  /* #step-N (1-based) in the address bar; no element on the page has that id,
     so the browser never jumps to it. Not written while the question popup is
     open - it keeps its own history entry. */
  function stepFromHash(n) {
    var m = /^#step-(\d+)$/.exec(location.hash || "");
    if (!m) return null;
    var s = parseInt(m[1], 10) - 1;
    return s >= 0 && s < n ? s : null;
  }
  function setHash(i) {
    if (document.documentElement.classList.contains("cd-lock")) return;
    try { history.replaceState(history.state, "", "#step-" + (i + 1)); } catch (err) {}
  }

  /* ---------- boot ---------- */
  function start() {
    if (document.body.getAttribute("data-page") !== "visual") return;
    var host = document.querySelector("[data-visual-body]");
    if (!host) return;
    var slug = document.body.getAttribute("data-visual");
    var meta = (IR.visuals || []).filter(function (v) { return v.slug === slug; })[0];
    var scene = IR.v && IR.v[slug];
    if (!meta || !scene) {
      host.innerHTML = '<div class="note">This visual could not be loaded. Check that <code>data/v-' + esc(slug) + '.js</code> exists ' +
        'and is listed in <code>data/visuals.js</code>.</div>';
      return;
    }
    document.title = meta.title + " - visual explanation | Interview Room";
    var player = new Player(host, meta, scene);
    player.mount();
    IR.visual = {
      player: player,
      go: function (i) { player.go(i, {}); },
      seek: function (i, t) { player.seek(i, t); },
      open: function (id) { player.open(id); }
    };
    document.dispatchEvent(new CustomEvent("vx:ready"));
  }
  if (IR.onReady) IR.onReady(start);
  else document.addEventListener("ir:ready", start);
})();
