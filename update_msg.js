const fs = require('fs');
try {
  let prod = fs.readFileSync('product.html', 'utf8');
  prod = prod.replace(/onclick="alert\('Dërgoni mesazh shitësit\.'\)"/g, 'onclick="location.href=\\\'messages.html\\\'"');
  fs.writeFileSync('product.html', prod);
  
  let prof = fs.readFileSync('profile.html', 'utf8');
  prof = prof.replace(/<li><a href="#">Mesazhet \(2\)<\/a><\/li>/g, '<li><a href="messages.html">Mesazhet (2)</a></li>');
  fs.writeFileSync('profile.html', prof);
  console.log('Updated message links');
} catch(e) {}
