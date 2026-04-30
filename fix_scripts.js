const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const f of files) {
    let html = fs.readFileSync(f, 'utf8');
    if (html.includes('<script src="main.js"></script>')) {
        html = html.replace('<script src="main.js"></script>', '<script type="module" src="main.js"></script>');
        fs.writeFileSync(f, html, 'utf8');
        console.log('Fixed main.js script tag in ' + f);
    }
}
