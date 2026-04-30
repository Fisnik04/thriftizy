const fs = require('fs');

// 1. shitesi.html
let shitesi = fs.readFileSync('shitesi.html', 'utf8');
shitesi = shitesi.replace(/orderBy\('createdAt', 'desc'\)/g, '');
shitesi = shitesi.replace(/onclick="alert\([^)]+\)"/g, 'onclick="startChat()"');
// add startChat to shitesi
if (!shitesi.includes('window.startChat = async () =>')) {
    shitesi = shitesi.replace('</body>', `
    <script>
    window.startChat = async () => {
        const { auth, db, collection, addDoc, getDocs, query, where } = await import('./firebase-config.js');
        const user = auth.currentUser;
        if (!user) { window.location.href = 'login.html'; return; }
        const btn = document.getElementById('btn-contact');
        btn.textContent = '⏳ Duke hapur...';
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const sellerId = urlParams.get('id');
            const sellerName = urlParams.get('name') || 'Shitës';
            if (sellerId === user.uid) { alert('Ky është profili yt!'); return; }
            const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
            const snap = await getDocs(q);
            const existing = snap.docs.find(d => (d.data().participants || []).includes(sellerId));
            let convId;
            if (existing) {
                convId = existing.id;
            } else {
                const newConv = await addDoc(collection(db, 'conversations'), {
                    participants: [user.uid, sellerId],
                    participantNames: {
                        [user.uid]: user.email?.split('@')[0] || 'Blerës',
                        [sellerId]: sellerName
                    },
                    productId: '',
                    productTitle: 'Nga profili',
                    lastMessage: 'Filloi bisedën',
                    lastAt: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                });
                convId = newConv.id;
            }
            window.location.href = 'mesazhet.html#' + convId;
        } catch(err) {
            alert('Gabim: ' + err.message);
            btn.textContent = '💬 Dërgo Mesazh';
        }
    };
    </script>
    </body>`);
}
shitesi = shitesi.replace('let products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));', 'let products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })); products.sort((a, b) => (b.createdAt || "") > (a.createdAt || "") ? 1 : -1);');
shitesi = shitesi.replace('grid.innerHTML = snap.docs.map(doc => {', 'let products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })); products.sort((a,b)=>(b.createdAt||0)>(a.createdAt||0)?1:-1); grid.innerHTML = products.map(p => {');
shitesi = shitesi.replace('const p = { id: doc.id, ...doc.data() };', '');
shitesi = shitesi.replace(/<div class="product-card" onclick="openProduct\('\$\{(encodeURIComponent\(JSON\.stringify\(p\)\))\}'\)">/g, `<div class="product-card" onclick="openProduct('\${encodeURIComponent(JSON.stringify(p))}')">`);
fs.writeFileSync('shitesi.html', shitesi, 'utf8');

// 2. shit.html
let shit = fs.readFileSync('shit.html', 'utf8');
if (!shit.includes('sell-country')) {
    shit = shit.replace('<div class="form-group">\r\n                    <label>Përshkrimi</label>', '<div class="form-row">\n<div class="form-group"><label>Shteti *</label><select id="sell-country" required><option value="" disabled selected>Zgjidh shtetin</option><option value="Kosovë">Kosovë</option><option value="Shqipëri">Shqipëri</option><option value="Maqedoni">Maqedoni</option></select></div>\n<div class="form-group"><label>Qyteti / Adresa *</label><input type="text" id="sell-city" placeholder="P.sh. Prishtinë" required></div>\n</div>\n<div class="form-group">\n<label>Përshkrimi</label>');
    shit = shit.replace(`const form = document.getElementById('sell-form');
        if (form) {
            // Remove the main.js submit listener by cloning the form
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);`, `const form = document.getElementById('sell-form');
        let newForm = form;`);
    shit = shit.replace('    if (editItem) {', '    if (editItem) {\n        const form = document.getElementById(\'sell-form\');\n        let newForm = form;\n        if (form) {\n            newForm = form.cloneNode(true);\n            form.parentNode.replaceChild(newForm, form);\n        }');
    shit = shit.replace('set(\'sell-desc\',      editItem.desc);', 'set(\'sell-desc\',      editItem.desc);\n        set(\'sell-country\',   editItem.country);\n        set(\'sell-city\',      editItem.city);');
    shit = shit.replace('desc:      get(\'sell-desc\'),', 'desc:      get(\'sell-desc\'),\n                    country:   get(\'sell-country\'),\n                    city:      get(\'sell-city\'),');
}
fs.writeFileSync('shit.html', shit, 'utf8');

// 3. index.html
let idx = fs.readFileSync('index.html', 'utf8');
if (!idx.includes('userCountry')) {
    idx = idx.replace('const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));', 'let all = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n  const userCountry = localStorage.getItem(\'thriftizy_country\') || \'all\';\n  if (userCountry !== \'all\') all = all.filter(p => p.country === userCountry);');
}
fs.writeFileSync('index.html', idx, 'utf8');

// 4. femra.html
let femra = fs.readFileSync('femra.html', 'utf8');
if (!femra.includes('userCountry')) {
    femra = femra.replace('allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));', 'let rawProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n        const userCountry = localStorage.getItem(\'thriftizy_country\') || \'all\';\n        if (userCountry !== \'all\') rawProducts = rawProducts.filter(p => p.country === userCountry);\n        allProducts = rawProducts;');
}
fs.writeFileSync('femra.html', femra, 'utf8');

// 5. meshkuj.html
let meshkuj = fs.readFileSync('meshkuj.html', 'utf8');
if (!meshkuj.includes('userCountry')) {
    meshkuj = meshkuj.replace('allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));', 'let rawProducts = snap.docs.map(d => ({ id: d.id, ...d.data() }));\n        const userCountry = localStorage.getItem(\'thriftizy_country\') || \'all\';\n        if (userCountry !== \'all\') rawProducts = rawProducts.filter(p => p.country === userCountry);\n        allProducts = rawProducts;');
}
fs.writeFileSync('meshkuj.html', meshkuj, 'utf8');

// 6. produkt.html
let produkt = fs.readFileSync('produkt.html', 'utf8');
if (!produkt.includes('p-location')) {
    produkt = produkt.replace('<div class="attr-value">🇽🇰 Kosovë</div>', '<div class="attr-value" id="p-location">—</div>');
    produkt = produkt.replace('if (materialEl) materialEl.textContent = material;', 'if (materialEl) materialEl.textContent = material;\n\n    let locStr = \'—\';\n    if (p.country && p.city) {\n        let flag = \'🌍\';\n        if (p.country === \'Kosovë\') flag = \'🇽🇰\';\n        if (p.country === \'Shqipëri\') flag = \'🇦🇱\';\n        if (p.country === \'Maqedoni\') flag = \'🇲🇰\';\n        locStr = `${flag} ${p.country}, ${p.city}`;\n    } else if (p.country) {\n        locStr = p.country;\n    }\n    const locationEl = document.getElementById(\'p-location\');\n    if (locationEl) locationEl.textContent = locStr;');
}
fs.writeFileSync('produkt.html', produkt, 'utf8');

// 7. Update Navlinks
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/<li><a href="meshkuj\.html"[^>]*>Meshkuj<\/a><\/li>(\s*<li><a href="kepuce\.html">Këpucë<\/a><\/li>\s*<li><a href="aksesore\.html">Aksesorë<\/a><\/li>)?/g, '<li><a href="meshkuj.html">Meshkuj</a></li>\n                <li><a href="kepuce.html">Këpucë</a></li>\n                <li><a href="aksesore.html">Aksesorë</a></li>');
    fs.writeFileSync(f, content, 'utf8');
}
