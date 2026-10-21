/* Rehearsal room - pick a question, start the timer, say it out loud.
   Depends on portal.js having loaded IR.allCards and IR.renderCard.
   Runs after ir:ready so the shared runtime is fully initialised. */
(function () {
  "use strict";

  function start() {
    var IR = window.IR;
    var stage = document.querySelector("[data-stage]");
    if (!stage || !IR || !IR.allCards) return;

    var pool = IR.allCards();
    var face = document.querySelector("[data-timer]");
    var roundSel = document.querySelector("[data-round-filter]");
    var current = null;
    var ticker = null;
    var seconds = 0;
    var target = 60;

    function fmtTime(s) {
      var m = Math.floor(s / 60), r = s % 60;
      return m + ":" + String(r).padStart(2, "0");
    }
    function paint() {
      face.textContent = fmtTime(seconds);
      face.classList.toggle("is-over", seconds > target);
    }
    function stop() {
      if (ticker) { clearInterval(ticker); ticker = null; }
    }
    function reset() {
      stop(); seconds = 0; paint();
    }

    function filtered() {
      var r = roundSel.value;
      if (!r) return pool;
      var hit = pool.filter(function (c) { return (c.round || []).indexOf(r) >= 0; });
      return hit.length ? hit : pool;
    }

    function draw() {
      var list = filtered();
      var pick = list[Math.floor(Math.random() * list.length)];
      /* avoid drawing the same card twice in a row when there is a choice */
      if (current && list.length > 1 && pick.id === current.id) {
        pick = list[(list.indexOf(pick) + 1) % list.length];
      }
      current = pick;
      target = (pick.round || []).indexOf("screening") >= 0 ? 30 : 120;

      stage.innerHTML = "";
      var head = document.createElement("div");
      head.className = "note";
      head.innerHTML = "<strong>Say it out loud, from memory, before you open the answer.</strong> " +
        "Target for this one: " + target + " seconds. " +
        "Topic: " + (pick._topic ? pick._topic.title : " - ") + ".";
      stage.appendChild(head);
      stage.appendChild(IR.renderCard(pick, 0, { showTopic: true }));
      reset();
      document.querySelector("[data-target]").textContent = target + "s";
    }

    document.querySelector("[data-draw]").addEventListener("click", draw);
    document.querySelector("[data-start]").addEventListener("click", function () {
      if (ticker) return;
      ticker = setInterval(function () { seconds++; paint(); }, 1000);
    });
    document.querySelector("[data-stop]").addEventListener("click", stop);
    document.querySelector("[data-reset]").addEventListener("click", reset);
    roundSel.addEventListener("change", draw);

    function stats() {
      var done = Object.keys(IR.delivered()).length;
      document.querySelector("[data-done-count]").textContent = done;
      document.querySelector("[data-pool-count]").textContent = pool.length;
      document.querySelector("[data-pct]").textContent =
        pool.length ? Math.round((done / pool.length) * 100) + "%" : "0%";
    }
    document.addEventListener("ir:delivered", stats);
    stats();
    draw();

    document.querySelector("[data-clear]").addEventListener("click", function () {
      if (!confirm("Clear every 'delivered out loud' mark? This cannot be undone.")) return;
      try { localStorage.removeItem("ir.delivered"); } catch (e) {}
      stats();
      draw();
    });
  }

  document.addEventListener("ir:ready", start);
})();
