document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('.filter-chk');
    const products = document.querySelectorAll('#product-grid .product-card');
    const productCount = document.getElementById('product-count');

    function filterProducts() {
        // Get active filters grouped by category
        const activeFilters = {
            type: [],
            size: [],
            condition: []
        };

        checkboxes.forEach(chk => {
            if (chk.checked) {
                // Determine which group this checkbox belongs to
                // We'll infer it from the value for simplicity, or we can look at the parent.
                // Assuming standard values:
                const val = chk.value;
                if (['fustane', 'maica', 'xhaketa', 'pantallona'].includes(val)) {
                    activeFilters.type.push(val);
                } else if (['s', 'm', 'l', 'xl'].includes(val)) {
                    activeFilters.size.push(val);
                } else if (['re', 'pak', 'shume'].includes(val)) {
                    activeFilters.condition.push(val);
                }
            }
        });

        let visibleCount = 0;

        products.forEach(product => {
            const pType = product.getAttribute('data-type');
            const pSize = product.getAttribute('data-size');
            const pCond = product.getAttribute('data-condition');

            let matchType = activeFilters.type.length === 0 || activeFilters.type.includes(pType);
            let matchSize = activeFilters.size.length === 0 || activeFilters.size.includes(pSize);
            let matchCond = activeFilters.condition.length === 0 || activeFilters.condition.includes(pCond);

            if (matchType && matchSize && matchCond) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        productCount.textContent = `Duke shfaqur ${visibleCount} produkte`;
    }

    checkboxes.forEach(chk => {
        chk.addEventListener('change', filterProducts);
    });

    // Make product cards clickable to view details
    products.forEach(product => {
        product.style.cursor = 'pointer';
        product.addEventListener('click', (e) => {
            if(!e.target.closest('.btn-cart')) {
                window.location.href = 'produkt.html';
            }
        });
    });
});
