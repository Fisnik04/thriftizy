// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Reveal Elements on Scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Initial call to reveal elements on load
document.addEventListener("DOMContentLoaded", () => {
    reveal();
    
    // Add staggered delay to reveal elements in grid
    const categories = document.querySelectorAll('.category-card');
    categories.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });

    const products = document.querySelectorAll('.product-card');
    products.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if(!e.target.closest('.btn-cart')) {
                window.location.href = 'produkt.html';
            }
        });
    });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Country Selection Logic
const countryNames = {
    'ks': 'Kosovë',
    'al': 'Shqipëri',
    'mk': 'Maqedoni'
};

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('country-modal');
    const changeBtn = document.getElementById('btn-change-country');
    const currentCountrySpan = document.getElementById('current-country');
    const countryBtns = document.querySelectorAll('.country-btn');
    
    // Check saved country
    let savedCountry = localStorage.getItem('thriftizy_country');
    
    if (!savedCountry) {
        modal.classList.add('active');
    } else {
        updateUIForCountry(savedCountry);
    }
    
    // Handle country selection
    countryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selected = e.target.closest('.country-btn').getAttribute('data-select');
            localStorage.setItem('thriftizy_country', selected);
            modal.classList.remove('active');
            updateUIForCountry(selected);
        });
    });
    
    // Open modal to change country
    changeBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
    
    function updateUIForCountry(countryCode) {
        // Update Navbar text
        currentCountrySpan.textContent = countryNames[countryCode];
        
        // Filter products
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            if (product.getAttribute('data-country') === countryCode) {
                product.style.display = 'block';
                // Trigger reflow for animation
                setTimeout(() => product.classList.add('active'), 50);
            } else {
                product.style.display = 'none';
                product.classList.remove('active');
            }
        });
    }

    // Make product cards clickable to view details
    const products = document.querySelectorAll('.product-card');
    products.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if(!e.target.closest('.btn-cart') && !e.target.closest('.heart-icon')) {
                window.location.href = 'produkt.html';
            }
        });
    });

    // -----------------------------------------
    // HEART ICON / FAVORITES LOGIC
    // -----------------------------------------
    const heartIcons = document.querySelectorAll('.heart-icon');
    let likedItems = JSON.parse(localStorage.getItem('thriftizy_likes')) || [];

    // Helper: Find index of item by title
    function getLikedIndex(title) {
        return likedItems.findIndex(item => item.title === title);
    }

    // Initialize hearts based on saved state
    document.querySelectorAll('.product-card').forEach(card => {
        const heart = card.querySelector('.heart-icon');
        const titleEl = card.querySelector('h4');
        if (heart && titleEl) {
            const title = titleEl.textContent;
            if (getLikedIndex(title) !== -1) {
                heart.classList.add('liked');
                heart.innerHTML = '❤️';
            }
        }
    });

    heartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('.product-card');
            if(!card) return;

            const title = card.querySelector('h4').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const imgStyle = card.querySelector('.product-img').style.backgroundImage;
            
            const itemIndex = getLikedIndex(title);

            if (itemIndex === -1) {
                // Add to likes
                likedItems.push({ title, price: priceText, image: imgStyle });
                icon.classList.add('liked');
                icon.innerHTML = '❤️';
            } else {
                // Remove from likes
                likedItems.splice(itemIndex, 1);
                icon.classList.remove('liked');
                icon.innerHTML = '🤍';
            }
            
            localStorage.setItem('thriftizy_likes', JSON.stringify(likedItems));
            
            // If we are on the saved items page, remove the card visually
            if (window.location.pathname.includes('saved.html')) {
                card.remove();
                checkIfSavedIsEmpty();
            }
        });
    });

    // Render Saved Items dynamically on saved.html
    function renderSavedItems() {
        if (!window.location.pathname.includes('saved.html')) return;
        
        const shopGrid = document.querySelector('.shop-grid');
        if(!shopGrid) return;

        shopGrid.innerHTML = '';
        
        if (likedItems.length === 0) {
            checkIfSavedIsEmpty();
            return;
        }

        likedItems.forEach(item => {
            const cardHTML = `
                <div class="product-card" style="cursor: pointer;">
                    <div class="heart-icon liked">❤️</div>
                    <div class="product-img" style="background-image: ${item.image}; background-size: cover; background-position: center;">
                        <div class="product-actions">
                            <button class="btn-cart">Shto në shportë</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4>${item.title}</h4>
                        <p class="product-price">${item.price}</p>
                    </div>
                </div>
            `;
            shopGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-attach event listeners for newly rendered cards
        const newHearts = shopGrid.querySelectorAll('.heart-icon');
        newHearts.forEach(h => {
            h.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.product-card');
                const title = card.querySelector('h4').textContent;
                const index = getLikedIndex(title);
                if (index !== -1) {
                    likedItems.splice(index, 1);
                    localStorage.setItem('thriftizy_likes', JSON.stringify(likedItems));
                }
                card.remove();
                checkIfSavedIsEmpty();
            });
        });

        const newCartBtns = shopGrid.querySelectorAll('.btn-cart');
        newCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.product-card');
                const title = card.querySelector('h4').textContent;
                const price = parseFloat(card.querySelector('.product-price').textContent.replace(/[^0-9.]/g, ''));
                const imgStyle = card.querySelector('.product-img').style.backgroundImage;
                cart.push({ title, price, image: imgStyle });
                localStorage.setItem('thriftizy_cart', JSON.stringify(cart));
                updateCartUI();
                toggleCart();
            });
        });

        shopGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if(!e.target.closest('.btn-cart') && !e.target.closest('.heart-icon')) {
                    window.location.href = 'produkt.html';
                }
            });
        });
    }

    function checkIfSavedIsEmpty() {
        const shopGrid = document.querySelector('.shop-grid');
        if (shopGrid && shopGrid.children.length === 0) {
            shopGrid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-muted);">Nuk keni asnjë produkt të ruajtur. Shkoni te dyqani dhe pëlqeni diçka!</p>';
        }
    }

    renderSavedItems();

    // Cart Sidebar Logic
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    
    function toggleCart() {
        if(cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    }

    if(cartIcon) cartIcon.addEventListener('click', toggleCart);
    if(closeCart) closeCart.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // -----------------------------------------
    // REAL SHOPPING CART LOGIC (Local Storage)
    // -----------------------------------------
    const addToCartBtns = document.querySelectorAll('.btn-cart');
    const cartBadge = document.querySelector('.cart-badge');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total span:last-child');
    
    let cart = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];

    function updateCartUI() {
        if (!cartBadge || !cartItemsContainer || !cartTotalElement) return;
        
        cartBadge.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 50px;">Shporta është e zbrazët.<br>Shto disa produkte!</p>';
            cartTotalElement.textContent = '0.00€';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img" style="background-image: ${item.image};"></div>
                    <div class="cart-item-info" style="flex: 1;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 5px;">${item.title}</h4>
                        <p style="color: var(--primary); font-weight: 700;">${item.price.toFixed(2)}€</p>
                        <button class="cart-item-remove" data-index="${index}" style="color: red; font-size: 0.85rem; cursor: pointer; border:none; background:none; padding:0; margin-top:5px; text-decoration:underline;">Largo</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartTotalElement.textContent = total.toFixed(2) + '€';

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.target.getAttribute('data-index');
                cart.splice(itemIndex, 1);
                localStorage.setItem('thriftizy_cart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    // Initialize UI on load
    updateCartUI();

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Find product details from DOM
            const card = e.target.closest('.product-card');
            if (card) {
                const title = card.querySelector('h4').textContent;
                const priceText = card.querySelector('.product-price').textContent;
                // Extract number from price text (e.g. "45.00€" -> 45.00)
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                const imgStyle = card.querySelector('.product-img').style.backgroundImage;

                cart.push({ title, price, image: imgStyle });
                localStorage.setItem('thriftizy_cart', JSON.stringify(cart));
                
                updateCartUI();
                toggleCart(); // Open sidebar to show it was added
            }
        });
    });

    // -----------------------------------------
    // LIVE SEARCH LOGIC
    // -----------------------------------------
    const searchInputs = document.querySelectorAll('.nav-search input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const allProducts = document.querySelectorAll('.product-card');
            
            allProducts.forEach(card => {
                const title = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
                if (title.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
