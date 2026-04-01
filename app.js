/**
 * LINEN Ê — villa data, filters, dynamic pricing, lightbox
 */

const LOCATION_MULTIPLIER = {
  "Kaş": 1.15,
  Bodrum: 1.25,
  Fethiye: 1.08,
  Urla: 1.02,
  "Sapanca": 0.95,
};

const villas = [
  {
    id: "vela",
    name: "Vela Bruma",
    location: "Kaş",
    hasPool: true,
    maxGuests: 10,
    basePrice: 4200,
    perPerson: 380,
    description: "Denize bakan teras, sonsuzluk hissi.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
  },
  {
    id: "noct",
    name: "Noct Linen",
    location: "Bodrum",
    hasPool: true,
    maxGuests: 12,
    basePrice: 5800,
    perPerson: 420,
    description: "Gece yüzeyi — minimal çizgiler, maksimum ışık.",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b9a023181?w=1200&q=80",
    ],
  },
  {
    id: "salt",
    name: "Salt Meridian",
    location: "Fethiye",
    hasPool: false,
    maxGuests: 8,
    basePrice: 2900,
    perPerson: 310,
    description: "Havuz yok; kayalık ve zeytin arasında sessizlik.",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1605276373958-0fd9db536043?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    ],
  },
  {
    id: "mare",
    name: "Mare Subtle",
    location: "Urla",
    hasPool: true,
    maxGuests: 6,
    basePrice: 3600,
    perPerson: 340,
    description: "Küçük havuz, büyük gökyüzü.",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1575517111477-7e29f13c8d4a?w=1200&q=80",
    ],
  },
  {
    id: "pine",
    name: "Pine Threshold",
    location: "Sapanca",
    hasPool: false,
    maxGuests: 14,
    basePrice: 5200,
    perPerson: 260,
    description: "Orman çizgisinde toplu kaçış.",
    images: [
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80",
    ],
  },
];

function formatTry(n) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function computePrice(villa, guestCount, selectedLocationFactor) {
  const mult =
    selectedLocationFactor === "all"
      ? LOCATION_MULTIPLIER[villa.location] ?? 1
      : LOCATION_MULTIPLIER[selectedLocationFactor] ?? 1;
  const guests = Math.min(Math.max(2, guestCount), villa.maxGuests);
  const raw = (villa.basePrice + guests * villa.perPerson) * mult;
  return { total: raw, guests, mult };
}

function getPoolFilter() {
  const el = document.querySelector('input[name="pool"]:checked');
  return el ? el.value : "all";
}

function filterVillas() {
  const pool = getPoolFilter();
  const loc = document.getElementById("filterLocation").value;
  const guests = parseInt(document.getElementById("guestCount").value, 10);

  return villas.filter((v) => {
    if (pool === "pool" && !v.hasPool) return false;
    if (pool === "nopool" && v.hasPool) return false;
    if (loc !== "all" && v.location !== loc) return false;
    if (guests > v.maxGuests) return false;
    return true;
  });
}

function openLightbox(villa, startIndex = 0) {
  const dialog = document.getElementById("lightbox");
  const img = document.getElementById("lbImg");
  const cap = document.getElementById("lbCaption");
  const thumbs = document.getElementById("lbThumbs");

  const guestCount = parseInt(document.getElementById("guestCount").value, 10);
  const locVal = document.getElementById("filterLocation").value;
  const { total, guests } = computePrice(villa, guestCount, locVal);

  function showAt(i) {
    const safe = Math.max(0, Math.min(i, villa.images.length - 1));
    img.src = villa.images[safe];
    img.alt = `${villa.name} — fotoğraf ${safe + 1}`;
    img.dataset.villaId = villa.id;
    img.dataset.index = String(safe);
    cap.textContent = `${villa.name} · ${villa.location} · ${guests} misafir için gece ${formatTry(total)}`;
    thumbs.querySelectorAll("button").forEach((b, idx) => {
      b.setAttribute("aria-selected", idx === safe ? "true" : "false");
    });
  }

  thumbs.innerHTML = "";
  villa.images.forEach((src, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", `Fotoğraf ${idx + 1}`);
    const im = document.createElement("img");
    im.src = src.replace("w=1200", "w=200");
    im.alt = "";
    btn.appendChild(im);
    btn.addEventListener("click", () => showAt(idx));
    thumbs.appendChild(btn);
  });

  showAt(startIndex);
  dialog.showModal();
}

function render() {
  const grid = document.getElementById("villaGrid");
  const countEl = document.getElementById("resultCount");
  const guestCount = parseInt(document.getElementById("guestCount").value, 10);
  const locVal = document.getElementById("filterLocation").value;
  document.getElementById("guestValue").textContent = String(guestCount);

  const list = filterVillas();
  countEl.textContent =
    list.length === 0
      ? "Kriterlere uygun villa yok — misafir sayısını veya havuz filtresini gevşetin."
      : `${list.length} seçki · Konum çarpanı: ${
          locVal === "all" ? "villaya göre" : String(LOCATION_MULTIPLIER[locVal] ?? 1) + "×"
        }`;

  grid.innerHTML = "";
  list.forEach((v) => {
    const { total, guests } = computePrice(v, guestCount, locVal);
    const card = document.createElement("article");
    card.className = "villa-card";

    const mainSrc = v.images[0];
    card.innerHTML = `
      <div class="villa-card__gallery">
        <div class="villa-card__badges">
          <span class="badge ${v.hasPool ? "badge--pool" : ""}">${v.hasPool ? "Havuzlu" : "Havuzsuz"}</span>
          <span class="badge">Max ${v.maxGuests} kişi</span>
        </div>
        <img class="villa-card__main-img" src="${mainSrc}" alt="${v.name} ana görünüm" loading="lazy" data-open-main="1" />
        <div class="villa-card__thumbs" role="group" aria-label="Galeri küçük resimleri"></div>
      </div>
      <div class="villa-card__body">
        <h3 class="villa-card__name">${v.name}</h3>
        <p class="villa-card__loc">${v.location}</p>
        <p class="villa-card__meta">${v.description}</p>
      </div>
      <div class="villa-card__price-block">
        <span class="villa-card__price">${formatTry(total)}</span>
        <span class="villa-card__price-sub">Gece · ${guests} misafir · konum çarpanı dahil</span>
      </div>
    `;

    const thumbsWrap = card.querySelector(".villa-card__thumbs");
    const mainImg = card.querySelector(".villa-card__main-img");

    mainImg.addEventListener("click", () => openLightbox(v, 0));

    v.images.forEach((src, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "villa-card__thumb";
      btn.setAttribute("aria-label", `${v.name} — fotoğraf ${idx + 1}, büyüt`);
      const im = document.createElement("img");
      im.src = src.replace("w=1200", "w=400");
      im.alt = "";
      btn.appendChild(im);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(v, idx);
      });
      thumbsWrap.appendChild(btn);
    });

    grid.appendChild(card);
  });
}

function initLocationSelect() {
  const sel = document.getElementById("filterLocation");
  const locations = [...new Set(villas.map((v) => v.location))].sort();
  locations.forEach((loc) => {
    const opt = document.createElement("option");
    opt.value = loc;
    opt.textContent = `${loc} (×${LOCATION_MULTIPLIER[loc]})`;
    sel.appendChild(opt);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLocationSelect();

  document.querySelectorAll('input[name="pool"]').forEach((r) =>
    r.addEventListener("change", render)
  );
  document.getElementById("filterLocation").addEventListener("change", render);
  document.getElementById("guestCount").addEventListener("input", render);

  document.getElementById("lbClose").addEventListener("click", () => {
    document.getElementById("lightbox").close();
  });

  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  document.getElementById("lightbox").addEventListener("cancel", (e) => {
    e.preventDefault();
    document.getElementById("lightbox").close();
  });

  document.addEventListener("keydown", (e) => {
    const dlg = document.getElementById("lightbox");
    if (!dlg.open) return;
    const img = document.getElementById("lbImg");
    const idx = parseInt(img.dataset.index || "0", 10);
    if (e.key === "Escape") dlg.close();
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const villaId = img.dataset.villaId;
      const villaObj = villas.find((v) => v.id === villaId);
      if (!villaObj) return;
      const next =
        e.key === "ArrowRight"
          ? Math.min(idx + 1, villaObj.images.length - 1)
          : Math.max(idx - 1, 0);
      const g = parseInt(document.getElementById("guestCount").value, 10);
      const loc = document.getElementById("filterLocation").value;
      const { total, guests } = computePrice(villaObj, g, loc);
      img.src = villaObj.images[next];
      img.alt = `${villaObj.name} — fotoğraf ${next + 1}`;
      img.dataset.index = String(next);
      document.getElementById("lbCaption").textContent = `${villaObj.name} · ${villaObj.location} · ${guests} misafir için gece ${formatTry(total)}`;
      dlg.querySelectorAll(".lightbox-thumbs button").forEach((b, i) => {
        b.setAttribute("aria-selected", i === next ? "true" : "false");
      });
    }
  });

  render();
});
