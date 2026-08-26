/* Interview Room — search index builder.
   Run from the portal root:  node tools/build-search-index.js

   Writes data/search-index.js, which the sidebar search reads.

   Why an index rather than searching the card data directly: the hub pages
   already load all eighteen q-*.js files (~850KB), but a topic page loads only
   its own. A search box in the sidebar is on every page, so on a topic page it
   would have nothing but that one topic to search. Adding the other seventeen
   files to every page would mean shipping the whole corpus to read one topic.

   So this reduces each card to just what search needs — title, tags, topic,
   and a deduplicated bag of words from the prose — and drops the long-form
   answer text that makes the source files big. The result is a fraction of the
   size and is the only data file the search needs, on any page.

   Re-run this after editing any q-*.js. tools/check.js verifies it is current. */

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data/topics.js"));
var IR = global.window.IR;

/* Words carrying no discriminating power. Kept deliberately short: this is a
   technical corpus, and over-trimming here is how "how" disappears from "how
   does attention work". Only genuine glue is listed. */
var STOP = ("a an and are as at be but by for from has have how i in is it its of on or "
  + "that the this to was what when where which who why will with you your do does did "
  + "not no so if then than there their they we us our can could would should may might")
  .split(" ");
var STOPSET = {};
STOP.forEach(function (w) { STOPSET[w] = 1; });

/* Mirrors normalise() in assets/portal.js — the index and the query must be
   tokenised identically or a word that is split one way at build time and
   another way at search time can never match. Change one, change both. */
function tokens(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")   /* keep c++, c#, .net, fine-tuning */
    .split(/[\s\-_.]+/)
    .filter(function (w) {
      if (w.length < 2) return false;
      return !STOPSET[w];
    });
}

/* A card's searchable prose. The full `simple` text is included here at build
   time — that breadth is the point, it is what lets an off-vocabulary phrase
   find a card — but it is reduced to a unique word set, so a 400-word answer
   costs only its distinct terms. */
function bag(c) {
  var text = [c.q, (c.tags || []).join(" "), c.why, c.simple, c.say,
              c.numbers, c.wrong, c.follow,
              (c.points || []).join(" ")].join(" ");
  var seen = {}, out = [];
  tokens(text).forEach(function (w) {
    if (!seen[w]) { seen[w] = 1; out.push(w); }
  });
  return out;
}

var entries = [];
var topicMeta = [];

IR.topics.forEach(function (t) {
  var key = t.num + "-" + t.slug;
  var file = path.join(root, "data/q-" + key + ".js");
  /* A planned topic still belongs in the index — searching for it should find
     the topic even though it has no cards yet. */
  topicMeta.push({
    k: key, n: t.num, t: t.title, s: t.status,
    b: bag({ q: t.title, simple: t.blurb })
  });
  if (!fs.existsSync(file)) return;
  require(file);
  var set = IR.q[key];
  if (!set || !set.cards) return;
  set.cards.forEach(function (c) {
    entries.push({
      i: c.id,
      k: key,
      q: c.q,
      g: (c.tags || []).join(" "),
      b: bag(c)
    });
  });
});

/* The word bags are almost all of the weight, and they repeat heavily — a
   corpus this focused uses the same few thousand terms over and over. So the
   vocabulary is emitted once as a dictionary and each bag becomes a list of
   integer ids into it. Same information, a fraction of the bytes, and the
   search reads it back with one index lookup per word. */
var vocab = [];
var vocabIds = {};
function intern(w) {
  var id = vocabIds[w];
  if (id === undefined) { id = vocab.length; vocab.push(w); vocabIds[w] = id; }
  return id;
}
function encode(words) { return words.map(intern); }

entries.forEach(function (e) { e.b = encode(e.b); });
topicMeta.forEach(function (t) { t.b = encode(t.b); });

var payload = {
  built: new Date().toISOString().slice(0, 10),
  vocab: vocab,
  topics: topicMeta,
  cards: entries
};

var out = "/* Interview Room — generated search index. DO NOT EDIT BY HAND.\n"
  + "   Regenerate with:  node tools/build-search-index.js\n"
  + "   Source of truth is data/topics.js + data/q-*.js. */\n\n"
  + "window.IR = window.IR || {};\n"
  + "window.IR.searchIndex = " + JSON.stringify(payload) + ";\n";

fs.writeFileSync(path.join(root, "data/search-index.js"), out, "utf8");

var kb = Math.round(Buffer.byteLength(out) / 1024);
console.log("search-index.js written — " + entries.length + " cards, "
  + topicMeta.length + " topics, " + kb + "KB");
