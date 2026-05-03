const fs = require('fs');
let html = fs.readFileSync('product.html', 'utf8');

html = html.replace('<h1>Xhaketë Xhins Vintage 90s</h1>', '<h1 id="prod-title">Xhaketë Xhins Vintage 90s</h1>');
html = html.replace('<div class="price">25.00€</div>', '<div class="price" id="prod-price">25.00€</div>');
html = html.replace(`<span class="attr-value">Levi's</span>`, `<span class="attr-value" id="prod-brand">Levi's</span>`);
html = html.replace('<span class="attr-value">M (Medium)</span>', '<span class="attr-value" id="prod-size">M (Medium)</span>');
html = html.replace('<span class="attr-value">Pak e përdorur</span>', '<span class="attr-value" id="prod-condition">Pak e përdorur</span>');
html = html.replace('<span class="attr-value">Blu e lehtë</span>', '<span class="attr-value" id="prod-color">Blu e lehtë</span>');
html = html.replace('<span class="attr-value">100% Pambuk (Xhins)</span>', '<span class="attr-value" id="prod-material">100% Pambuk (Xhins)</span>');
html = html.replace('<h4>Shitet nga: Fisnik Fazlija</h4>', '<h4 id="prod-seller-name">Shitet nga: Fisnik Fazlija</h4>');
html = html.replace('<div class="seller-avatar">FF</div>', '<div class="seller-avatar" id="prod-seller-avatar">FF</div>');

fs.writeFileSync('product.html', html, 'utf8');
