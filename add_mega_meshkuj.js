const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'profil.html', 'shit.html', 'produkt.html', 'login.html', 'saved.html', 'checkout.html', 'mesazhet.html'];

const megaMenuMeshkujHTML = `<li class="nav-item-dropdown">
                <a href="meshkuj.html">Meshkuj</a>
                <div class="mega-menu">
                    <!-- Shop by category -->
                    <div class="mega-column two-col">
                        <div class="mega-title">Kategoritë për Meshkuj</div>
                        <a href="meshkuj.html" class="mega-link">T-shirts & Maica</a>
                        <a href="meshkuj.html" class="mega-link">Patika / Sneakers</a>
                        <a href="meshkuj.html" class="mega-link">Pantallona / Xhinse</a>
                        <a href="meshkuj.html" class="mega-link">Këmisha</a>
                        <a href="meshkuj.html" class="mega-link">Duksa & Triko</a>
                        <a href="meshkuj.html" class="mega-link">Syze Dielli</a>
                        <a href="meshkuj.html" class="mega-link">Shorts</a>
                        <a href="meshkuj.html" class="mega-link">Kapele</a>
                        <a href="meshkuj.html" class="mega-link">Xhaketa & Pallto</a>
                        <a href="meshkuj.html" class="mega-link">Orë & Aksesorë</a>
                        <a href="meshkuj.html" class="see-all-link">Shiko të gjitha</a>
                    </div>
                    
                    <!-- Featured -->
                    <div class="mega-column">
                        <div class="mega-title">Të Zgjedhura</div>
                        <a href="meshkuj.html" class="mega-link">Streetwear Essentials</a>
                        <a href="meshkuj.html" class="mega-link">Vintage 90s</a>
                        <a href="meshkuj.html" class="mega-link">Gym & Fitness</a>
                        <a href="meshkuj.html" class="mega-link">Kostume Zyrtare</a>
                    </div>

                    <!-- Images -->
                    <div class="mega-images">
                        <div class="mega-img-card" onclick="location.href='meshkuj.html'">
                            <img src="assets/sneakers.png" alt="Sneakers">
                            <div class="mega-img-label">Sneakers</div>
                        </div>
                        <div class="mega-img-card" onclick="location.href='meshkuj.html'">
                            <img src="assets/clothes.png" alt="Streetwear" style="transform: scaleX(-1); filter: grayscale(50%);">
                            <div class="mega-img-label">Streetwear</div>
                        </div>
                        <div class="mega-img-card" onclick="location.href='meshkuj.html'">
                            <img src="assets/accessories.png" alt="Watches" style="filter: sepia(50%);">
                            <div class="mega-img-label">Aksesorë</div>
                        </div>
                        <div class="mega-img-card" onclick="location.href='meshkuj.html'">
                            <img src="assets/clothes.png" alt="Vintage" style="filter: hue-rotate(180deg);">
                            <div class="mega-img-label">Vintage</div>
                        </div>
                    </div>
                </div>
            </li>`;

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        // Replace ONLY the standard Meshkuj link with the dropdown
        content = content.replace(/<li><a href="meshkuj\.html">Meshkuj<\/a><\/li>/g, megaMenuMeshkujHTML);
        fs.writeFileSync(f, content);
        console.log('Updated Meshkuj Mega Menu in ' + f);
    } catch(e) {
        console.log('Error in ' + f + ': ' + e.message);
    }
});
