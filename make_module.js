const fs = require('fs');
const files = ['index.html', 'women.html', 'men.html', 'profile.html', 'sell.html', 'product.html', 'saved.html', 'checkout.html', 'messages.html'];

files.forEach(f => {
    try {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace('<script src="main.js"></script>', '<script type="module" src="main.js"></script>');
        fs.writeFileSync(f, content);
        console.log('Përditësuar ' + f);
    } catch(e) {
        console.log('Gabim në ' + f + ': ' + e.message);
    }
});
