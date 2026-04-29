const fs = require('fs');
const files = ['index.html', 'femra.html', 'meshkuj.html', 'profil.html'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/<div class="product-img"/g, '<div class="heart-icon">🤍</div>\n                    <div class="product-img"');
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
