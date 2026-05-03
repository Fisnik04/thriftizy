        function normalizeCountryCode(value) {
            const v = String(value || '').trim().toLowerCase();
            if (['all', 'te gjitha', 'të gjitha'].includes(v)) return 'all';
            if (['ks', 'kosovë', 'kosove', 'kosova'].includes(v)) return 'ks';
            if (['al', 'shqipëri', 'shqiperi', 'albania'].includes(v)) return 'al';
            if (['mk', 'maqedoni', 'maqedonia', 'north macedonia'].includes(v)) return 'mk';
            return v;
        }

        function card(p) {
            const imgBg = firebaseProductImageBackgroundCss(p);
            const isSold = p.status === 'sold';
            const pStr = encodeURIComponent(JSON.stringify(p));
            
            // Badge logic
            let badgeHtml = '';
            if (isSold) {
                badgeHtml = `<span class="tz3-badge tz3-badge-sold">I shitur</span>`;
            } else {
                const cond = p.condition || 'E re';
                if (cond === 'E re me etiketë' || cond === 'E re pa etiketë') {
                    badgeHtml = `<span class="tz3-badge tz3-badge-new">E re</span>`;
                } else {
                    badgeHtml = `<span class="tz3-badge tz3-badge-used">Pak e përdorur</span>`;
                }
            }

            // Seller Info - Robust Fallback
            let sName = p.sellerName || p.displayName || p.seller || 'Shitës';
            if (sName === 'Shitës' && p.sellerEmail) {
                sName = p.sellerEmail.split('@')[0];
            }
            const sInitial = sName.charAt(0).toUpperCase();

            // Meta Pills
            const pills = [
                p.size ? `<span class="tz3-pill">${String(p.size).toUpperCase()}</span>` : '',
                p.color ? `<span class="tz3-pill">${p.color}</span>` : '',
                p.material ? `<span class="tz3-pill">${p.material}</span>` : ''
            ].filter(Boolean).join('');

            return `
            <div class="tz3-card ${isSold ? 'tz3-sold-card' : ''}" onclick="go('${pStr}')">
                <div class="tz3-img-wrap">
                    <div class="firebase-prod-img-slot product-card-media" data-gallery="${galleryDataAttr(p)}" style="background-image:${imgBg};background-size:cover;background-position:center;height:100%;">
                        ${renderProductMediaInner(p, '')}
                    </div>
                    ${badgeHtml}
                    ${isSold ? `
                    <div class="tz3-sold-overlay">
                        <span class="tz3-sold-tag">I Shitur</span>
                    </div>` : `
                    <button class="tz3-heart" onclick="event.stopPropagation();heart(this,'${pStr}')">🤍</button>
                    <div class="tz3-overlay">
                        <button class="tz3-btn-cart" onclick="event.stopPropagation();addCart('${pStr}')">+ Shportë</button>
                        <button class="tz3-btn-save">↗</button>
                    </div>`}
                </div>
                <div class="tz3-body">
                    <div class="tz3-brand-row">
                        <div class="tz3-brand">${p.brand || 'No Brand'}</div>
                        <div class="tz3-seller">
                            <span class="tz3-avatar">${sInitial}</span>
                            ${sName}
                        </div>
                    </div>
                    <p class="tz3-title">${p.title}</p>
                    <div class="tz3-meta">${pills}</div>
                    <div class="tz3-footer">
                        <span class="tz3-price">${parseFloat(p.price).toFixed(2)}€</span>
                    </div>
                </div>
            </div>`;
        }
