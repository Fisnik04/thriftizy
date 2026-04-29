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

    // Add to cart dummy logic
    const addToCartBtns = document.querySelectorAll('.btn-cart');
    const cartBadge = document.querySelector('.cart-badge');
    let cartCount = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartCount++;
            if(cartBadge) cartBadge.textContent = cartCount;
            toggleCart();
        });
    });
});
