const fs = require('fs');
let chk = fs.readFileSync('checkout.html', 'utf8');

chk = chk.replace('<input type="text" placeholder="Emri juaj">', '<input type="text" id="chk-emri" placeholder="Emri juaj">');
chk = chk.replace('<input type="text" placeholder="Mbiemri juaj">', '<input type="text" id="chk-mbiemri" placeholder="Mbiemri juaj">');
chk = chk.replace('<input type="text" placeholder="Rruga, Lagjja">', '<input type="text" id="chk-adresa" placeholder="Rruga, Lagjja">');
chk = chk.replace('<input type="text" placeholder="Qyteti">', '<input type="text" id="chk-qyteti" placeholder="Qyteti">');

chk = chk.replace('<script type="module" src="main.js"></script>', `<script type="module" src="main.js"></script>
    <script type="module">
        import { auth, db, collection, addDoc } from './firebase-config.js';
        
        const cart = JSON.parse(localStorage.getItem('thriftizy_cart')) || [];
        const btnConfirm = document.getElementById('btn-confirm-checkout');
        
        if (cart.length === 0) {
            document.querySelector('.checkout-container').innerHTML = '<div style="text-align:center; padding: 100px 20px; width: 100%;"><h2 style="font-size: 2rem; margin-bottom: 20px;">Shporta juaj është e zbrazët</h2><a href="index.html" class="btn-primary">Kthehu te Produktet</a></div>';
        } else {
            let subtotal = 0;
            cart.forEach(item => subtotal += parseFloat(item.price));
            const delivery = 2.00;
            const discount = 5.00;
            const total = subtotal + delivery - discount;
            
            document.getElementById('checkout-subtotal-label').textContent = \`Nëntotali (\${cart.length} artikuj)\`;
            document.getElementById('checkout-subtotal-price').textContent = subtotal.toFixed(2) + '€';
            document.getElementById('checkout-total-price').textContent = total.toFixed(2) + '€';
        }

        btnConfirm?.addEventListener('click', async () => {
            const user = auth.currentUser;
            if (!user) {
                alert('Ju lutem kyçuni për të përfunduar porosinë!');
                window.location.href = 'login.html';
                return;
            }

            const emri = document.getElementById('chk-emri')?.value;
            const mbiemri = document.getElementById('chk-mbiemri')?.value;
            const adresa = document.getElementById('chk-adresa')?.value;
            const qyteti = document.getElementById('chk-qyteti')?.value;

            if (!emri || !mbiemri || !adresa || !qyteti) {
                alert('Ju lutem plotësoni të gjitha të dhënat e dërgesës!');
                return;
            }

            btnConfirm.disabled = true;
            btnConfirm.textContent = '⏳ Duke procesuar...';

            try {
                // Create order in Firestore
                await addDoc(collection(db, 'porosite'), {
                    userId: user.uid,
                    buyerEmail: user.email,
                    items: cart,
                    shippingInfo: { emri, mbiemri, adresa, qyteti },
                    totalAmount: parseFloat(document.getElementById('checkout-total-price').textContent),
                    status: 'Në pritje',
                    createdAt: new Date().toISOString()
                });

                // Clear cart
                localStorage.removeItem('thriftizy_cart');
                
                document.querySelector('.checkout-container').innerHTML = \`
                    <div style="text-align:center; padding: 100px 20px; width: 100%; grid-column: 1/-1;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
                        <h2 style="font-size: 2.5rem; margin-bottom: 10px; color: var(--primary);">Porosia u krye me sukses!</h2>
                        <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 30px;">Faleminderit për blerjen në Thriftizy. Shitësi është njoftuar.</p>
                        <a href="index.html" class="btn-primary" style="text-decoration: none;">Kthehu në Ballinë</a>
                    </div>
                \`;
            } catch (err) {
                alert('Ndodhi një gabim: ' + err.message);
                btnConfirm.disabled = false;
                btnConfirm.textContent = 'Konfirmo Porosinë';
            }
        });
    </script>`);

fs.writeFileSync('checkout.html', chk, 'utf8');
