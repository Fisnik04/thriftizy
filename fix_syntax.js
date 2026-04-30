const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes("location.href=\\'checkout.html\\'")) {
        content = content.replace(/location\.href=\\'checkout\.html\\'/g, "location.href='checkout.html'");
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed ' + file);
    }
}
