const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'profil.html', 'shit.html', 'produkt.html', 'login.html', 'saved.html', 'checkout.html', 'mesazhet.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        // Find the start of the footer
        const footerStart = content.indexOf('<footer class="site-footer">');
        if (footerStart !== -1) {
            let beforeFooter = content.substring(0, footerStart);
            let footerContent = content.substring(footerStart);
            
            // Replace the mega menu back to a normal link inside the footer
            footerContent = footerContent.replace(/<li class="nav-item-dropdown">[\s\S]*?<a href="meshkuj\.html">Meshkuj<\/a>[\s\S]*?<\/div>\s*<\/li>/, '<li><a href="meshkuj.html">Meshkuj</a></li>');
            
            fs.writeFileSync(f, beforeFooter + footerContent);
            console.log('Fixed footer in ' + f);
        }
    } catch(e) {
        console.log('Error in ' + f + ': ' + e.message);
    }
});
