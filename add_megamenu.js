const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'profil.html', 'shit.html', 'produkt.html'];

const megaMenuHTML = `<li class="nav-item-dropdown">
                <a href="femra.html">Femra</a>
                <div class="mega-menu">
                    <!-- Shop by category -->
                    <div class="mega-column two-col">
                        <div class="mega-title">Shop by category</div>
                        <a href="#" class="mega-link">Tops</a>
                        <a href="#" class="mega-link">Shoes</a>
                        <a href="#" class="mega-link">Jeans</a>
                        <a href="#" class="mega-link">Bags & Purses</a>
                        <a href="#" class="mega-link">Sweaters</a>
                        <a href="#" class="mega-link">Sunglasses</a>
                        <a href="#" class="mega-link">Skirts</a>
                        <a href="#" class="mega-link">Hats</a>
                        <a href="#" class="mega-link">Dresses</a>
                        <a href="#" class="mega-link">Jewelry</a>
                        <a href="#" class="mega-link">Coats & Jackets</a>
                        <a href="#" class="mega-link">Plus Size</a>
                        <a href="femra.html" class="see-all-link">See all women's</a>
                    </div>
                    
                    <!-- Featured -->
                    <div class="mega-column">
                        <div class="mega-title">Featured</div>
                        <a href="#" class="mega-link">Wardrobe essentials</a>
                        <a href="#" class="mega-link">Denim everything</a>
                        <a href="#" class="mega-link">Lifestyle sneakers</a>
                        <a href="#" class="mega-link">Office wear</a>
                        <a href="#" class="mega-link">Gym gear</a>
                    </div>

                    <!-- Images -->
                    <div class="mega-images">
                        <div class="mega-img-card">
                            <img src="assets/clothes.png" alt="80s">
                            <div class="mega-img-label">'80s</div>
                        </div>
                        <div class="mega-img-card">
                            <img src="assets/clothes.png" alt="90s" style="transform: scaleX(-1);">
                            <div class="mega-img-label">'90s</div>
                        </div>
                        <div class="mega-img-card">
                            <img src="assets/accessories.png" alt="00s">
                            <div class="mega-img-label">'00s</div>
                        </div>
                        <div class="mega-img-card">
                            <img src="assets/clothes.png" alt="2010s" style="filter: hue-rotate(90deg);">
                            <div class="mega-img-label">2010s</div>
                        </div>
                    </div>
                </div>
            </li>`;

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        // Replace ONLY the standard Femra link with the dropdown
        content = content.replace(/<li><a href="femra\.html">Femra<\/a><\/li>/g, megaMenuHTML);
        fs.writeFileSync(f, content);
        console.log('Updated ' + f);
    } catch(e) {
        console.log('Error in ' + f + ': ' + e.message);
    }
});
