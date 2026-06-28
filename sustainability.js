/* =========================================================
   PEN Foundation — Sustainability page
   Project map (Leaflet), site list, carbon toggle, notify form
   NOTE: site list below is SAMPLE data — replace `SITES` with
   real project records (carbon = units * ~100 kg CO₂-eq, ISO LCA).
   ========================================================= */
(function () {
  "use strict";

  const CO2_PER_UNIT = 100; // kg CO₂-eq avoided per unit (ISO LCA, ~99.5)

  const SITES = [
    { city: "Kozhikode, Kerala",     lat: 11.2588, lng: 75.7804, units: 48 },
    { city: "Pune, Maharashtra",     lat: 18.5204, lng: 73.8567, units: 32 },
    { city: "Bengaluru, Karnataka",  lat: 12.9716, lng: 77.5946, units: 40 },
    { city: "Hosur, Tamil Nadu",     lat: 12.7409, lng: 77.8253, units: 24 },
  ].map((s) => ({ ...s, co2: s.units * CO2_PER_UNIT }));

  const fmt = (n) => n.toLocaleString("en-IN");

  /* ---------- Notify form (calculator placeholder) ---------- */
  const notifyForm = document.getElementById("notifyForm");
  if (notifyForm) {
    notifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("notifyEmail");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
        email.style.borderColor = "var(--coral)";
        email.focus();
        return;
      }
      // TODO: POST email to the warm-list endpoint when available.
      notifyForm.style.display = "none";
      document.getElementById("notifyOk").classList.add("show");
    });
  }

  /* ---------- Project map ---------- */
  const mapEl = document.getElementById("projectMap");
  const siteList = document.getElementById("siteList");
  if (!siteList) return;

  let mode = "loc"; // "loc" | "carbon"
  let markers = [];
  let map = null;

  // Build the side list
  const cards = SITES.map((s, i) => {
    const el = document.createElement("button");
    el.className = "site-card";
    el.type = "button";
    el.innerHTML =
      '<div class="city"><i class="ri-map-pin-fill"></i> ' + s.city + "</div>" +
      '<div class="meta"><span><b>' + s.units + "</b> units</span>" +
      "<span><b>" + fmt(s.co2) + "</b> kg CO₂ saved</span></div>";
    el.addEventListener("click", () => focusSite(i));
    siteList.appendChild(el);
    return el;
  });

  function setActive(i) {
    cards.forEach((c, k) => c.classList.toggle("active", k === i));
  }

  function focusSite(i) {
    setActive(i);
    if (map && markers[i]) {
      map.flyTo([SITES[i].lat, SITES[i].lng], 8, { duration: 0.8 });
      markers[i].openTooltip();
    }
  }

  function tipText(s) {
    return mode === "carbon"
      ? "<b>" + fmt(s.co2) + " kg</b> CO₂ saved"
      : "<b>" + s.city + "</b>";
  }

  function refreshTips() {
    markers.forEach((m, i) => {
      m.setTooltipContent(tipText(SITES[i]));
    });
  }

  // Toggle buttons
  const tgLoc = document.getElementById("mTgLoc");
  const tgCarbon = document.getElementById("mTgCarbon");
  if (tgLoc && tgCarbon) {
    tgLoc.addEventListener("click", () => {
      mode = "loc"; tgLoc.classList.add("active"); tgCarbon.classList.remove("active"); refreshTips();
    });
    tgCarbon.addEventListener("click", () => {
      mode = "carbon"; tgCarbon.classList.add("active"); tgLoc.classList.remove("active"); refreshTips();
    });
  }

  // Init Leaflet (guard if the CDN failed to load)
  if (mapEl && window.L) {
    map = L.map(mapEl, {
      center: [15.5, 76.5],
      zoom: 5,
      scrollWheelZoom: false,
      attributionControl: true,
    });
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, attribution: "&copy; OpenStreetMap &copy; CARTO" }
    ).addTo(map);

    const icon = L.divIcon({
      className: "",
      html:
        '<span style="display:block;width:22px;height:22px;border-radius:50%;background:#E1412A;border:3px solid #fff;box-shadow:0 2px 8px rgba(6,38,44,.35)"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    markers = SITES.map((s, i) => {
      const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
      m.bindTooltip(tipText(s), { direction: "top", offset: [0, -10] });
      m.on("click", () => focusSite(i));
      return m;
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.4));
  } else if (mapEl) {
    // Graceful fallback if Leaflet didn't load
    mapEl.style.display = "grid";
    mapEl.style.placeItems = "center";
    mapEl.style.padding = "30px";
    mapEl.innerHTML =
      '<p style="font-family:var(--font-mono);color:var(--ink-soft);text-align:center">' +
      "Interactive map unavailable offline — see the project list →</p>";
  }
})();
