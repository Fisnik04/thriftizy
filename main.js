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

    // Heart Icon Logic
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.classList.toggle('liked');
            if(icon.classList.contains('liked')) {
                icon.innerHTML = '❤️';
            } else {
                icon.innerHTML = '🤍';
            }
        });
    });

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
