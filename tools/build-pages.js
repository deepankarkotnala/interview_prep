/* Interview Room - page builder.
   Run from the portal root:  node tools/build-pages.js

   1. Writes one topics/<key>.html per live topic in data/topics.js. Topic pages
      are pure shells - portal.js loads the topic's data and renders it - so
      they are generated rather than hand-edited.
   2. Writes one visuals/<slug>.html per entry in data/visuals.js, the same
      kind of shell: assets/visual.js draws the scene from data/v-<slug>.js.
   3. Rewrites the block between <!-- head:start --> and <!-- head:end --> in
      every root page, so all pages share one boot script, one stylesheet and
      one cache-busting version. The version lives in assets/portal.js (V) and
      is read from there, so bumping it in one place updates every page.

   Page-specific scripts are declared on the head:start marker itself:
     <!-- head:start scripts="assets/practice.js" -->  */

var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
global.window = {};
require(path.join(root, "data/topics.js"));
require(path.join(root, "data/visuals.js"));
var IR = global.window.IR;

var V = (/var V = IR\.V = "([^"]+)"/.exec(fs.readFileSync(path.join(root, "assets/portal.js"), "utf8")) || [])[1];
if (!V) throw new Error("could not read the version (var V) from assets/portal.js");

/* Runs before first paint: theme, text size, width and alignment come from
   localStorage so a dark-mode reader never sees a white flash. Left-aligned
   text is the default; justified only if the reader chose it in Display. */
var BOOT = '(function(){try{var d=document.documentElement;var t=localStorage.getItem("ir.theme")||"light";' +
  'd.setAttribute("data-theme",t);var m=document.querySelector(\'meta[name="theme-color"]\');' +
  'if(m)m.content=t==="dark"?"#1b1b1b":"#f4f6fb";var r={};try{r=JSON.parse(localStorage.getItem("ir.reading"))||{};}catch(e){}' +
  'var dz=matchMedia("(max-width:860px)").matches?"m":"s";' +
  'd.setAttribute("data-reading-size",["xs","s","m","l","xl"].indexOf(r.size)<0?dz:r.size);' +
  'var isF=localStorage.getItem("ir.focus")==="true";var defW=isF?"default":"wide";var wPref=isF?r.focusWidth:r.width;' +
  'd.setAttribute("data-reading-width",["default","wide","full"].indexOf(wPref)<0?defW:wPref);' +
  'd.setAttribute("data-reading-align",r.alignSet&&r.align==="justify"?"justify":"left");}catch(e){}})();';

function head(base, scripts, marker) {
  return marker + "\n" +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<meta name="theme-color" content="#f4f6fb">\n' +
    '<link rel="icon" type="image/svg+xml" href="' + base + 'assets/brand/favicon.svg?v=' + V + '">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="' + base + 'assets/brand/favicon-32.png?v=8">\n' +
    '<link rel="apple-touch-icon" href="' + base + 'assets/brand/apple-touch-icon.png?v=9">\n' +
    '<meta name="apple-mobile-web-app-capable" content="yes">\n' +
    '<meta name="apple-mobile-web-app-title" content="Interview Room">\n' +
    '<script>' + BOOT + '</script>\n' +
    '<link rel="stylesheet" href="' + base + 'assets/portal.css?v=' + V + '">\n' +
    '<script defer src="' + base + 'data/topics.js?v=' + V + '"></script>\n' +
    '<script defer src="' + base + 'data/visuals.js?v=' + V + '"></script>\n' +
    '<script defer src="' + base + 'assets/portal.js?v=' + V + '"></script>\n' +
    scripts.map(function (s) { return '<script defer src="' + base + s + '?v=' + V + '"></script>\n'; }).join("") +
    "<!-- head:end -->";
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* 1. topic pages */
var written = 0;
IR.topics.forEach(function (t) {
  if (t.status !== "live") return;
  var key = t.num + "-" + t.slug;
  var html = '<!DOCTYPE html>\n<html lang="en" data-theme="light">\n<head>\n' +
    head("../", [], "<!-- head:start -->") + "\n" +
    "<title>" + esc(t.title) + " | Interview Room</title>\n" +
    '<meta name="description" content="' + esc(t.title) + ' interview questions for senior GenAI engineer roles in India: ' +
      'the mechanism in plain language, the exact words to say in the room, and a way to check you really know it.">\n' +
    "</head>\n" +
    '<body data-page="topic" data-topic="' + key + '" data-depth="1">\n' +
    '<a class="skip" href="#main">Skip to content</a>\n' +
    '<div class="app">\n' +
    '  <aside class="sidebar" data-sidebar></aside>\n' +
    '  <div class="main">\n' +
    '    <header class="topbar" data-topbar data-crumbs="' + esc(t.title) + '"></header>\n' +
    '    <main class="content" id="main">\n' +
    '      <div class="page-head" data-topic-head></div>\n' +
    '      <div data-topic-body></div>\n' +
    '    </main>\n' +
    '  </div>\n' +
    '</div>\n' +
    '</body>\n</html>\n';
  fs.writeFileSync(path.join(root, "topics", key + ".html"), html, "utf8");
  written++;
});

/* 2. visual explanation pages */
var visualsDir = path.join(root, "visuals");
if (!fs.existsSync(visualsDir)) fs.mkdirSync(visualsDir);
var visualsWritten = 0;
(IR.visuals || []).forEach(function (v) {
  var html = '<!DOCTYPE html>\n<html lang="en" data-theme="light">\n<head>\n' +
    head("../", ["assets/visual.js"], '<!-- head:start scripts="assets/visual.js" -->') + "\n" +
    "<title>" + esc(v.title) + " - visual explanation | Interview Room</title>\n" +
    '<meta name="description" content="' + esc(v.blurb) + '">\n' +
    "</head>\n" +
    '<body data-page="visual" data-visual="' + esc(v.slug) + '" data-depth="1">\n' +
    '<a class="skip" href="#main">Skip to content</a>\n' +
    '<div class="app">\n' +
    '  <aside class="sidebar" data-sidebar></aside>\n' +
    '  <div class="main">\n' +
    '    <header class="topbar" data-topbar data-crumbs="Visual explanations@visuals.html|' + esc(v.title) + '"></header>\n' +
    '    <main class="content" id="main">\n' +
    '      <div data-visual-body></div>\n' +
    '    </main>\n' +
    '  </div>\n' +
    '</div>\n' +
    '</body>\n</html>\n';
  fs.writeFileSync(path.join(visualsDir, v.slug + ".html"), html, "utf8");
  visualsWritten++;
});

/* 3. root pages: refresh the shared head block */
var refreshed = [];
fs.readdirSync(root).filter(function (f) { return /\.html$/.test(f); }).forEach(function (f) {
  var p = path.join(root, f), s = fs.readFileSync(p, "utf8");
  var m = /<!-- head:start(?: scripts="([^"]*)")? -->[\s\S]*?<!-- head:end -->/.exec(s);
  if (!m) return;
  var scripts = (m[1] || "").split(/[\s,]+/).filter(Boolean);
  var marker = m[1] ? '<!-- head:start scripts="' + m[1] + '" -->' : "<!-- head:start -->";
  s = s.replace(m[0], head("", scripts, marker));
  fs.writeFileSync(p, s, "utf8");
  refreshed.push(f);
});

console.log("build-pages: " + written + " topic pages and " + visualsWritten + " visual pages written, root pages refreshed: " +
  refreshed.join(", ") + " (v" + V + ")");
