import {
    db,
    auth,
    doc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    where,
    onAuthStateChanged,
    serverTimestamp,
    firebaseProductImageBackgroundCss,
    firebaseProductImageUrlsForViewer,
    FIREBASE_PRODUCT_IMAGE_MISSING_BG
} from './firebase-config.js';
import { openProductLightbox } from './product-card-ui.js';

/** Fotot për shportë: vetëm nga Firebase URL / img në kartë, jo foto demo `assets/`. */
function cartImageCssFromProductCard(productCard) {
    if (!productCard) return FIREBASE_PRODUCT_IMAGE_MISSING_BG;
    const imgEl =
        productCard.querySelector('img.product-card-photo') ||
        productCard.querySelector('img.product-img');
    if (imgEl && imgEl.getAttribute('src')) {
        const src = imgEl.getAttribute('src').trim();
        if (src && !/\bassets\//i.test(src)) return firebaseProductImageBackgroundCss({ image: src });
    }
    const wrap = productCard.querySelector('.img-wrapper');
    const wBg = (wrap && wrap.style && wrap.style.backgroundImage) || '';
    if (wBg && /\bassets\//i.test(wBg)) return FIREBASE_PRODUCT_IMAGE_MISSING_BG;
    if (wBg && (String(wBg).startsWith('url(') || wBg.includes('linear-gradient'))) return wBg;

    const ph = productCard.querySelector('.product-img');
    if (ph && ph !== imgEl) {
        const dBg = ph.style.backgroundImage || '';
        if (dBg && /\bassets\//i.test(dBg)) return FIREBASE_PRODUCT_IMAGE_MISSING_BG;
        if (dBg && String(dBg).startsWith('url(')) return dBg;
    }
    return FIREBASE_PRODUCT_IMAGE_MISSING_BG;
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let menuToggle = document.getElementById('home-menu-toggle');
    const navCenter = navbar.querySelector('.nav-center');

    if (!menuToggle && navCenter) {
        menuToggle = document.createElement('button');
        menuToggle.type = 'button';
        menuToggle.className = 'home-menu-toggle';
        menuToggle.id = 'home-menu-toggle';
        menuToggle.setAttribute('aria-controls', navCenter.querySelector('.nav-links')?.id || 'mobile-nav-drawer-links');
        navbar.insertBefore(menuToggle, navCenter);
    }

    if (!menuToggle) return;

    const setMobileMenuState = (open) => {
        document.body.classList.toggle('home-nav-drawer-open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', open ? 'Mbyll menynë' : 'Hap menynë');
        menuToggle.textContent = open ? '×' : '☰';
    };

    setMobileMenuState(false);

    menuToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        setMobileMenuState(!document.body.classList.contains('home-nav-drawer-open'));
    }, true);

    navbar.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => setMobileMenuState(false), true);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setMobileMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMobileMenuState(false);
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 900 || !document.body.classList.contains('home-nav-drawer-open')) return;
        if (!navbar.contains(event.target)) setMobileMenuState(false);
    });
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

    // Staggered categories
    document.querySelectorAll('.category-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Handle product card clicks (global delegate)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;

        // Ignore if clicking internal buttons
        if (e.target.closest('.btn-cart') || e.target.closest('.heart-icon') || e.target.closest('.product-actions')) {
            return;
        }

        const id = card.getAttribute('data-id');
        if (id) {
            window.location.href = `produkt.html?id=${encodeURIComponent(id)}`;
        }
    });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = this.getAttribute('href');
        if (!target || target === '#') return;
        e.preventDefault();
        document.querySelector(target)?.scrollIntoView({
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
        if (modal) modal.classList.add('active');
    } else {
        updateUIForCountry(savedCountry);
    }

    // Handle country selection
    if (countryBtns) {
        countryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = e.target.closest('.country-btn').getAttribute('data-select');
                localStorage.setItem('thriftizy_country', selected);
                if (modal) modal.classList.remove('active');
                updateUIForCountry(selected);

                // Reload to apply country filter on dynamic pages
                location.reload();
            });
        });
    }

    // Open modal to change country
    if (changeBtn && modal) {
        changeBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });
    }

    function updateUIForCountry(countryCode) {
        // Update Navbar text
        if (currentCountrySpan) currentCountrySpan.textContent = countryNames[countryCode] || 'Shteti';

        // Filter products
        const products = document.querySelectorAll('.product-card[data-country]');
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
            if (!card) return;

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
        if (!shopGrid) return;

        shopGrid.innerHTML = '';

        if (likedItems.length === 0) {
            checkIfSavedIsEmpty();
            return;
        }

        likedItems.forEach(item => {
            const thumbBg = firebaseProductImageBackgroundCss(item);
            const cardHTML = `
                <div class="product-card" style="cursor: pointer;">
                    <div class="heart-icon liked">❤️</div>
                    <div class="product-img" style="background-image: ${thumbBg}; background-size: cover; background-position: center;">
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

        // Note: Event listeners for .btn-cart are now handled globally via delegation below


        shopGrid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-cart') && !e.target.closest('.heart-icon')) {
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
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    }

    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // -----------------------------------------
    // REAL SHOPPING CART LOGIC (Local Storage)
    // -----------------------------------------
    const addToCartBtns = document.querySelectorAll('.btn-cart');
    const cartBadges = document.querySelectorAll('.cart-badge');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total span:last-child');

    let cart = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];

    function escapeCartText(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
    }

    function updateCartUI() {
        cart = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];
        if (!cartBadges.length || !cartItemsContainer || !cartTotalElement) return;

        cartBadges.forEach(b => { b.textContent = cart.length; });

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 50px;">Shporta është e zbrazët.<br>Shto disa produkte!</p>';
            cartTotalElement.textContent = '0.00€';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const linePrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
            total += linePrice;
            const listed = typeof item.listedPrice === 'number' ? item.listedPrice : parseFloat(item.listedPrice);
            const offerExtra = item.isOffer
                ? `<p style="font-size:0.78rem;color:#64748b;margin:4px 0 0;line-height:1.35;">Ofertë${Number.isFinite(listed) ? `: ${listed.toFixed(2)}€ → ${linePrice.toFixed(2)}€` : `: ${linePrice.toFixed(2)}€`}</p>${item.offerNote ? `<p style="font-size:0.74rem;color:#94a3b8;margin-top:4px;line-height:1.35;">"${escapeCartText(item.offerNote)}"</p>` : ''}`
                : '';
            const cartBg = item.image && String(item.image).trim()
                ? String(item.image).trim().startsWith('url(') || String(item.image).trim().startsWith('linear-gradient')
                    ? item.image
                    : `url('${String(item.image).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}')`
                : FIREBASE_PRODUCT_IMAGE_MISSING_BG;
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img" style="background-image: ${cartBg}; background-size: cover; background-position: center;"></div>
                    <div class="cart-item-info" style="flex: 1;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 5px;">${item.isOffer ? '<span style="font-size:0.7rem;color:#92400e;font-weight:800;text-transform:uppercase;">OFERTË • </span>' : ''}${escapeCartText(item.title)}</h4>
                        <p style="color: var(--primary); font-weight: 700;">${linePrice.toFixed(2)}€</p>
                        ${offerExtra}
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
    window.thriftizy_refreshCartUi = updateCartUI;
    window.thriftizy_openCartSidebar = () => {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
        }
    };

    // Consolidated Cart Click Handler (Event Delegation)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-cart');
        if (!btn) return;

        e.stopPropagation();
        e.preventDefault();

        const card = btn.closest('.product-card');
        if (card) {
            const title = card.querySelector('h4').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const id = card.getAttribute('data-id') || '';
            const sellerId = card.getAttribute('data-seller-id') || '';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

            // Always get fresh cart from localStorage to avoid sync issues
            let currentCart = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];
            currentCart.push({ id, sellerId, title, price, image: cartImageCssFromProductCard(card) });
            localStorage.setItem('thriftizy_cart', JSON.stringify(currentCart));

            updateCartUI();

            // Open sidebar to show it was added
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.add('open');
                cartOverlay.classList.add('open');
            }
        }
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

    // -----------------------------------------
    // SELLER LOGIC (Upload Item to Profile)
    // -----------------------------------------
    const sellForm = document.getElementById('sell-form');
    const imageUpload = document.getElementById('sell-image-upload');
    const uploadBox = document.getElementById('upload-box');
    const sellPhotoStrip = document.getElementById('sell-photo-strip');
    const sellPhotoHint = document.getElementById('sell-photo-hint');
    /** Deri në 3 data URL që ruhen dhe në `sessionStorage`/listë lokale për produkt */
    let sellUploadedDataUrls = [];

    function syncSellUploadUi() {
        if (!uploadBox) return;
        const preview = firebaseProductImageBackgroundCss(
            sellUploadedDataUrls.length ? { image: sellUploadedDataUrls[0] } : {}
        );
        uploadBox.style.backgroundImage = preview;
        uploadBox.style.backgroundSize = 'cover';
        uploadBox.style.backgroundPosition = 'center';
        const iconEl = document.getElementById('upload-icon');
        const textEl = document.getElementById('upload-text');
        if (sellUploadedDataUrls.length) {
            if (iconEl) iconEl.style.display = 'none';
            if (textEl) {
                textEl.style.color = 'white';
                textEl.style.textShadow = '0 2px 4px rgba(0,0,0,0.8)';
                textEl.textContent =
                    sellUploadedDataUrls.length +
                    ' foto — kliko për të zgjedhur përsëri (max. 3)';
            }
        } else {
            if (iconEl) iconEl.style.display = '';
            if (textEl) {
                textEl.style.color = '';
                textEl.style.textShadow = '';
                textEl.textContent = 'Kliko për të zgjedhur foto (deri në 3 përnjëherë).';
            }
        }
        if (sellPhotoStrip) {
            sellPhotoStrip.innerHTML = sellUploadedDataUrls
                .map(
                    (src) =>
                        `<span style="width:76px;height:76px;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,#e2e8f0);flex-shrink:0;">
                            <img src="${String(src).replace(/"/g, '&quot;')}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"></span>`
                )
                .join('');
        }
        if (sellPhotoHint) {
            sellPhotoHint.textContent =
                sellUploadedDataUrls.length >= 3
                    ? 'Keni më shumën e lejuar (3 foto).'
                    : 'Mund të shtoni ende ' +
                    (3 - sellUploadedDataUrls.length) +
                    ' foto (ose zgjidhni përsëri për të ndryshuar).';
        }
    }

    if (imageUpload && uploadBox) {
        uploadBox.style.backgroundImage = FIREBASE_PRODUCT_IMAGE_MISSING_BG;
        syncSellUploadUi();
        imageUpload.addEventListener('change', function () {
            const files = Array.from(this.files || []).filter((f) => f.type.startsWith('image/')).slice(0, 3);
            this.value = '';
            if (!files.length) return;
            let remaining = files.length;
            const next = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    next.push(reader.result);
                    remaining -= 1;
                    if (remaining !== 0) return;
                    sellUploadedDataUrls = next.slice(0, 3);
                    syncSellUploadUi();
                });
                reader.readAsDataURL(file);
            });
        });
    }

    let myItems = JSON.parse(localStorage.getItem('thriftizy_my_items')) || [];

    if (sellForm) {
        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!sellUploadedDataUrls.length) {
                alert('Ngarkoni të paktën një foto (deri në 3).');
                return;
            }
            const title = document.getElementById('sell-title').value;
            const price = parseFloat(document.getElementById('sell-price').value).toFixed(2);

            myItems.push({
                title,
                price: price + '€',
                images: [...sellUploadedDataUrls].slice(0, 3)
            });
            localStorage.setItem('thriftizy_my_items', JSON.stringify(myItems));

            alert('Artikulli u postua me sukses!');
            window.location.href = 'profil.html';
        });
    }

    // Render "Dollapi Im" dynamically on profil.html
    function renderMyItems() {
        if (!window.location.pathname.includes('profil.html')) return;

        const shopGrid = document.querySelector('.profile-content .shop-grid');
        if (!shopGrid) return;
        if (shopGrid.dataset.source === 'firebase') return;

        document.querySelectorAll('.dynamic-my-item').forEach(el => el.remove());

        myItems.forEach((item, index) => {
            const cardHTML = `
                <div class="product-card dynamic-my-item" style="cursor: pointer;" onclick="location.href='produkt.html?myitem=${index}'">
                    <span class="badge badge-sale" style="background: var(--primary);">E Re (Nga ju)</span>
                    <div class="product-img" style="background-image: ${firebaseProductImageBackgroundCss(item)}; background-size: cover; background-position: center;">
                        <div class="product-actions">
                            <button class="btn-cart" style="background: red;" onclick="event.stopPropagation(); removeMyItem(${index})">Fshi</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4>${item.title}</h4>
                        <p class="product-price">${item.price}</p>
                    </div>
                </div>
            `;
            shopGrid.insertAdjacentHTML('afterbegin', cardHTML);
        });
    }

    // Make removeMyItem globally accessible
    window.removeMyItem = function (index) {
        let myItems = JSON.parse(localStorage.getItem('thriftizy_my_items')) || [];
        myItems.splice(index, 1);
        localStorage.setItem('thriftizy_my_items', JSON.stringify(myItems));
        renderMyItems();
    };

    renderMyItems();

    // -----------------------------------------
    // CHECKOUT LOGIC
    // -----------------------------------------
    function initCheckout() {
        if (!window.location.pathname.includes('checkout.html')) return;

        let cartItems = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];
        const subtotalLabel = document.getElementById('checkout-subtotal-label');
        const subtotalPrice = document.getElementById('checkout-subtotal-price');
        const totalPrice = document.getElementById('checkout-total-price');
        const confirmBtn = document.getElementById('btn-confirm-checkout');

        if (subtotalLabel && subtotalPrice && totalPrice) {
            let sub = 0;
            cartItems.forEach(item => sub += item.price);

            subtotalLabel.textContent = `Nëntotali (${cartItems.length} artikuj)`;
            subtotalPrice.textContent = sub.toFixed(2) + '€';

            let finalPrice = sub + 2.00 - 5.00; // + Shipping - Discount
            if (finalPrice < 0) finalPrice = 0;
            totalPrice.textContent = finalPrice.toFixed(2) + '€';
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                if (cartItems.length === 0) {
                    alert('Shporta është e zbrazët! Kthehuni në dyqan për të shtuar produkte.');
                    return;
                }

                confirmBtn.disabled = true;
                const previousText = confirmBtn.textContent;
                confirmBtn.textContent = 'Duke konfirmuar...';
                try {
                    const user = auth.currentUser;
                    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
                    const total = Math.max(0, subtotal + 2 - 5);

                    const shippingInfo = {
                        firstName: document.getElementById('ship-name')?.value || '',
                        lastName: document.getElementById('ship-surname')?.value || '',
                        address: document.getElementById('ship-address')?.value || '',
                        city: document.getElementById('ship-city')?.value || '',
                        country: document.getElementById('ship-country')?.value || '',
                        phone: document.getElementById('ship-phone')?.value || ''
                    };

                    if (!shippingInfo.firstName || !shippingInfo.address || !shippingInfo.phone) {
                        alert('Ju lutem plotësoni të gjitha fushat e detyrueshme të dërgesës.');
                        confirmBtn.disabled = false;
                        confirmBtn.textContent = previousText;
                        return;
                    }

                    // Create the main order record
                    const orderRef = await addDoc(collection(db, 'porosite'), {
                        buyerId: user?.uid || null,
                        buyerEmail: user?.email || null,
                        items: cartItems.map(item => ({
                            id: item.id || '',
                            sellerId: item.sellerId || '',
                            title: item.title || 'Produkti',
                            price: item.price || 0,
                            image: item.image || ''
                        })),
                        shippingInfo,
                        subtotal,
                        shipping: 2,
                        discount: 5,
                        totalAmount: total,
                        paymentMethod: 'Cash on Delivery',
                        status: 'new',
                        createdAt: serverTimestamp()
                    });

                    // Create individual sale records for each seller
                    const salesPromises = cartItems.map(item => {
                        const sId = item.sellerId || null;
                        if (sId) {
                            return addDoc(collection(db, 'shitjet'), {
                                orderId: orderRef.id,
                                sellerId: sId,
                                buyerId: user?.uid || null,
                                buyerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                                buyerPhone: shippingInfo.phone,
                                buyerAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`,
                                item: {
                                    id: item.id || '',
                                    title: item.title || 'Produkti',
                                    price: item.price || 0,
                                    image: item.image || ''
                                },
                                status: 'new',
                                createdAt: serverTimestamp()
                            });
                        }
                        return Promise.resolve();
                    });

                    await Promise.all(salesPromises);

                    alert('Porosia u konfirmua me sukses!');
                    localStorage.removeItem('thriftizy_cart');
                    window.location.href = 'index.html'; // Redirect to home so they can see if they sold something too? Or just success.
                } catch (error) {
                    console.error('Gabim gjatë ruajtjes së porosisë:', error);
                    alert('Porosia nuk u ruajt: ' + error.message);
                } finally {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = previousText;
                }
            });
        }
    }

    initCheckout();

    // -----------------------------------------
    // DYNAMIC PRODUCT PAGE (produkt.html)
    // -----------------------------------------
    async function initDynamicProduct() {
        if (!window.location.pathname.includes('produkt.html')) return;

        let item = null;

        // Check for URL params (my items / Firestore product)
        const urlParams = new URLSearchParams(window.location.search);
        const myItemIndex = urlParams.get('myitem');
        const firestoreId = urlParams.get('id');
        if (myItemIndex !== null && myItems[myItemIndex]) {
            item = myItems[myItemIndex];
        } else if (firestoreId) {
            try {
                const docSnap = await getDoc(doc(db, 'produktet', firestoreId));
                if (docSnap.exists()) {
                    item = { id: docSnap.id, ...docSnap.data() };
                    sessionStorage.setItem('current_product', JSON.stringify(item));
                }
            } catch (error) {
                console.error('Nuk u ngarkua produkti nga Firebase:', error);
            }
        }

        if (!item) {
            // Check for Firebase product in sessionStorage
            const sessionProd = sessionStorage.getItem('current_product');
            if (sessionProd) {
                try { item = JSON.parse(sessionProd); } catch (e) { }
            }
        }

        if (item) {
            // Update Title
            const titleEl = document.getElementById('prod-title') || document.querySelector('.product-details h1');
            if (titleEl) titleEl.textContent = item.title;

            // Update Price
            const priceEl = document.getElementById('prod-price') || document.querySelector('.detail-price');
            if (priceEl) {
                // If price is a number, format it
                const p = parseFloat(item.price);
                if (!isNaN(p)) {
                    priceEl.textContent = p.toFixed(2) + '€';
                } else {
                    priceEl.textContent = item.price;
                }
            }

            const viewerUrls = firebaseProductImageUrlsForViewer(item);

            function bgCssFromHref(href) {
                if (!href) return '';
                const safe = String(href).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `url('${safe}')`;
            }

            let galIdx = 0;

            function showGalleryIndex(i) {
                galIdx =
                    viewerUrls.length > 0
                        ? Math.max(0, Math.min(Number(i) || 0, viewerUrls.length - 1))
                        : 0;

                const mainImgElInner = document.getElementById('mainImage');
                const thumbListEl = document.getElementById('prod-thumbnails');

                if (mainImgElInner) {
                    if (viewerUrls.length) {
                        mainImgElInner.style.backgroundImage =
                            bgCssFromHref(viewerUrls[galIdx]) || firebaseProductImageBackgroundCss(item);
                    } else if (item.image && String(item.image).startsWith('url(')) {
                        mainImgElInner.style.backgroundImage = item.image;
                    } else if (item.image) {
                        const fb = bgCssFromHref(item.image);
                        mainImgElInner.style.backgroundImage =
                            fb || firebaseProductImageBackgroundCss(item);
                    } else {
                        mainImgElInner.style.backgroundImage = firebaseProductImageBackgroundCss(item);
                    }

                    mainImgElInner.style.cursor = viewerUrls.length ? 'zoom-in' : '';
                }

                if (thumbListEl) {
                    [...thumbListEl.querySelectorAll('.thumb')].forEach((tb, ti) =>
                        tb.classList.toggle('active', viewerUrls.length > 1 && ti === galIdx));
                }
            }

            const mainImgEl = document.getElementById('mainImage');
            const thumbList = document.getElementById('prod-thumbnails');

            if (thumbList) {
                if (viewerUrls.length > 1) {
                    thumbList.innerHTML = viewerUrls
                        .map(
                            (u, j) =>
                                `<button type="button" class="thumb${j === 0 ? ' active' : ''}" aria-label="Foto ${j + 1}"
                                    style="background-image:${bgCssFromHref(u)};background-size:cover;background-position:center;border:none;"></button>`
                        )
                        .join('');
                } else {
                    thumbList.innerHTML = '';
                }

                thumbList.onclick = function (event) {
                    const btn = event.target.closest('.thumb');
                    if (!btn || !thumbList.contains(btn)) return;
                    const j = [...thumbList.children].indexOf(btn);
                    if (j < 0) return;
                    showGalleryIndex(j);
                };
            }

            showGalleryIndex(0);

            if (mainImgEl) {
                mainImgEl.onclick = null;
                if (viewerUrls.length) {
                    mainImgEl.onclick = () => openProductLightbox(viewerUrls, galIdx);
                }
            }

            const dash = '—';
            function setProdAttr(attrId, value) {
                const el = document.getElementById(attrId);
                if (!el) return;
                const t = value == null ? '' : String(value).trim();
                el.textContent = t !== '' ? t : dash;
            }
            const genderLabels = { femra: 'Femra', meshkuj: 'Meshkuj', unisex: 'Unisex' };
            const countryLabels = { ks: 'Kosovë', al: 'Shqipëri', mk: 'Maqedoni' };

            function displayCountry(value) {
                const labels = { ks: 'Kosovë', al: 'Shqipëri', mk: 'Maqedoni' };
                const code = thriftizyNormalizeCountry(value);
                return labels[code] || value || '';
            }
            function displayLocation(city, country) {
                const parts = [];
                const cityText = city == null ? '' : String(city).trim();
                const countryText = displayCountry(country);
                if (cityText) parts.push(cityText);
                if (countryText) parts.push(countryText);
                return parts.join(', ');
            }

            setProdAttr('prod-brand', item.brand);
            setProdAttr('prod-size', item.size);
            setProdAttr('prod-condition', item.condition);
            setProdAttr('prod-color', item.color);
            setProdAttr('prod-material', item.material);
            setProdAttr('prod-category', item.category || item.type || item.subcategory);
            const g = item.gender;
            setProdAttr('prod-gender', genderLabels[g] || g);
            const c = item.country;
            setProdAttr('prod-country', c !== undefined && c !== null && String(c).trim() !== ''
                ? displayCountry(c)
                : '');
            setProdAttr('prod-city', item.city);
            setProdAttr('prod-id', item.id || '');

            const descEl = document.getElementById('prod-desc');
            if (descEl) {
                descEl.textContent = (item.description && String(item.description).trim())
                    ? item.description.trim()
                    : 'Nuk ka përshkrim të shtuar për këtë artikull.';
            }

            if (item.title) document.title = String(item.title) + ' | Thriftizy';

            // Update Seller Details
            const sellerId = item.sellerId || item.uid || '';
            let sellerName = item.sellerName || item.seller || (item.sellerEmail ? String(item.sellerEmail).split('@')[0] : '');
            let sellerLocation = displayLocation(item.city, item.country);
            if (sellerId) {
                try {
                    const sellerSnap = await getDoc(doc(db, 'users', sellerId));
                    if (sellerSnap.exists()) {
                        const sellerData = sellerSnap.data();
                        sellerName = sellerData.fullName || sellerData.displayName || sellerData.email || sellerName;
                        sellerLocation = displayLocation(sellerData.city || item.city, sellerData.country || item.country) || sellerLocation;
                    }
                } catch (error) {
                    console.error('Nuk u ngarkua shitësi nga Firebase:', error);
                }
            }
            if (!sellerName) sellerName = 'Shitës';
            if (document.getElementById('prod-seller-name')) {
                document.getElementById('prod-seller-name').textContent = 'Shitet nga: ' + sellerName;
            }
            if (document.getElementById('prod-seller-avatar')) {
                document.getElementById('prod-seller-avatar').textContent = sellerName.charAt(0).toUpperCase();
            }
            if (document.getElementById('prod-seller-location')) {
                document.getElementById('prod-seller-location').textContent = '📍 Lokacioni: ' + (sellerLocation || 'Nuk është vendosur');
            }

            const sellerProfileCard = document.getElementById('seller-profile-card');
            const sellerLink = document.getElementById('prod-seller-link');
            if (sellerProfileCard && sellerId) {
                const sellerUrl = `shitesi.html?id=${encodeURIComponent(sellerId)}&name=${encodeURIComponent(sellerName)}`;
                sellerProfileCard.onclick = () => { window.location.href = sellerUrl; };
                if (sellerLink) {
                    sellerLink.href = sellerUrl;
                    sellerLink.onclick = (event) => {
                        event.stopPropagation();
                    };
                }
            } else if (sellerLink) {
                sellerLink.style.display = 'none';
            }

            // Hide actions if the item belongs to the current user
            onAuthStateChanged(auth, (user) => {
                const isMyItem = (urlParams.get('myitem') !== null);
                if (isMyItem || (user && sellerId && user.uid === sellerId)) {
                    const actionContainer = document.querySelector('.product-actions-main');
                    if (actionContainer) {
                        actionContainer.innerHTML = `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 16px; text-align: center; margin-bottom: 20px;">
                                <p style="margin: 0; font-weight: 700; color: #1e293b; font-size: 1rem;">Ky është artikulli juaj</p>
                                <p style="margin: 4px 0 12px; font-size: 0.85rem; color: #64748b;">Nuk mund të blesh ose të dërgosh oferta për produktet tuaja.</p>
                                <a href="profil.html" style="display: inline-block; padding: 10px 20px; background: var(--primary); color: white; border-radius: 10px; font-weight: 600; text-decoration: none; font-size: 0.88rem;">Shko te dollapi</a>
                            </div>
                        `;
                    }
                }
            });

            function productCartImage() {
                return firebaseProductImageBackgroundCss(item);
            }

            function addLineToCart(line) {
                const raw = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];
                const nextId = line?.id || line?.productId;
                if (nextId && raw.some((item) => String(item?.id || item?.productId) === String(nextId))) {
                    window.thriftizy_refreshCartUi?.();
                    window.thriftizy_openCartSidebar?.();
                    return false;
                }
                raw.push(line);
                localStorage.setItem('thriftizy_cart', JSON.stringify(raw));
                window.thriftizy_refreshCartUi?.();
                window.thriftizy_openCartSidebar?.();
                return true;
            }

            const listedNum = parseFloat(item.price);

            document.getElementById('prod-add-cart')?.addEventListener('click', () => {
                addLineToCart({
                    id: item.id || '',
                    title: item.title || 'Artikull',
                    price: Number.isFinite(listedNum) ? listedNum : 0,
                    listedPrice: Number.isFinite(listedNum) ? listedNum : undefined,
                    image: productCartImage(),
                    productId: item.id || '',
                    sellerId: item.sellerId || item.uid || ''
                });
            });

            document.getElementById('prod-open-messages')?.addEventListener('click', () => {
                window.location.href = 'mesazhet.html';
            });

            const offerOverlay = document.getElementById('offer-modal-overlay');
            const offerHint = document.getElementById('offer-listed-hint');
            const offerInput = document.getElementById('offer-price-input');
            const offerNote = document.getElementById('offer-note-input');

            document.getElementById('prod-open-offer')?.addEventListener('click', () => {
                if (!offerOverlay) return;
                if (offerHint) {
                    offerHint.textContent = Number.isFinite(listedNum)
                        ? `Çmimi i listuar: ${listedNum.toFixed(2)}€`
                        : 'Shkruaj çmimin që ofron.';
                }
                if (offerInput) {
                    offerInput.value = '';
                    if (Number.isFinite(listedNum)) {
                        offerInput.placeholder = 'p.sh. ' + Math.max(0, Math.round(listedNum * 0.9 * 100) / 100).toFixed(2);
                    }
                }
                if (offerNote) offerNote.value = '';
                offerOverlay.classList.add('open');
                offerOverlay.setAttribute('aria-hidden', 'false');
                offerInput?.focus();
            });

            document.getElementById('offer-modal-cancel')?.addEventListener('click', () => {
                offerOverlay?.classList.remove('open');
                offerOverlay?.setAttribute('aria-hidden', 'true');
            });

            offerOverlay?.addEventListener('click', (e) => {
                if (e.target === offerOverlay) {
                    offerOverlay.classList.remove('open');
                    offerOverlay.setAttribute('aria-hidden', 'true');
                }
            });

            document.querySelector('.offer-modal')?.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            async function resolveCurrentUserName(user) {
                let buyerName = user.email?.split('@')[0] || 'Blerës';
                try {
                    const buyerSnap = await getDoc(doc(db, 'users', user.uid));
                    if (buyerSnap.exists()) {
                        const buyerData = buyerSnap.data();
                        buyerName = buyerData.fullName || buyerData.displayName || buyerData.email || buyerName;
                    }
                } catch (_) { }
                return buyerName;
            }

            async function findOrCreateOfferConversation(user) {
                const convQuery = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
                const convSnap = await getDocs(convQuery);
                const existing = convSnap.docs.find((d) => {
                    const data = d.data();
                    return (data.participants || []).includes(sellerId);
                });

                const buyerName = await resolveCurrentUserName(user);
                const productTitle = item.title || 'Artikull';
                const productImage = productCartImage();
                const cleanSellerName = sellerName && sellerName !== 'Shitës' ? sellerName : '';
                const participantNames = {
                    [user.uid]: buyerName
                };
                if (cleanSellerName) participantNames[sellerId] = cleanSellerName;

                if (existing) {
                    await updateDoc(doc(db, 'conversations', existing.id), {
                        participantNames: {
                            ...(existing.data().participantNames || {}),
                            ...participantNames
                        },
                        productId: item.id || '',
                        productTitle,
                        productImage,
                        lastAt: serverTimestamp()
                    });
                    return existing.id;
                }

                const created = await addDoc(collection(db, 'conversations'), {
                    participants: [user.uid, sellerId],
                    participantNames: {
                        ...participantNames,
                        [sellerId]: cleanSellerName || 'Shitës'
                    },
                    productId: item.id || '',
                    productTitle,
                    productImage,
                    lastMessage: 'Ofertë e re',
                    lastAt: serverTimestamp(),
                    createdAt: serverTimestamp()
                });
                return created.id;
            }

            async function sendOfferToSeller(offerPrice, note) {
                const user = auth.currentUser;
                if (!user) {
                    window.location.href = 'login.html?redirect=' + encodeURIComponent('produkt.html' + window.location.search);
                    return;
                }
                if (!sellerId) {
                    alert('Ky produkt nuk ka shitës të lidhur.');
                    return;
                }
                if (sellerId === user.uid) {
                    alert('Nuk mund të bësh ofertë për produktin tënd.');
                    return;
                }

                const listedText = Number.isFinite(listedNum) ? `${listedNum.toFixed(2)}€` : 'pa çmim të listuar';
                const noteText = note ? `\nShënim: ${note}` : '';
                const messageText = `Ofertë për "${item.title || 'Artikull'}": ${offerPrice.toFixed(2)}€ (çmimi i listuar: ${listedText}).${noteText}`;

                const convId = await findOrCreateOfferConversation(user);
                await addDoc(collection(db, 'conversations', convId, 'messages'), {
                    text: messageText,
                    senderId: user.uid,
                    type: 'offer',
                    offerPrice,
                    listedPrice: Number.isFinite(listedNum) ? listedNum : null,
                    productId: item.id || '',
                    productTitle: item.title || 'Artikull',
                    createdAt: serverTimestamp()
                });
                await updateDoc(doc(db, 'conversations', convId), {
                    lastMessage: messageText,
                    lastAt: serverTimestamp()
                });

                window.location.href = `mesazhet.html#${convId}`;
            }

            document.getElementById('offer-modal-submit')?.addEventListener('click', async () => {
                const val = parseFloat(offerInput?.value || '');
                if (!Number.isFinite(val) || val <= 0) {
                    alert('Fut një çmim të vlefshëm për ofertën (€).');
                    return;
                }
                if (Number.isFinite(listedNum) && val > listedNum + 0.009) {
                    alert('Çmimi i ofertës zakonisht duhet të jetë më i ulët ose i njëjtë me çmimin e listuar.');
                    return;
                }
                const submitBtn = document.getElementById('offer-modal-submit');
                const previousText = submitBtn?.textContent || 'Dërgo ofertën';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Duke dërguar...';
                }
                try {
                    await sendOfferToSeller(val, (offerNote?.value || '').trim());
                    offerOverlay?.classList.remove('open');
                    offerOverlay?.setAttribute('aria-hidden', 'true');
                } catch (error) {
                    console.error('Oferta nuk u dërgua:', error);
                    alert('Oferta nuk u dërgua: ' + error.message);
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = previousText;
                    }
                }
            });
        }
    }

    initDynamicProduct();

});

function thriftizyNormalizeCountry(value) {
    const v = String(value || '').trim().toLowerCase();
    if (['all', 'te gjitha', 'të gjitha'].includes(v)) return 'all';
    if (['ks', 'kosovë', 'kosove', 'kosova'].includes(v)) return 'ks';
    if (['al', 'shqipëri', 'shqiperi', 'albania'].includes(v)) return 'al';
    if (['mk', 'maqedoni', 'maqedonia', 'north macedonia'].includes(v)) return 'mk';
    return v;
}

document.addEventListener('DOMContentLoaded', () => {
    const changeBtn = document.getElementById('btn-change-country');
    const currentCountrySpan = document.getElementById('current-country');
    if (!changeBtn) return;

    const countryLabels = {
        all: 'Të gjitha',
        ks: 'Kosovë',
        al: 'Shqipëri',
        mk: 'Maqedoni'
    };

    let modal = document.getElementById('country-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'country-modal';
        modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="country-modal-title">
                <h2 id="country-modal-title">Zgjidh shtetin</h2>
                <p>Shfaq produktet sipas lokacionit që të intereson.</p>
                <div class="country-options">
                    <button type="button" class="country-btn" data-select="all">🌍 Të gjitha</button>
                    <button type="button" class="country-btn" data-select="ks">🇽🇰 Kosovë</button>
                    <button type="button" class="country-btn" data-select="al">🇦🇱 Shqipëri</button>
                    <button type="button" class="country-btn" data-select="mk">🇲🇰 Maqedoni</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
    }

    function applyCountry(code) {
        const normalized = thriftizyNormalizeCountry(code || 'all') || 'all';
        localStorage.setItem('thriftizy_country', normalized);
        if (currentCountrySpan) currentCountrySpan.textContent = countryLabels[normalized] || 'Shteti';
        document.querySelectorAll('.country-top-btn span').forEach((el) => {
            el.textContent = countryLabels[normalized] || 'Shteti';
        });
    }

    applyCountry(localStorage.getItem('thriftizy_country') || 'all');

    const navActions = document.getElementById('nav-actions');
    let quickCountryBtn = document.querySelector('.country-top-btn');
    // REMOVED dynamic injection to avoid duplicates as it is already in nav-links


    [changeBtn, quickCountryBtn].filter(Boolean).forEach((btn) => btn.addEventListener('click', (event) => {
        event.preventDefault();
        modal.classList.add('active');
    }));

    modal.querySelectorAll('.country-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            applyCountry(btn.dataset.select);
            modal.classList.remove('active');
            location.reload();
        });
    });

    // -----------------------------------------
    // SELLER NOTIFICATIONS LOGIC
    // -----------------------------------------
    async function checkSellerSales(userId) {
        const container = document.getElementById('seller-notifications-container');
        if (!container) return;

        try {
            const q = query(collection(db, 'shitjet'), where('sellerId', '==', userId), where('status', '==', 'new'));
            const snap = await getDocs(q);

            if (snap.empty) {
                container.innerHTML = '';
                return;
            }

            let html = `
                <section style="max-width: 1200px; margin: 22px auto 0; padding: 0 20px;">
                    <div style="background: linear-gradient(135deg, #ecfdf5, #eff6ff); border-radius: 22px; padding: 20px; border: 1px solid rgba(16, 185, 129, 0.25); box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:16px;">
                            <div>
                                <p style="margin:0 0 4px;color:#0f766e;font-size:.78rem;font-weight:900;text-transform:uppercase;">Njoftime për shitësin</p>
                                <h3 style="margin:0;color:#0f172a;font-size:1.25rem;">Ke ${snap.size} porosi të re${snap.size === 1 ? '' : 'ja'}</h3>
                            </div>
                            <a href="profil.html" style="text-decoration:none;background:#0f172a;color:white;border-radius:999px;padding:10px 14px;font-weight:900;font-size:.82rem;white-space:nowrap;">Hap profilin</a>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
            `;

            snap.docs.forEach(docSnap => {
                const sale = docSnap.data();
                html += `
                    <article style="background:white;border:1px solid rgba(15,23,42,.08);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:12px;">
                        <div style="display:flex;gap:12px;align-items:center;">
                            <div style="width:58px;height:58px;border-radius:12px;background-image:${sale.item.image};background-size:cover;background-position:center;background-color:#e2e8f0;flex:0 0 auto;"></div>
                            <div style="min-width:0;">
                                <h4 style="font-size:.95rem;margin:0 0 2px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sale.item.title}</h4>
                                <p style="font-size:.82rem;margin:0;color:#64748b;">${sale.buyerName || 'Blerës'} • ${sale.buyerPhone || 'pa telefon'}</p>
                                <strong style="display:block;margin-top:4px;color:#10b981;">${parseFloat(sale.item.price || 0).toFixed(2)}€</strong>
                            </div>
                        </div>
                        <div style="background:#f8fafc;border-radius:12px;padding:10px;color:#64748b;font-size:.8rem;line-height:1.35;">
                            <b style="color:#0f172a;">Adresa:</b> ${sale.buyerAddress || '-'}
                        </div>
                        <button onclick="confirmSale('${docSnap.id}')" style="background:#10b981;color:white;border:none;padding:10px 12px;border-radius:12px;font-weight:900;cursor:pointer;font-family:inherit;">Marko si të dërguar</button>
                    </article>
                `;
            });

            html += `
                        </div>
                    </div>
                </section>
            `;
            container.innerHTML = html;
        } catch (err) {
            console.error("Error fetching seller sales:", err);
        }
    }

    window.confirmSale = async (saleId) => {
        if (!confirm("A e keni nisur dërgesën për këtë porosi? Produkti do të shënohet si i shitur.")) return;
        try {
            const saleSnap = await getDoc(doc(db, 'shitjet', saleId));
            if (saleSnap.exists()) {
                const saleData = saleSnap.data();
                const productId = saleData.item.id;

                // Update sale status
                await updateDoc(doc(db, 'shitjet', saleId), { status: 'completed', completedAt: new Date() });

                // Update product status to sold
                if (productId) {
                    await updateDoc(doc(db, 'produktet', productId), { status: 'sold' });
                }

                location.reload();
            }
        } catch (err) {
            alert("Gabim gjatë përditësimit: " + err.message);
        }
    };

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            checkSellerSales(user.uid);
        }
    });


});
