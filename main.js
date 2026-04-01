const villas = [
    { id: 1, name: "Villa Noir", location: "coast", capacity: 2, pool: true, priceBase: 1500, img1: "villa_ocean.png", img2: "villa_pool.png" },
    { id: 2, name: "Le Crépuscule", location: "mountain", capacity: 4, pool: false, priceBase: 2200, img1: "villa_mountain.png", img2: "villa_ocean.png" },
    { id: 3, name: "L'Ombre", location: "forest", capacity: 6, pool: true, priceBase: 3000, img1: "villa_forest.png", img2: "villa_pool.png" },
    { id: 4, name: "Étoile Filante", location: "coast", capacity: 8, pool: true, priceBase: 4500, img1: "villa_pool.png", img2: "villa_ocean.png" },
    { id: 5, name: "Maison de la Nuit", location: "mountain", capacity: 2, pool: true, priceBase: 1800, img1: "villa_mountain.png", img2: "villa_forest.png" },
    { id: 6, name: "Le Reflet", location: "forest", capacity: 4, pool: false, priceBase: 2000, img1: "villa_forest.png", img2: "villa_mountain.png" },
    { id: 7, name: "Villa d'Or", location: "coast", capacity: 6, pool: true, priceBase: 3500, img1: "villa_ocean.png", img2: "villa_pool.png" },
    { id: 8, name: "Sanctuaire", location: "mountain", capacity: 8, pool: false, priceBase: 3800, img1: "villa_mountain.png", img2: "villa_ocean.png" }
];

// Fiyat, konuma ve kişi sayısına göre dinamik hesaplanır
const locationMult = { coast: 1.2, mountain: 1.0, forest: 0.9 };
const capMult = (cap) => cap > 4 ? 1.5 : 1.0;

function calculatePrice(villa) {
    return Math.floor(villa.priceBase * locationMult[villa.location] * capMult(villa.capacity));
}

const villasGrid = document.getElementById('villasGrid');

function renderVillas(filteredVillas) {
    villasGrid.innerHTML = '';

    if (filteredVillas.length === 0) {
        villasGrid.innerHTML = '<div class="no-results">Seçimlerinize uygun villa bulunamadı. Lütfen filtreleri değiştirin.</div>';
        return;
    }

    filteredVillas.forEach((villa, index) => {
        const finalPrice = calculatePrice(villa);
        const locMap = { "coast": "Sahil Boyu", "mountain": "Dağ Zirvesi", "forest": "Orman İçi" };

        const card = document.createElement('div');
        card.className = 'villa-card';
        // Asimetrik delay
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="villa-image-wrapper">
                <img src="./${villa.img1}" alt="${villa.name}" class="villa-image primary" />
                <img src="./${villa.img2}" alt="${villa.name}" class="villa-image secondary" />
            </div>
            <div class="villa-info">
                <h3 class="villa-title">${villa.name}</h3>
                <div class="villa-meta">${locMap[villa.location]} | Maks ${villa.capacity} Kişi ${villa.pool ? '| Özel Havuzlu' : '| Havuzsuz'}</div>
                <div class="villa-details">
                    <div class="villa-price">$${finalPrice.toLocaleString()} <span style="font-size:0.8rem; color:var(--text-muted)">/ Gecelik</span></div>
                    <button class="btn-primary" style="width:auto; padding: 10px 20px; margin:0;" onclick="alert('${villa.name} için rezervasyon talebi alındı.')">Rezerve Et</button>
                </div>
            </div>
        `;
        villasGrid.appendChild(card);
    });
}

// Filtreleme Dinamikleri
const applyBtn = document.getElementById('applyFilters');

applyBtn.addEventListener('click', () => {
    const loc = document.getElementById('locationFilter').value;
    const cap = document.getElementById('capacityFilter').value;
    const pool = document.getElementById('poolFilter').checked;

    const filtered = villas.filter(v => {
        if (loc !== 'all' && v.location !== loc) return false;
        if (cap !== 'all' && v.capacity < parseInt(cap)) return false;
        if (pool && !v.pool) return false;
        return true;
    });

    renderVillas(filtered);
});

// Otomatik filterlama desteği (dropdown degistiğinde)
document.getElementById('locationFilter').addEventListener('change', () => applyBtn.click());
document.getElementById('capacityFilter').addEventListener('change', () => applyBtn.click());
document.getElementById('poolFilter').addEventListener('change', () => applyBtn.click());

// İlk kurulumda tümünü göster
renderVillas(villas);
