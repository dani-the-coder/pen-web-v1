/* =========================================================
   3D HERO — Spline runtime, 4-part scroll choreography + spin
   ---------------------------------------------------------
   ⚙️  Change the scene: set SCENE_URL below to your Spline
   "Public URL" (https://prod.spline.design/.../scene.splinecode).

   The script:
   • renders the scene with the Spline runtime,
   • adds a continuous rotation so it reads as a 3D object,
   • gently repositions/scales it across the 4 parts (kept on-screen),
   • drives the progress bar, key-press text effect, and nav contrast.

   The Spline runtime is loaded with a DYNAMIC import, so the rest of
   the page still works if its CDN is slow/unreachable.
   ========================================================= */
(function () {
  "use strict";

  const SCENE_URL = "https://prod.spline.design/RBSFZLpgHDirOd-g/scene.splinecode";
  const SPLINE_RUNTIME = "https://esm.sh/@splinetool/runtime@1"; // latest 1.x (loads current scenes)
  // Optional: force a specific object to rotate (as named in the Spline outliner).
  // Leave "" to auto-pick the main object.
  const ROTATE_OBJECT = "";

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const canvas = document.getElementById("canvas3d");
  const stage = document.querySelector("#hero3d .h3d-canvas-cont");
  if (!gsap || !ScrollTrigger || !stage) return;

  gsap.registerPlugin(ScrollTrigger);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- fade the fixed 3D layer out (and back in) as the hero scrolls away ----
     end finishes BEFORE the next section reaches the model, so it never
     overlaps the section below. Raise the end % (e.g. "bottom 75%") to fade
     even sooner; lower it (e.g. "bottom 40%") to fade later.                 */
  gsap.timeline({
    scrollTrigger: { trigger: "#hero3d", start: "bottom bottom", end: "bottom 80%", scrub: true },
  }).to(".h3d-canvas-cont", { autoAlpha: 0, ease: "none" }, 0);

  /* ---- key-press text effect (the .key letters in the intro headline) ---- */
  const keys = document.querySelectorAll("#hero3d .key");
  if (keys.length && !reduce) {
    (function pressRandomKey() {
      const k = keys[Math.floor(Math.random() * keys.length)];
      k.style.animation = "h3dPress 0.2s ease-in-out";
      k.onanimationend = () => { k.style.animation = ""; setTimeout(pressRandomKey, 100 + Math.random() * 300); };
    })();
  }

  /* ---- gentle screen-space repositioning across the 4 parts ----
     (kept subtle so the model always stays in view)                  */
  // 3D object starts on the RIGHT on page load (intro). Increase to push further right.
  gsap.set(stage, { transformOrigin: "50% 50%", xPercent: 28 });
  if (!reduce) {
    // Path: intro=right (28)  →  part1=left  →  part2=further left  →  part3=center → fade
    gsap.timeline({ scrollTrigger: { trigger: "#part1", start: "top 60%", end: "bottom bottom", scrub: true } })
      .to(stage, { xPercent: -20, yPercent: -3, scale: 1.55, ease: "none" }, 0);
    gsap.timeline({ scrollTrigger: { trigger: "#part2", start: "top bottom", end: "center bottom", scrub: true } })
      .to(stage, { xPercent: 22, yPercent: 2, scale: 1.11, ease: "none" }, 0);
    gsap.timeline({ scrollTrigger: { trigger: "#part3", start: "top bottom", end: "bottom bottom", scrub: true } })
      .to(stage, { xPercent: 0, yPercent: 0, scale: 1, ease: "none" }, 0);
  }

  /* ---- render the scene + spin the object so it feels 3D ---- */
  if (canvas) {
    import(SPLINE_RUNTIME)
      .then(({ Application }) => {
        const app = new Application(canvas);
        return app.load(SCENE_URL).then(() => {
          // find an object to rotate (no object name required)
          let objs = [];
          try { objs = (typeof app.getAllObjects === "function" && app.getAllObjects()) || []; } catch (e) { }
          const isAux = (n) => /camera|light|directional|spot|hemisphere|ambient|sun|point/i.test(n || "");

          // log available names so the scene can be fine-tuned later
          const names = objs.map((o) => o && o.name).filter(Boolean);
          if (names.length) console.log("[hero3d] Spline objects:", names);

          let target = null;
          if (ROTATE_OBJECT) target = app.findObjectByName(ROTATE_OBJECT);
          if (!target) target = objs.find((o) => o && o.rotation && !isAux(o.name)) || objs[0] || null;

          if (target && target.rotation && !reduce) {
            // rotate on the Z axis only (continuous, in-plane spin)
            gsap.to(target.rotation, { z: "+=" + Math.PI * 2, duration: 16, repeat: -1, ease: "none" });
          } else if (!target) {
            console.warn("[hero3d] no rotatable object found — set ROTATE_OBJECT to a name from the log above.");
          }

          ScrollTrigger.refresh();
        });
      })
      .catch((err) => console.warn("[hero3d] Spline runtime/scene failed to load:", err));
  }
})();
