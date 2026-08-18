/* Interview Room — content validator.
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

var REQUIRED = ["id", "q", "round", "level", "tags",
                "why", "simple", "say", "numbers", "wrong", "follow"];
var SAY_MIN = 50;   // below this the answer is too thin to carry a point
var SAY_MAX = 85;   // above this you cannot deliver it without reading

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

    if (ids[c.id]) problems.push(where + ": duplicate id, also in " + ids[c.id]);
    ids[c.id] = key;

    if (c.say) {
      var words = c.say.trim().split(/\s+/).length;
      if (words < SAY_MIN || words > SAY_MAX) {
        problems.push(where + ": say is " + words + " words (want " + SAY_MIN + "–" + SAY_MAX + ")");
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
  });

  (set.evening || []).forEach(function (id) {
    if (!set.cards.some(function (c) { return c.id === id; })) {
      problems.push(key + ": evening shortlist points at missing card \"" + id + "\"");
    }
  });

  console.log("  " + key + " — " + set.cards.length + " cards");
});

console.log("\n" + total + " cards across " +
            IR.topics.filter(function (t) { return t.status === "live"; }).length +
            " live topics");

/* Tracks own no questions — they point at cards by id. A track that names a card
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

/* This portal must render standalone — copy the folder anywhere, open
   index.html, everything works. Two ways that silently breaks: a path that
   climbs out to a sibling directory, or a CDN URL. Both look fine on this
   machine and fail on a USB stick, so fail the build instead of finding out
   later. Root-level files use `assets/…`; pages in topics/ use `../assets/…`,
   which is still inside the portal — only `../../` or `../` from a root-level
   file escapes. */
var OFFENDERS = [
  [/\.\.\/\.\.\//, "path climbs above the portal root (../../)"],
  [/https?:\/\/(?!(?:www\.)?w3\.org|schema\.org)/, "external URL — vendor the asset instead"]
];
function scan(dir) {
  fs.readdirSync(dir).forEach(function (name) {
    var p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name !== "node_modules") scan(p);
      return;
    }
    if (!/\.(html|css|js)$/.test(name)) return;
    if (p === path.join(root, "tools", "check.js")) return;   // this file names the patterns
    var text = fs.readFileSync(p, "utf8");
    var rel = path.relative(root, p).replace(/\\/g, "/");
    var atRoot = !rel.includes("/");
    OFFENDERS.forEach(function (o) {
      if (o[0].test(text)) problems.push(rel + ": " + o[1]);
    });
    /* A root-level file has nothing above it that belongs to this portal. */
    if (atRoot && /(?:src|href)="\.\.\//.test(text)) {
      problems.push(rel + ": root-level file reaches outside the portal (../)");
    }
  });
}
scan(root);

if (problems.length) {
  console.log("\n" + problems.length + " problem(s):");
  problems.forEach(function (p) { console.log("  " + p); });
  process.exit(1);
}
console.log("all checks passed");
