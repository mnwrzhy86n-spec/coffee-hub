/* Coffee Hub — shared behavior: checkbox persistence, step carousel, service worker. */

(function () {
  "use strict";

  var pageKey = "coffeehub:" + (document.body.dataset.page || location.pathname);

  /* ---------- Checkbox persistence ---------- */

  var boxes = document.querySelectorAll(".checks input[type=checkbox]");

  function savedState() {
    try { return JSON.parse(localStorage.getItem(pageKey)) || {}; }
    catch (e) { return {}; }
  }

  function persist() {
    var state = {};
    boxes.forEach(function (box) {
      if (box.id && box.checked) state[box.id] = true;
    });
    localStorage.setItem(pageKey, JSON.stringify(state));
  }

  var saved = savedState();
  boxes.forEach(function (box) {
    if (saved[box.id]) box.checked = true;
    box.addEventListener("change", persist);
  });

  function resetChecks() {
    boxes.forEach(function (box) { box.checked = false; });
    localStorage.removeItem(pageKey);
  }

  document.querySelectorAll("[data-reset]").forEach(function (el) {
    el.addEventListener("click", resetChecks);
  });

  /* ---------- Step carousel ---------- */

  var track = document.querySelector(".steps");
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var dotsBox = document.querySelector(".dots");
    var dots = [];

    if (dotsBox) {
      slides.forEach(function () {
        dots.push(dotsBox.appendChild(document.createElement("span")));
      });
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    function paintDots() {
      var i = currentIndex();
      dots.forEach(function (dot, n) { dot.classList.toggle("on", n <= i); });
    }

    var raf = null;
    track.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; paintDots(); });
    });
    paintDots();

    function goTo(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
    }

    document.querySelectorAll("[data-next]").forEach(function (el) {
      el.addEventListener("click", function () { goTo(currentIndex() + 1); });
    });
    document.querySelectorAll("[data-back]").forEach(function (el) {
      el.addEventListener("click", function () { goTo(currentIndex() - 1); });
    });

    // Start button: fresh brew — clear checkboxes, then slide to step 1.
    document.querySelectorAll("[data-start]").forEach(function (el) {
      el.addEventListener("click", function () {
        resetChecks();
        goTo(1);
      });
    });
  }

  /* ---------- Shot timer (brew step) ---------- */

  var timer = document.querySelector("[data-timer]");
  if (timer) {
    var readout = timer.querySelector(".t");
    var hint = timer.querySelector("small");
    var prog = timer.querySelector(".prog");
    var CIRC = 2 * Math.PI * 52;
    prog.setAttribute("stroke-dasharray", CIRC);
    prog.setAttribute("stroke-dashoffset", CIRC);

    var startedAt = 0;
    var rafTimer = null;
    var state = "idle";

    function paintTimer(sec) {
      readout.textContent = sec.toFixed(1);
      prog.setAttribute("stroke-dashoffset", CIRC * (1 - Math.min(sec / 30, 1)));
      timer.classList.toggle("good", sec >= 25 && sec <= 30);
      timer.classList.toggle("over", sec > 30);
    }

    function tickTimer(now) {
      paintTimer((now - startedAt) / 1000);
      rafTimer = requestAnimationFrame(tickTimer);
    }

    timer.addEventListener("click", function () {
      if (state === "idle") {
        state = "running";
        hint.textContent = "tap to stop";
        startedAt = performance.now();
        rafTimer = requestAnimationFrame(tickTimer);
      } else if (state === "running") {
        state = "done";
        cancelAnimationFrame(rafTimer);
        hint.textContent = "tap to reset";
      } else {
        state = "idle";
        timer.classList.remove("good", "over");
        readout.textContent = "0.0";
        prog.setAttribute("stroke-dashoffset", CIRC);
        hint.textContent = "tap to start";
      }
    });
  }

  /* ---------- Offline support ---------- */

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
