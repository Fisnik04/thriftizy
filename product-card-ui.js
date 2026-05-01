import {
  firebaseProductImageUrlsForViewer,
  normalizeProductImageUrlForImg
} from './firebase-config.js';

function escAttr(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function parseGallery(mediaEl) {
  try {
    const raw = mediaEl.dataset.gallery || '%5B%5D';
    const decoded = decodeURIComponent(raw);
    const arr = JSON.parse(decoded);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((u) => (typeof u === 'string' ? normalizeProductImageUrlForImg(u) : ''))
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** HTML brenda `.img-wrapper`: foto + dots + zoom. `extraHtml` zemra/badge etj. */
export function renderProductMediaInner(product, extraHtml = '') {
  const urls = firebaseProductImageUrlsForViewer(product);
  const alt = escAttr(product?.title ?? '');
  let imgDotsZoom = '';

  if (urls.length === 1) {
    imgDotsZoom =
      `<img class="product-img product-card-photo" src="${escAttr(urls[0])}" alt="${alt}" loading="lazy" draggable="false" />`;
  } else if (urls.length > 1) {
    const dots = urls
      .map(
        (_, i) =>
          `<button type="button" class="photo-dot${i === 0 ? ' active' : ''}" tabindex="0" data-idx="${i}" aria-label="Foto ${i + 1}"></button>`
      )
      .join('');
    imgDotsZoom = urls
      .map((u, i) => {
        const hiddenCls = i === 0 ? '' : ' card-slide-hidden';
        return `<img class="product-img product-card-photo tz-card-slide${hiddenCls}" src="${escAttr(u)}" alt="${i === 0 ? alt : ''}" loading="${i === 0 ? 'eager' : 'lazy'}" draggable="false" data-slide="${i}" />`;
      })
      .join('');
    imgDotsZoom += `<div class="card-photo-dots">${dots}</div>`;
  }

  if (urls.length) {
    imgDotsZoom +=
      `<button type="button" class="card-zoom-btn" aria-label="Zmadho foto">🔎</button>`;
  }

  return `${imgDotsZoom}${extraHtml}`;
}

export function galleryDataAttr(product) {
  return encodeURIComponent(JSON.stringify(firebaseProductImageUrlsForViewer(product)));
}

/** Hap përmbajtjen e përbashkët të lightbox-it (lista URL + indeksi fillestar). */
let lbRefs = null;

function mountLightbox() {
  const wrap = document.createElement('div');
  wrap.className = 'tz-product-lightbox';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-label', 'Pamje e foto');
  wrap.innerHTML =
    `<button type="button" class="tz-lb-close" aria-label="Mbyll">×</button>
     <button type="button" class="tz-lb-prev" aria-label="Foto më parë">‹</button>
     <div class="tz-lb-stage"><img class="tz-lb-img" alt="" decoding="async"/></div>
     <button type="button" class="tz-lb-next" aria-label="Foto pasardhëse">›</button>
     <div class="tz-lb-counter" aria-live="polite"></div>`;
  document.body.appendChild(wrap);

  const img = wrap.querySelector('.tz-lb-img');
  const counter = wrap.querySelector('.tz-lb-counter');
  let urls = [];
  let idx = 0;
  let onKey = null;

  function refresh() {
    if (!urls.length) return;
    idx = Math.max(0, Math.min(idx, urls.length - 1));
    img.src = urls[idx];
    img.alt = `Foto ${idx + 1} nga ${urls.length}`;
    counter.textContent = urls.length > 1 ? `${idx + 1} / ${urls.length}` : '';
    wrap.querySelector('.tz-lb-prev').style.visibility = urls.length > 1 ? '' : 'hidden';
    wrap.querySelector('.tz-lb-next').style.visibility = urls.length > 1 ? '' : 'hidden';
  }

  function open(u, startIdx) {
    urls = [...u];
    idx = Math.max(0, Math.min(Number(startIdx) || 0, urls.length - 1));
    document.body.style.overflow = 'hidden';
    wrap.classList.add('open');
    refresh();
    onKey = (e) => {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') { idx = Math.max(0, idx - 1); refresh(); }
      if (e.key === 'ArrowRight') { idx = Math.min(urls.length - 1, idx + 1); refresh(); }
    };
    document.addEventListener('keydown', onKey);
  }

  function closeLb() {
    wrap.classList.remove('open');
    urls = [];
    img.removeAttribute('src');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    onKey = null;
  }

  wrap.querySelector('.tz-lb-close').addEventListener('click', closeLb);
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap) closeLb();
  });
  wrap.querySelector('.tz-lb-prev').addEventListener('click', (ev) => {
    ev.stopPropagation();
    idx = Math.max(0, idx - 1);
    refresh();
  });
  wrap.querySelector('.tz-lb-next').addEventListener('click', (ev) => {
    ev.stopPropagation();
    idx = Math.min(urls.length - 1, idx + 1);
    refresh();
  });

  lbRefs = { wrap, open, closeLb, refreshStage: refresh };
}

export function openProductLightbox(urlList, startIndex = 0) {
  const u = Array.isArray(urlList) ? urlList.filter(Boolean).slice(0, 10) : [];
  if (!u.length) return;
  if (!lbRefs) mountLightbox();
  lbRefs.open(u, startIndex);
}

/** Lidh dots, zoom dhe rrëshqitjen në një grid/listë pas renderimit. */
export function bindProductCardGalleries(root) {
  if (!root?.querySelectorAll) return;

  root.querySelectorAll('.product-card-media:not([data-tz-gallery])').forEach((media) => {
    media.setAttribute('data-tz-gallery', '1');

    let idx = 0;

    function slides() {
      return [...media.querySelectorAll('.product-card-photo.tz-card-slide, .tz-card-slide')];
    }

    /** Për foto të vetme pa klasë rrëshqitjeje */
    function allPhotos() {
      return [...media.querySelectorAll('.product-card-photo')];
    }

    /** @param {number} next */
    function showSlide(next) {
      const s = slides();
      if (!s.length) return;
      idx = Math.max(0, Math.min(Number(next), s.length - 1));
      s.forEach((imgEl, i) => {
        if (i === idx) imgEl.classList.remove('card-slide-hidden');
        else imgEl.classList.add('card-slide-hidden');
      });
      media.querySelectorAll('.photo-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    const zoomBtn = media.querySelector('.card-zoom-btn');
    const urlsParsed = parseGallery(media);

    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let listSrc = urlsParsed.length ? urlsParsed : slides().map((s) => s.src);
        if (!listSrc.length) listSrc = allPhotos().map((s) => s.src);
        if (!listSrc.filter(Boolean).length) return;
        const showIdx =
          urlsParsed.length > 1 || slides().length > 1
            ? Math.min(idx, listSrc.length - 1)
            : 0;
        openProductLightbox(listSrc, showIdx);
      });
    }

    media.querySelectorAll('.photo-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const i = parseInt(dot.dataset.idx, 10);
        showSlide(Number.isFinite(i) ? i : 0);
      });
    });

    /** Rrëshqitje për ndërrim të shpejtë fotosh në kartë */
    let tx = null;
    media.addEventListener(
      'touchstart',
      (e) => {
        if (slides().length < 2) return;
        tx = e.touches[0]?.clientX ?? null;
      },
      { passive: true }
    );
    media.addEventListener(
      'touchend',
      (e) => {
        if (tx == null || slides().length < 2) return;
        const dx = e.changedTouches[0].clientX - tx;
        tx = null;
        if (dx > 48) showSlide(idx - 1);
        else if (dx < -48) showSlide(idx + 1);
      },
      { passive: true }
    );

    if (slides().length >= 2) showSlide(0);
  });
}
