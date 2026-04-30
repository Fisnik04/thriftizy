const fs = require('fs');
let femra = fs.readFileSync('femra.html', 'utf8');

// kepuce.html
let kepuce = femra.replace(/Rrobat për Femra/g, 'Këpucë');
kepuce = kepuce.replace(/<h1>👗 Femra<\/h1>/g, '<h1>👟 Këpucë</h1>');
kepuce = kepuce.replace(/where\('gender', 'in', \['femra', 'unisex'\]\)/g, `where('category', '==', 'kepuce')`);
kepuce = kepuce.replace(/👗/g, '👟');
fs.writeFileSync('kepuce.html', kepuce, 'utf8');

// aksesore.html
let aksesore = femra.replace(/Rrobat për Femra/g, 'Aksesorë');
aksesore = aksesore.replace(/<h1>👗 Femra<\/h1>/g, '<h1>💍 Aksesorë</h1>');
aksesore = aksesore.replace(/where\('gender', 'in', \['femra', 'unisex'\]\)/g, `where('category', '==', 'aksesore')`);
aksesore = aksesore.replace(/👗/g, '💍');
fs.writeFileSync('aksesore.html', aksesore, 'utf8');

// search.html
let search = femra.replace(/Rrobat për Femra/g, 'Kërkimi');
search = search.replace(/<h1>👗 Femra<\/h1>/g, '<h1 id="search-heading">🔍 Kërkimi</h1>');
search = search.replace(/Zbulo moda të çmuar nga markë premium me çmime të paimagjinueshme/g, 'Kërko produktin tënd të preferuar nga e gjithë platforma.');
search = search.replace(/where\('gender', 'in', \['femra', 'unisex'\]\)/g, ''); // no where clause, get all!
search = search.replace(/const snap = await getDocs\(query\(collection\(db, 'produktet'\), \)\);/g, `const snap = await getDocs(query(collection(db, 'produktet')));`);
search = search.replace(/const snap = await getDocs\(query\(collection\(db, 'produktet'\)\)\);/g, `const snap = await getDocs(collection(db, 'produktet'));`);
search = search.replace(/👗/g, '📦');
// search page needs to read the query param from URL
search = search.replace('let allProducts = [];', `let allProducts = [];\n    const urlParams = new URLSearchParams(window.location.search);\n    const initialQuery = urlParams.get('q') || '';\n    if (initialQuery) {\n        document.getElementById('search-input').value = initialQuery;\n    }`);
fs.writeFileSync('search.html', search, 'utf8');
