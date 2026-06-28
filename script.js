/* =========================================================
   PEN Foundation — interactions & GSAP motion
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- NAV: scrolled state + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const mobileMenu = document.getElementById("mobileMenu");
  const openMenu = () => {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  document.getElementById("navToggle").addEventListener("click", openMenu);
  document.getElementById("navClose").addEventListener("click", closeMenu);
  mobileMenu.querySelectorAll("[data-close]").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ---------- HERO: audience tabs ---------- */
  const AUD = [
    {
      h: "Your home deserves a foundation that installs in hours — not weeks.",
      s: "No excavation. No mess. No waiting. Just a solid base, ready to build on.",
    },
    {
      h: "IS 2911 compliant. ANSYS validated. 667 kN/m² peak load.",
      s: "Engineered for real soil conditions — laterite, clay, sand mix, water-rich profiles.",
    },
    {
      h: "Deploy solar arrays 10× faster with zero land disruption.",
      s: "Minimal site footprint. Immediate load-bearing. Forest and open terrain ready.",
    },
    {
      h: "Build in forest terrain without disturbing a single root.",
      s: "GRIHA aligned. Zero excavation. Nature-first construction for premium eco builds.",
    },
  ];
  const heroHead = document.getElementById("heroHead");
  const heroSub = document.getElementById("heroSub");
  document.querySelectorAll(".aud-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".aud-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const d = AUD[+tab.dataset.aud];
      if (window.gsap && !prefersReduced) {
        gsap.to([heroHead, heroSub], {
          opacity: 0,
          y: 10,
          duration: 0.2,
          onComplete: () => {
            heroHead.textContent = d.h;
            heroSub.textContent = d.s;
            gsap.to([heroHead, heroSub], { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 });
          },
        });
      } else {
        heroHead.textContent = d.h;
        heroSub.textContent = d.s;
      }
    });
  });

  /* ---------- FAQ ---------- */
  const FAQ = [
    ["Is PEN Foundation as strong as conventional concrete foundations?",
     "Yes — and in most cases, stronger. PEN Foundation delivers 2.0–2.6× improvement in Soil Bearing Capacity (SBC) compared to conventional spread footings. Peak load capacity is 667 kN/m², validated through ANSYS FEA simulation and PLAXIS geotechnical analysis. It is fully IS 2911 compliant."],
    ["How is it possible to install a foundation in just 2 hours?",
     "PEN Foundation uses a driven nail system — no excavation, no concrete pouring, no curing time. The GI pipe nails with tungsten carbide tips are mechanically driven into the soil, and the M50 micro-concrete node is pre-engineered. The entire process is precision-controlled and requires minimal equipment. What traditionally takes 21+ days of excavation, formwork, pouring, and curing is compressed into a 2-hour installation."],
    ["What soil types does PEN Foundation work in?",
     "PEN Foundation is engineered for real Kerala soil conditions — laterite, clay, sand mix, and water-rich profiles. Each soil type has been tested and validated with specific load distribution parameters. Our engineers conduct a site assessment to determine the optimal PEN configuration for your specific ground conditions."],
    ["Is it approved by any regulatory or academic body?",
     "Yes. PEN Foundation has been validated by NIT Calicut and IIT Kanpur through independent research. It is IS 2911 compliant (Indian Standard for pile foundations), GRIHA aligned for green building certification, and validated through ANSYS and PLAXIS simulation software. Model: CD-PEN-32.3.2.1500."],
    ["Does zero excavation mean the foundation is less stable?",
     "No — the opposite is true. Excavation weakens surrounding soil by removing lateral support. PEN Foundation's driven nail system compacts and reinforces the soil around each nail, improving load distribution. The biomimicry-inspired design (modeled on tree root systems) distributes load across multiple points, making it more resilient than a single concrete footing."],
    ["What is the cost compared to conventional foundations?",
     "PEN Foundation typically saves ₹35,000–₹55,000 per foundation point in labor and machinery costs. For a typical residential project with 12 foundation points, that's ₹4–6 lakhs in savings — plus the time savings of completing in hours instead of weeks. Use our calculator above to estimate your specific project savings."],
    ["Can it be used in forest or eco-sensitive zones?",
     "Yes — this is one of PEN Foundation's strongest advantages. Zero excavation means zero soil displacement, no damage to root systems, and minimal environmental footprint. It is GRIHA aligned and has been successfully deployed in 200+ installations across the Western Ghats forest terrain in Kudal, with zero disruption to the surrounding ecosystem."],
    ["How do I get started?",
     "Book a free site assessment. Our engineers will visit your site, evaluate soil conditions, and recommend the optimal PEN Foundation configuration for your project. There is no obligation — just a technical evaluation to help you make an informed decision."],
  ];
  const faqList = document.getElementById("faqList");
  FAQ.forEach(([q, a], i) => {
    const item = document.createElement("div");
    item.className = "faq-item reveal";
    item.innerHTML =
      '<button class="faq-q" aria-expanded="false" aria-controls="fa-' + i + '">' +
        "<span>" + q + "</span><i class='ri-add-line'></i></button>" +
      '<div class="faq-a" id="fa-' + i + '"><div class="inner">' + a + "</div></div>";
    faqList.appendChild(item);
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      // close siblings
      faqList.querySelectorAll(".faq-item").forEach((sib) => {
        if (sib !== item && sib.classList.contains("open")) {
          sib.classList.remove("open");
          sib.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          sib.querySelector(".faq-a").style.maxHeight = "0px";
        }
      });
    });
  });

  /* ---------- CALCULATOR ---------- */
  const TRAD_DAYS_PER_POINT = 2.1; // traditional
  const PEN_HOURS_PER_POINT = 2;   // PEN
  const COST_PER_POINT = 45000;    // ₹ saved per point (midpoint)
  const CO2_PER_POINT = 65;        // kg saved per point

  const ptsEl = document.getElementById("pts");
  const ptsVal = document.getElementById("ptsVal");
  let mult = 1;

  function calc() {
    const pts = +ptsEl.value;
    const tradDays = pts * TRAD_DAYS_PER_POINT;
    const penDays = (pts * PEN_HOURS_PER_POINT) / 8; // 8 working hrs
    const daysSaved = Math.max(0, Math.round((tradDays - penDays) * mult));
    const cost = ((pts * COST_PER_POINT * mult) / 100000).toFixed(1); // ₹ lakh
    const co2 = Math.round(pts * CO2_PER_POINT * mult);
    const weeks = (daysSaved / 7).toFixed(1);

    ptsVal.textContent = pts;
    document.getElementById("rDays").textContent = daysSaved;
    document.getElementById("rCost").textContent = cost;
    document.getElementById("rCO2").textContent = co2.toLocaleString("en-IN");
    document.getElementById("rWeeks").textContent =
      "That's " + weeks + " weeks back in your life";

    // fill slider track
    const pct = ((pts - 4) / (100 - 4)) * 100;
    ptsEl.style.background =
      "linear-gradient(90deg, var(--teal) " + pct + "%, var(--bg-alt) " + pct + "%)";
  }
  ptsEl.addEventListener("input", calc);
  document.querySelectorAll(".ptype").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".ptype").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      mult = +b.dataset.mult;
      calc();
    });
  });
  calc();

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById("assessForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#f-name");
    const email = form.querySelector("#f-email");
    let ok = true;
    [name, email].forEach((f) => {
      if (!f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value))) {
        f.style.borderColor = "var(--coral)";
        ok = false;
      } else {
        f.style.borderColor = "";
      }
    });
    if (!ok) {
      (name.value.trim() ? email : name).focus();
      return;
    }
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerHTML = "<i class='ri-loader-4-line'></i> Sending…";
    btn.querySelector("i").style.animation = "spin 1s linear infinite";
    setTimeout(() => {
      form.style.display = "none";
      document.getElementById("formSuccess").classList.add("show");
    }, 1100);
  });

  /* ---------- GSAP MOTION ---------- */
  if (window.gsap && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance timeline (explicit fromTo → ends visible)
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".hero .reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.1)
      .fromTo(".float-card",
        { opacity: 0, scale: 0.85, y: 14 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.5);

    // Generic scroll reveals (skip hero, already animated)
    gsap.utils.toArray(".reveal").forEach((el) => {
      if (el.closest(".hero")) return;
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        }
      );
    });

    // Stagger grids
    gsap.utils.toArray(".grid").forEach((grid) => {
      const kids = grid.querySelectorAll(".reveal");
      if (kids.length > 1) {
        ScrollTrigger.create({
          trigger: grid, start: "top 85%",
          onEnter: () => gsap.fromTo(kids,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.07, overwrite: true }),
        });
      }
    });

    // Parallax on framed media
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      gsap.fromTo(el, { y: -18 }, {
        y: 24, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Failsafe: never leave a .reveal stuck hidden. After load, force-show any
    // reveal already in/above the viewport, and refresh trigger positions.
    const failsafe = () => {
      ScrollTrigger.refresh();
      const vh = window.innerHeight;
      gsap.utils.toArray(".reveal").forEach((el) => {
        if (el.closest(".hero")) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95 && getComputedStyle(el).opacity < 0.05) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.5, overwrite: true });
        }
      });
    };
    window.addEventListener("load", () => setTimeout(failsafe, 200));
    // Don't depend solely on `load` (can hang on slow images): also run on a timer.
    setTimeout(failsafe, 1500);

    // Count-up numbers
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const end = +el.dataset.count;
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const span = el.querySelector("span") || el; // bigstat wraps a span
      const target = el.querySelector("span") ? el.querySelector("span") : el;
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(obj, {
          v: end, duration: 1.4, ease: "power2.out",
          onUpdate: () => {
            const val = Math.round(obj.v);
            const text = prefix + val.toLocaleString("en-IN") + suffix;
            if (el.querySelector("span")) target.textContent = prefix + val + (el === target ? suffix : "");
            else el.textContent = text;
          },
          onComplete: () => {
            if (el.querySelector("span")) target.textContent = prefix + end.toLocaleString("en-IN");
            else el.textContent = prefix + end.toLocaleString("en-IN") + suffix;
          },
        }),
      });
    });
  } else {
    // reduced motion / no gsap → ensure visible
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
  }

  // spin keyframes (for submit loader) injected once
  const style = document.createElement("style");
  style.textContent = "@keyframes spin{to{transform:rotate(360deg)}}";
  document.head.appendChild(style);
})();
