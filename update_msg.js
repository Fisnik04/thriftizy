const fs = require('fs');
try {
  let prod = fs.readFileSync('produkt.html', 'utf8');
  prod = prod.replace(/onclick="alert\('Dërgoni mesazh shitësit\.'\)"/g, 'onclick="location.href=\\\'mesazhet.html\\\'"');
  fs.writeFileSync('produkt.html', prod);
  
  let prof = fs.readFileSync('profil.html', 'utf8');
  prof = prof.replace(/<li><a href="#">Mesazhet \(2\)<\/a><\/li>/g, '<li><a href="mesazhet.html">Mesazhet (2)</a></li>');
  fs.writeFileSync('profil.html', prof);
  console.log('Updated message links');
} catch(e) {}
