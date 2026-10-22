/* Interview Room - content validator.
   Run from the portal root:  node tools/check.js
   Exits non-zero on any failure, so it can gate a commit.

   It checks the things that actually go wrong when adding questions: an empty
   slot, a `say` that has quietly grown too long to deliver in one breath, a
   duplicate id, a round or level outside the vocabulary, a live topic with no
   page, and a shortlist pointing at a card that does not exist. */

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data/topics.js"));
var IR = global.window.IR;
require(path.join(root, "data/tags.js"));
require(path.join(root, "data/sources.js"));
var TAGS = IR.tags || {};
var SOURCES = IR.sources || {};
var warnings = [];
var allCards = [];
var NOW = new Date();

var REQUIRED = ["id", "q", "round", "level", "tags",
                "why", "simple", "say", "numbers", "wrong", "follow"];
var SAY_MIN = 50;   // below this the answer is too thin to carry a point
var SAY_MAX = 170;  // about a minute of speech; above this you cannot deliver it without reading

var problems = [];
var ids = {};
var total = 0;

IR.topics.forEach(function (t) {
  var key = t.num + "-" + t.slug;
  var dataFile = path.join(root, "data/q-" + key + ".js");
  var pageFile = path.join(root, "topics/" + key + ".html");

  if (t.status !== "live") {
    if (fs.existsSync(dataFile)) {
      problems.push(key + ": data file exists but status is \"planned\"");
    }
    return;
  }

  if (!fs.existsSync(dataFile)) { problems.push(key + ": no data file"); return; }
  if (!fs.existsSync(pageFile)) { problems.push(key + ": no page in topics/"); }
  require(dataFile);

  var set = IR.q[key];
  if (!set) { problems.push(key + ": data file did not register on window.IR.q"); return; }
  if (!set.lede) problems.push(key + ": missing lede");
  if (!set.grounding) problems.push(key + ": missing grounding label");

  total += set.cards.length;

  set.cards.forEach(function (c) {
    var where = key + " / " + (c.id || "<no id>");

    REQUIRED.forEach(function (f) {
      var v = c[f];
      if (!v || (Array.isArray(v) && !v.length)) problems.push(where + ": missing " + f);
    });

    allCards.push({ c: c, where: where });
    (c.tags || []).forEach(function (t) {
      if (!TAGS[t]) problems.push(where + ": tag \"" + t + "\" is not in data/tags.js");
    });
    (c.deeper || []).forEach(function (sid) {
      if (!SOURCES[sid]) problems.push(where + ": deeper source \"" + sid + "\" is not in data/sources.js");
    });
    if (c.check) {
      var k = c.check;
      if (!k.q || !Array.isArray(k.options) || k.options.length < 3 || k.options.length > 4) problems.push(where + ": check needs q and 3-4 options");
      else if (typeof k.answer !== "number" || k.answer < 0 || k.answer >= k.options.length) problems.push(where + ": check.answer is not a valid option index");
      if (!k.why) problems.push(where + ": check is missing why");
    }
    if (c["try"] && (!c["try"].title || !Array.isArray(c["try"].steps) || !c["try"].steps.length)) problems.push(where + ": try needs a title and steps");
    if (c.verified !== undefined && !/^20\d\d-(0[1-9]|1[0-2])$/.test(c.verified)) problems.push(where + ": verified must look like 2026-10");
    /* Prices and model names go stale. Warn (not fail) when a card states one
       and has not been re-checked in six months. */
    if (/\$\s?\d|\u20b9\s?\d|per million|GPT-\d|Claude \d|Gemini \d|Llama \d/i.test((c.numbers || "") + " " + (c.say || ""))) {
      var vm = /^(\d{4})-(\d{2})$/.exec(c.verified || "");
      var age = vm ? (NOW.getFullYear() - +vm[1]) * 12 + (NOW.getMonth() + 1 - +vm[2]) : 99;
      if (age > 6) warnings.push(where + ": states a price or model name and " + (vm ? "was last checked " + c.verified : "has never been checked"));
    }
    if (ids[c.id]) problems.push(where + ": duplicate id, also in " + ids[c.id]);
    ids[c.id] = key;

    if (c.say) {
      var words = c.say.trim().split(/\s+/).length;
      if (words < SAY_MIN || words > SAY_MAX) {
        problems.push(where + ": say is " + words + " words (want " + SAY_MIN + "–" + SAY_MAX + ")");
      }
    }

    /* Diagram: optional; when present it must be a spec the renderer can draw. */
    if (c.diagram !== undefined) {
      var d = c.diagram, need = { lanes: "lanes", compare: "columns", matrix: "cells", stack: "layers" };
      if (d.kind && !need[d.kind]) problems.push(where + ": diagram kind \"" + d.kind + "\" is unknown");
      else if (!Array.isArray(d[need[d.kind] || "rows"]) || !d[need[d.kind] || "rows"].length) problems.push(where + ": diagram has no " + (need[d.kind] || "rows"));
      if (!d.alt && !d.caption) problems.push(where + ": diagram needs alt or caption text");
    }

    /* Quick recall: optional, but when present it must stay a glanceable list. */
    if (c.quick !== undefined) {
      if (!Array.isArray(c.quick) || c.quick.length < 3 || c.quick.length > 5) {
        problems.push(where + ": quick must be 3–5 bullets");
      } else {
        c.quick.forEach(function (b, i) {
          var w = String(b).trim().split(/\s+/).length;
          if (w > 15) problems.push(where + ": quick bullet " + (i + 1) + " is " + w + " words (max 15)");
        });
      }
    }

    (c.round || []).forEach(function (r) {
      if (!IR.rounds.some(function (x) { return x.key === r; })) {
        problems.push(where + ": unknown round \"" + r + "\"");
      }
    });

    if (c.level && !IR.levels.some(function (x) { return x.key === c.level; })) {
      problems.push(where + ": unknown level \"" + c.level + "\"");
    }

    /* Priority is optional, but a typo would silently drop the pill. */
    if (c.priority !== undefined && ["high", "medium", "low"].indexOf(c.priority) < 0) {
      problems.push(where + ": unknown priority \"" + c.priority + "\" (want high, medium or low)");
    }

    /* A diagram is optional, but a broken one renders as a picture with a
       missing box or an arrow pointing at nothing - which is worse than no
       diagram, because the reader would take it to the whiteboard. So the
       spec is validated as strictly as any other slot. */
    if (c.diagram) {
      var g = c.diagram;
      var gw = where + " diagram";
      if (!g.alt) problems.push(gw + ": missing alt (it is the only text a screen reader gets)");
      if (!g.caption) problems.push(gw + ": missing caption");

      if (g.kind === "lanes") {
        if (!g.lanes || !g.lanes.length) problems.push(gw + ": lanes diagram has no lanes");
        else if (g.lanes.length > 8) problems.push(gw + ": " + g.lanes.length + " lanes - too many to stay legible (max 8)");
        (g.lanes || []).forEach(function (l, i) {
          if (!l.label) problems.push(gw + ": lane " + i + " has no label");
        });
      } else if (!g.kind) {
        /* Flow diagrams only - compare/matrix/stack are checked further down. */
        if (!g.rows || !g.rows.length) { problems.push(gw + ": no rows"); return; }
        var seen = {};
        g.rows.forEach(function (row, r) {
          if (row.length > 3) problems.push(gw + ": row " + r + " has " + row.length + " nodes - boxes get too narrow (max 3)");
          row.forEach(function (n) {
            if (!n.id) problems.push(gw + ": a node in row " + r + " has no id");
            else if (seen[n.id]) problems.push(gw + ": duplicate node id \"" + n.id + "\"");
            else seen[n.id] = true;
            if (!n.label) problems.push(gw + ": node \"" + n.id + "\" has no label");
          });
        });
        /* A node label has to fit its box at BOTH rendered widths, and the
           narrow one collapses every row to a single column. Rather than
           re-implement the layout here, cap the longest single word: wrapping
           handles the rest, but one unbreakable word wider than its box is the
           only case wrapping cannot save. */
        g.rows.forEach(function (row) {
          row.forEach(function (n) {
            var longest = String(n.label || "").split(/\s+/).reduce(function (m, w) {
              return Math.max(m, w.length);
            }, 0);
            if (longest > 22) problems.push(gw + ": node \"" + n.id + "\" has an unbreakable " + longest + "-character word");
          });
        });
        /* An edge naming a node that does not exist draws nothing, silently. */
        (g.edges || []).forEach(function (e) {
          if (!seen[e.from]) problems.push(gw + ": edge from unknown node \"" + e.from + "\"");
          if (!seen[e.to]) problems.push(gw + ": edge to unknown node \"" + e.to + "\"");
        });
        /* A box with no path into it reads as though it belongs to a different
           drawing. Walk forward from the first row and flag anything missed. */
        var reach = {};
        g.rows[0].forEach(function (n) { reach[n.id] = true; });
        var changed = true;
        while (changed) {
          changed = false;
          (g.edges || []).forEach(function (e) {
            if (reach[e.from] && !reach[e.to]) { reach[e.to] = true; changed = true; }
          });
        }
        Object.keys(seen).forEach(function (id) {
          if (!reach[id]) problems.push(gw + ": node \"" + id + "\" is unreachable - nothing points at it");
        });
      }
    }

  });

  (set.evening || []).forEach(function (id) {
    if (!set.cards.some(function (c) { return c.id === id; })) {
      problems.push(key + ": evening shortlist points at missing card \"" + id + "\"");
    }
  });

  console.log("  " + key + " - " + set.cards.length + " cards");
});

/* Cross-links must point at cards that exist - a dead link reads as a bug. */
allCards.forEach(function (x) {
  var c = x.c;
  ["builds", "next", "alsoIn"].forEach(function (f) {
    (c[f] || []).forEach(function (id) {
      if (id === c.id) problems.push(x.where + ": " + f + " points at itself");
      else if (!ids[id]) problems.push(x.where + ": " + f + " points at missing card \"" + id + "\"");
    });
  });
  if (c.dupOf && !ids[c.dupOf]) problems.push(x.where + ": dupOf points at missing card \"" + c.dupOf + "\"");
});

/* Orphans: a data file or page that no topic lists is invisible but still shipped. */
var liveKeys = {};
IR.topics.forEach(function (t) { liveKeys[t.num + "-" + t.slug] = 1; });
fs.readdirSync(path.join(root, "data")).forEach(function (n) {
  var m = /^q-(.+)\.js$/.exec(n);
  if (m && !liveKeys[m[1]]) problems.push("data/" + n + ": orphan - not listed in data/topics.js (move it to _archive/)");
});
fs.readdirSync(path.join(root, "topics")).forEach(function (n) {
  var m = /^(.+)\.html$/.exec(n);
  if (m && !liveKeys[m[1]]) problems.push("topics/" + n + ": orphan - not listed in data/topics.js");
});

console.log("\n" + total + " cards across " +
            IR.topics.filter(function (t) { return t.status === "live"; }).length +
            " live topics");

/* Tracks own no questions - they point at cards by id. A track that names a card
   that no longer exists would render a visible gap, so fail the build instead. */
var tracksFile = path.join(root, "data/tracks.js");
if (fs.existsSync(tracksFile)) {
  require(tracksFile);
  var TRACK_REQUIRED = ["key", "label", "includes", "grounding", "skew", "rounds", "watch", "ten"];
  (IR.tracks || []).forEach(function (t) {
    var where = "track " + (t.key || "<no key>");
    TRACK_REQUIRED.forEach(function (f) {
      var v = t[f];
      if (!v || (Array.isArray(v) && !v.length)) problems.push(where + ": missing " + f);
    });
    (t.ten || []).forEach(function (id) {
      if (!ids[id]) problems.push(where + ": names card \"" + id + "\", which does not exist");
    });
    if (t.ten && t.ten.length !== 10) {
      problems.push(where + ": \"ten most likely\" has " + t.ten.length + " entries");
    }
    if (t.ten && new Set(t.ten).size !== t.ten.length) {
      problems.push(where + ": duplicate id in its ten");
    }
    if (t.scenario) {
      if (!t.scenario.title || !t.scenario.prompt) problems.push(where + ": scenario missing title or prompt");
      if (!t.scenario.moves || !t.scenario.moves.length) problems.push(where + ": scenario has no moves");
    }
  });
  console.log((IR.tracks || []).length + " employer tracks");
}

/* Visual explanations: data/visuals.js lists them; each has a page in visuals/
   and a scene in data/v-<slug>.js. A scene is checked as data - every id
   resolves, every part you can click has its explanation, every such part is
   lit in at least one step, and the writing stays within the lengths the page
   is laid out for (a tip is read in a hover, a step while it plays). */
var VX_KINDS = {
  box: ["shape", "rx", "lines"], stack: ["count", "badge"], db: [], doc: ["count"],
  note: ["align", "lines"], tokens: ["items", "dir", "gap"],
  vector: ["values", "n", "seed", "cell", "dir"],
  matrix: ["rows", "cols", "values", "mask", "cell", "colLabels"],
  bars: ["items", "rowH", "lw", "max", "fmt"],
  col: ["cell", "items", "values", "n", "seed", "rows", "align", "cellSize"],
  code: ["lines", "title"], msg: ["role", "text", "lines", "side"], scatter: ["points", "rings"], art: ["svg"]
};
var VX_COMMON = ["id", "kind", "x", "y", "w", "h", "label", "sub", "tone", "icon", "concept", "hidden", "keep"];
var VX_LINK = ["id", "from", "to", "kind", "style", "via", "path", "label", "labelAt", "labelDx", "labelDy",
               "dashed", "tone", "hidden", "arrow", "both", "rows"];
var VX_ZONE = ["id", "x", "y", "w", "h", "label", "sub", "tone", "hidden"];
var VX_STEP = ["title", "text", "focus", "flow", "packets", "set", "hl", "camera"];
var VX_PACKET = ["on", "text", "tone", "with", "rev", "row"];
var VX_CONCEPT = ["title", "tip", "detail", "oneLiner"];
var VX_SCENE = ["view", "rows", "caption", "zones", "parts", "links", "concepts", "steps"];
var VX_TONES = ["input", "model", "data", "tool", "guard", "output", "neutral", "q", "k", "v"];
var VX_LIMITS = { tip: 30, para: 95, oneLiner: 40, step: 45 };
function vxWords(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).length; }
function vxUnknown(obj, allowed, where) {
  Object.keys(obj || {}).forEach(function (k) {
    if (allowed.indexOf(k) < 0) problems.push(where + ": unknown key \"" + k + "\"");
  });
}
var visualsFile = path.join(root, "data/visuals.js");
if (fs.existsSync(visualsFile)) {
  require(visualsFile);
  var liveTopic = {};
  IR.topics.forEach(function (t) { if (t.status === "live") liveTopic[t.num + "-" + t.slug] = 1; });
  var vxSlugs = {};
  (IR.visuals || []).forEach(function (v) {
    var where = "visual " + (v.slug || "<no slug>");
    ["slug", "title", "headline", "blurb"].forEach(function (f) { if (!v[f]) problems.push(where + ": missing " + f); });
    if (!/^[a-z0-9-]+$/.test(v.slug || "")) problems.push(where + ": slug must be lower-case letters, digits and dashes");
    if (vxSlugs[v.slug]) problems.push(where + ": duplicate slug");
    vxSlugs[v.slug] = 1;
    if (!(v.topics || []).length) problems.push(where + ": no topics");
    (v.topics || []).forEach(function (k) { if (!liveTopic[k]) problems.push(where + ": topic \"" + k + "\" is not a live topic"); });
    (v.practise || []).forEach(function (id) { if (!ids[id]) problems.push(where + ": practise names card \"" + id + "\", which does not exist"); });
    if ((v.practise || []).length < 3) warnings.push(where + ": fewer than 3 practise questions");
    if (!fs.existsSync(path.join(root, "visuals", v.slug + ".html"))) problems.push(where + ": no page - run: node tools/build-pages.js");
    var sceneFile = path.join(root, "data/v-" + v.slug + ".js");
    if (!fs.existsSync(sceneFile)) { problems.push(where + ": no scene file data/v-" + v.slug + ".js"); return; }
    require(sceneFile);
    var S = (IR.v || {})[v.slug];
    if (!S) { problems.push(where + ": scene file did not register on window.IR.v[\"" + v.slug + "\"]"); return; }
    vxUnknown(S, VX_SCENE, where);
    var concepts = S.concepts || {}, parts = S.parts || [], links = S.links || [], zones = S.zones || [], steps = S.steps || [];
    var partById = {}, linkById = {}, zoneById = {}, seen = {}, usedConcept = {}, lit = {};
    function claim(id, what) {
      if (!id) { problems.push(where + ": a " + what + " has no id"); return; }
      if (seen[id]) problems.push(where + ": id \"" + id + "\" is used twice");
      seen[id] = 1;
    }
    zones.forEach(function (z) { claim(z.id, "zone"); zoneById[z.id] = z; vxUnknown(z, VX_ZONE, where + " zone " + z.id); });
    parts.forEach(function (p) {
      claim(p.id, "part");
      partById[p.id] = p;
      var pw = where + " part " + p.id;
      if (!VX_KINDS[p.kind]) { problems.push(pw + ": unknown kind \"" + p.kind + "\""); return; }
      vxUnknown(p, VX_COMMON.concat(VX_KINDS[p.kind]), pw);
      if (p.tone && VX_TONES.indexOf(p.tone) < 0) problems.push(pw + ": unknown tone \"" + p.tone + "\"");
      if (p.concept) {
        if (!concepts[p.concept]) problems.push(pw + ": concept \"" + p.concept + "\" is not defined");
        usedConcept[p.concept] = 1;
      }
      /* Same estimate as assets/visual.js: an average advance per character. */
      if ((p.kind === "box" || p.kind === "stack" || p.kind === "db") && p.label && p.w) {
        var need = String(p.label).length * 16.5 * 0.58 + (p.icon ? 27 : 0) + 14;
        if (need > p.w) warnings.push(pw + ": label \"" + p.label + "\" may not fit its " + p.w + "-wide box");
      }
    });
    links.forEach(function (l) {
      claim(l.id, "link");
      linkById[l.id] = l;
      var lw = where + " link " + l.id;
      vxUnknown(l, VX_LINK, lw);
      if (l.tone && VX_TONES.indexOf(l.tone) < 0) problems.push(lw + ": unknown tone \"" + l.tone + "\"");
      if (!l.path) [l.from, l.to].forEach(function (end) {
        if (Array.isArray(end)) return;
        var id = String(end || "").split(/[:@]/)[0];
        if (!partById[id] && !zoneById[id]) problems.push(lw + ": end \"" + end + "\" names no part or zone");
      });
    });
    Object.keys(concepts).forEach(function (k) {
      var c = concepts[k], cw = where + " concept " + k;
      vxUnknown(c, VX_CONCEPT, cw);
      if (!c.title) problems.push(cw + ": missing title");
      if (!c.tip) problems.push(cw + ": missing tip");
      else if (vxWords(c.tip) > VX_LIMITS.tip) problems.push(cw + ": tip is " + vxWords(c.tip) + " words (max " + VX_LIMITS.tip + ")");
      var d = c.detail || [];
      if (d.length < 3 || d.length > 4) problems.push(cw + ": detail has " + d.length + " paragraphs (want 3-4)");
      d.forEach(function (para, i) {
        if (vxWords(para) > VX_LIMITS.para) problems.push(cw + ": paragraph " + (i + 1) + " is " + vxWords(para) + " words (max " + VX_LIMITS.para + ")");
      });
      if (!c.oneLiner) problems.push(cw + ": missing oneLiner");
      else if (vxWords(c.oneLiner) > VX_LIMITS.oneLiner) problems.push(cw + ": oneLiner is " + vxWords(c.oneLiner) + " words (max " + VX_LIMITS.oneLiner + ")");
      if (!usedConcept[k]) problems.push(cw + ": no part uses it");
    });
    if (!steps.length) problems.push(where + ": no steps");
    steps.forEach(function (s, i) {
      var sw = where + " step " + (i + 1);
      vxUnknown(s, VX_STEP, sw);
      if (!s.title) problems.push(sw + ": missing title");
      if (!s.text) problems.push(sw + ": missing text");
      else if (vxWords(s.text) > VX_LIMITS.step) problems.push(sw + ": narration is " + vxWords(s.text) + " words (max " + VX_LIMITS.step + ")");
      (s.focus || []).forEach(function (id) { if (!partById[id]) problems.push(sw + ": focus names \"" + id + "\", not a part"); else lit[id] = 1; });
      (s.flow || []).forEach(function (id) { if (!linkById[id]) problems.push(sw + ": flow names \"" + id + "\", not a link"); });
      (s.packets || []).forEach(function (pk) {
        vxUnknown(pk, VX_PACKET, sw + " packet");
        if (!linkById[pk.on]) problems.push(sw + ": packet rides \"" + pk.on + "\", not a link");
        else if (pk.row != null && linkById[pk.on].kind !== "ribbon") problems.push(sw + ": packet row is only for ribbon links");
      });
      Object.keys(s.hl || {}).forEach(function (id) { if (!partById[id]) problems.push(sw + ": hl names \"" + id + "\", not a part"); });
      Object.keys(s.set || {}).forEach(function (id) {
        var target = partById[id] || linkById[id] || zoneById[id];
        if (!target) { problems.push(sw + ": set names \"" + id + "\", which does not exist"); return; }
        var allowed = partById[id] ? VX_COMMON.concat(VX_KINDS[partById[id].kind] || []) : (linkById[id] ? VX_LINK : VX_ZONE);
        vxUnknown(s.set[id], allowed, sw + " set " + id);
      });
    });
    parts.forEach(function (p) {
      if (p.concept && !lit[p.id]) problems.push(where + " part " + p.id + ": never lit - focus it in at least one step");
    });
  });
  [["visuals", /^(.+)\.html$/], ["data", /^v-(.+)\.js$/]].forEach(function (o) {
    var dir = path.join(root, o[0]);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(function (n) {
      var m = o[1].exec(n);
      if (m && !vxSlugs[m[1]]) problems.push(o[0] + "/" + n + ": orphan - not listed in data/visuals.js");
    });
  });
  if (!fs.existsSync(path.join(root, "visuals.html"))) problems.push("visuals.html is missing");
  console.log((IR.visuals || []).length + " visual explanations");
}

/* This portal must render standalone - copy the folder anywhere, open
   index.html, everything works. Two ways that silently breaks: a path that
   climbs out to a sibling directory, or a CDN URL. Both look fine on this
   machine and fail on a USB stick, so fail the build instead of finding out
   later. Root-level files use `assets/…`; pages in topics/ use `../assets/…`,
   which is still inside the portal - only `../../` or `../` from a root-level
   file escapes. */
var OFFENDERS = [
  [/\.\.\/\.\.\//, "path climbs above the portal root (../../)"],
  /* localhost, .example and {templated} URLs are code samples, not assets. */
  [/https?:\/\/(?!(?:www\.)?w3\.org|schema\.org|localhost|127\.0\.0\.1|169\.254\.169\.254|[^\s"']*\.example\b|[^\s"']*\{)/, "external URL - vendor the asset instead"]
];
function scan(dir) {
  fs.readdirSync(dir).forEach(function (name) {
    var p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== "node_modules" && name !== "_archive") scan(p);
      return;
    }
    if (!/\.(html|css|js)$/.test(name)) return;
    if (p === path.join(root, "tools", "check.js")) return;   // this file names the patterns
    /* The reading list is the one place links out are allowed: they are
       followed by the reader, never loaded by the page. */
    var isSources = p === path.join(root, "data", "sources.js");
    var text = fs.readFileSync(p, "utf8");
    var rel = path.relative(root, p).replace(/\\/g, "/");
    var atRoot = !rel.includes("/");
    OFFENDERS.forEach(function (o, oi) {
      if (isSources && oi === 1) return;
      if (o[0].test(text)) problems.push(rel + ": " + o[1]);
    });
    /* A root-level file has nothing above it that belongs to this portal. */
    if (atRoot && /(?:src|href)="\.\.\//.test(text)) {
      problems.push(rel + ": root-level file reaches outside the portal (../)");
    }
  });
}
scan(root);

/* The search index is generated from the card data, so it can silently fall
   behind an edit and leave the sidebar searching a corpus that no longer
   matches the pages. Compare card ids rather than timestamps - a rebuild that
   changed nothing is not a failure, and a file mtime says nothing about
   content. */
(function checkSearchIndex() {
  var idxFile = path.join(root, "data/search-index.js");
  if (!fs.existsSync(idxFile)) {
    problems.push("data/search-index.js is missing - run: node tools/build-search-index.js");
    return;
  }
  delete global.window.IR.searchIndex;
  require(idxFile);
  var idx = global.window.IR.searchIndex;
  if (!idx || !idx.cards) {
    problems.push("data/search-index.js is unreadable - run: node tools/build-search-index.js");
    return;
  }
  var live = {}, nLive = 0;
  IR.topics.forEach(function (t) {
    var key = t.num + "-" + t.slug;
    var set = IR.q[key];
    if (!set || !set.cards) return;
    set.cards.forEach(function (c) { live[c.id] = 1; nLive++; });
  });
  var indexed = {};
  idx.cards.forEach(function (c) { indexed[c.i] = 1; });
  var missing = Object.keys(live).filter(function (id) { return !indexed[id]; });
  var stale = Object.keys(indexed).filter(function (id) { return !live[id]; });
  if (missing.length || stale.length) {
    problems.push("data/search-index.js is out of date ("
      + missing.length + " card(s) missing, " + stale.length
      + " removed) - run: node tools/build-search-index.js");
  }
})();

(function checkCatalog() {
  var cf = path.join(root, "data/catalog.js");
  if (!fs.existsSync(cf)) { problems.push("data/catalog.js is missing - run: node tools/build-search-index.js"); return; }
  require(cf);
  var rows = (global.window.IR.catalog || {}).cards || [];
  var have = {};
  rows.forEach(function (r) { have[r[0]] = r; });
  var stale = allCards.filter(function (x) {
    var r = have[x.c.id];
    return !r || r[2] !== x.c.q || (r[6] || null) !== (x.c.dupOf || null);
  });
  if (stale.length || rows.length !== allCards.length) problems.push("data/catalog.js is out of date - run: node tools/build-search-index.js");
})();

if (warnings.length) {
  console.log("\n" + warnings.length + " warning(s) - time-sensitive facts to re-check:");
  warnings.slice(0, 15).forEach(function (w) { console.log("  " + w); });
  if (warnings.length > 15) console.log("  ... and " + (warnings.length - 15) + " more");
}

if (problems.length) {
  console.log("\n" + problems.length + " problem(s):");
  problems.forEach(function (p) { console.log("  " + p); });
  process.exit(1);
}
console.log("all checks passed");
