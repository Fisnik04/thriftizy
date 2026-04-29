const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'produkt.html', 'profil.html', 'saved.html', 'shit.html'];

const footerHTML = `    <!-- Global Footer -->
    <footer class="site-footer">
        <div class="footer-grid">
            <div class="footer-col">
                <a href="index.html" class="logo" style="color: white;">THRIFT<span>IZY</span></a>
                <p style="color: #94a3b8; margin-top: 15px; font-size: 0.9rem;">Platforma më e madhe e rrobave të përdorura në Ballkan. Bli, shit, dhe mbro mjedisin.</p>
            </div>
            <div class="footer-col">
                <h3>Blerja</h3>
                <ul>
                    <li><a href="femra.html">Femra</a></li>
                    <li><a href="meshkuj.html">Meshkuj</a></li>
                    <li><a href="#">Këpucë</a></li>
                    <li><a href="#">Aksesorë</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Shitja</h3>
                <ul>
                    <li><a href="shit.html">Shit një artikull</a></li>
                    <li><a href="#">Si të shesësh?</a></li>
                    <li><a href="#">Rregullat e shitjes</a></li>
                    <li><a href="#">Tarifat</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Suporti</h3>
                <ul>
                    <li><a href="#">Pyetjet e shpeshta (FAQ)</a></li>
                    <li><a href="#">Dërgesat & Kthimet</a></li>
                    <li><a href="#">Kontakt</a></li>
                    <li><a href="#">Rreth Nesh</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; 2026 Thriftizy. Të gjitha të drejtat e rezervuara.
        </div>
    </footer>

`;

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        if(!content.includes('class="site-footer"')) {
            if(content.includes('<!-- Cart Sidebar Overlay -->')) {
                content = content.replace('<!-- Cart Sidebar Overlay -->', footerHTML + '<!-- Cart Sidebar Overlay -->');
            } else {
                content = content.replace(/<script src="main.js"><\/script>/, footerHTML + '<script src="main.js"></script>');
            }
            fs.writeFileSync(f, content);
            console.log('Added footer to ' + f);
        }
    } catch(e) {}
});
