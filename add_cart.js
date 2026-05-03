const fs = require('fs');
const files = ['women.html', 'men.html', 'product.html'];
const cartHTML = `    <!-- Cart Sidebar Overlay -->
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-sidebar" id="cart-sidebar">
        <div class="cart-header">
            <h2>Shporta Jote</h2>
            <button class="close-cart" id="close-cart">×</button>
        </div>
        <div class="cart-items">
            <!-- Items added here -->
            <p style="text-align: center; color: var(--text-muted); margin-top: 50px;">Shporta është e zbrazët.</p>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Totali:</span>
                <span>0.00€</span>
            </div>
            <button class="btn-buy" style="width: 100%;">Paguaj Tani</button>
        </div>
    </div>
`;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if(!content.includes('id="cart-sidebar"')) {
    content = content.replace(/<script src=".*\.js"><\/script>\s*<\/body>/, match => cartHTML + '\n    ' + match);
    fs.writeFileSync(f, content);
    console.log('Added cart to ' + f);
  }
});
