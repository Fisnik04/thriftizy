const fs = require('fs');
let femra = fs.readFileSync('femra.html', 'utf8');
let saved = femra.replace(/Rrobat për Femra/g, 'Të Ruajturat');
saved = saved.replace(/<h1>👗 Femra<\/h1>/g, '<h1>💖 Të Ruajturat</h1>');
saved = saved.replace(/Zbulo moda të çmuar nga markë premium me çmime të paimagjinueshme/g, 'Produktet që ke pëlqyer. Ruajini këtu për ti blerë më vonë.');

// Update JS Logic for saved.html
// Replace the entire load from firestore block
const oldTryBlock = /try \{\s*const snap = await getDocs[\s\S]*?\} catch\(err\) \{[\s\S]*?\}/;
const newTryBlock = `
    try {
        const savedRaw = localStorage.getItem('thriftizy_likes');
        let rawProducts = savedRaw ? JSON.parse(savedRaw) : [];
        
        // Filter by country globally
        const userCountry = localStorage.getItem('thriftizy_country') || 'all';
        if (userCountry !== 'all') {
            rawProducts = rawProducts.filter(p => p.country === userCountry);
        }
        allProducts = rawProducts;

        countEl.textContent = allProducts.length + ' produkte';

        if (!allProducts.length) {
            grid.innerHTML = \`<div class="empty-state">
                <div style="font-size:3.5rem;margin-bottom:16px;">💖</div>
                <h2>Asnjë produkt i ruajtur</h2>
                <p>Kliko ikonën e zemrës tek produktet për ti ruajtur këtu.</p>
                <a href="index.html" class="btn-buy" style="text-decoration:none;display:inline-block;margin-top:8px;">Zbulo Produkte</a>
            </div>\`;
        } else {
            applyFilters();
        }
    } catch(err) {
        grid.innerHTML = \`<div class="empty-state"><h2>⚠️ Gabim</h2><p>\${err.message}</p></div>\`;
    }
`;

saved = saved.replace(oldTryBlock, newTryBlock);
fs.writeFileSync('saved.html', saved, 'utf8');
