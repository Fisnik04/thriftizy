const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'profil.html', 'shit.html', 'produkt.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/<button class="btn-buy" style="width: 100%;">Paguaj Tani<\/button>/g, '<button class="btn-buy" style="width: 100%;" onclick="location.href=\\\'checkout.html\\\'">Paguaj Tani</button>');
        // Handle profil.html where it has opacity: 0.5
        content = content.replace(/<button class="btn-buy" style="width: 100%; opacity: 0.5; cursor: not-allowed;">Paguaj Tani<\/button>/g, '<button class="btn-buy" style="width: 100%;" onclick="location.href=\\\'checkout.html\\\'">Paguaj Tani</button>');
        fs.writeFileSync(f, content);
        console.log('Updated cart button in ' + f);
    } catch(e) {}
});
