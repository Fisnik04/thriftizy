const fs = require('fs');

const cleanNav = `    <nav id="navbar">
        <a href="index.html" class="logo">THRIFT<span>IZY</span></a>
        <div class="nav-center">
            <div class="nav-search"><i>🔍</i><input type="text" placeholder="Kërko marka, artikuj..."></div>
            <ul class="nav-links">
                <li><a href="index.html">Ballina</a></li>
                <li><a href="women.html">Femra</a></li>
                <li><a href="men.html">Meshkuj</a></li>
                <li><a href="shoes.html">Këpucë</a></li>
                <li><a href="accessories.html">Aksesorë</a></li>
            </ul>
        </div>
        <div class="nav-actions" id="nav-actions"></div>
    </nav>`;

const cleanFooter = `    <footer class="site-footer">
        <div class="footer-grid">
            <div class="footer-col">
                <a href="index.html" class="logo" style="color:white;">THRIFT<span>IZY</span></a>
                <p style="color:#94a3b8;margin-top:14px;font-size:.88rem;">Platforma më e madhe e rrobave të përdorura në Ballkan. Bli, shit, dhe mbro mjedisin.</p>
            </div>
            <div class="footer-col">
                <h3>Blerja</h3>
                <ul>
                    <li><a href="women.html">Femra</a></li>
                    <li><a href="men.html">Meshkuj</a></li>
                    <li><a href="shoes.html">Këpucë</a></li>
                    <li><a href="accessories.html">Aksesorë</a></li>
                    <li><a href="saved.html">Të Ruajtura</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Shitja</h3>
                <ul>
                    <li><a href="sell.html">Shit një artikull</a></li>
                    <li><a href="profile.html">Profili Im</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Llogaria</h3>
                <ul>
                    <li><a href="login.html">Kyçu</a></li>
                    <li><a href="signup.html">Regjistrohu</a></li>
                    <li><a href="messages.html">Mesazhet</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">© 2026 Thriftizy. Të gjitha të drejtat e rezervuara.</div>
    </footer>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace Nav
    const navStart = content.indexOf('<nav');
    const navEnd = content.indexOf('</nav>') + 6;
    if (navStart !== -1 && navEnd !== -1) {
        content = content.substring(0, navStart) + cleanNav + content.substring(navEnd);
    }
    
    // Replace Footer
    const footStart = content.indexOf('<footer');
    const footEnd = content.indexOf('</footer>') + 9;
    if (footStart !== -1 && footEnd !== -1) {
        content = content.substring(0, footStart) + cleanFooter + content.substring(footEnd);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed nav/footer in ' + file);
}
