const fs = require('fs');
const files = ['femra.html', 'meshkuj.html', 'produkt.html'];
const newNavCenter = `        <div class="nav-center">
            <div class="nav-search">
                <i>🔍</i>
                <input type="text" placeholder="Kërko marka, artikuj...">
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Ballina</a></li>
                <li><a href="femra.html">Femra</a></li>
                <li><a href="meshkuj.html">Meshkuj</a></li>
            </ul>
        </div>

        <div class="nav-actions">
            <a href="shit.html" class="btn-secondary" style="background: var(--accent); color: white; border: none;">Shit Tani</a>
            <button class="icon-btn" id="cart-icon">🛒<span class="cart-badge">0</span></button>
            <button class="icon-btn" onclick="location.href='profil.html'">👤</button>
        </div>
    </nav>`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<ul class="nav-links">[\s\S]*?<\/nav>/, newNavCenter);
  fs.writeFileSync(f, content);
  console.log('Updated Nav in ' + f);
});
