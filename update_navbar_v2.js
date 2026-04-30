const fs = require('fs');

const newNavLinks = `            <ul class="nav-links">
                <li><a href="index.html">Ballina</a></li>
                <li><a href="femra.html">Femra</a></li>
                <li><a href="meshkuj.html">Meshkuj</a></li>
                <li><a href="kepuce.html">Këpucë</a></li>
                <li><a href="aksesore.html">Aksesorë</a></li>
                <li><a href="shit.html">Posto</a></li>
                <li><a href="profil.html">Profili</a></li>
                <li class="nav-country"><a href="#" id="btn-change-country">📍 <span id="current-country">Kosovë</span></a></li>
            </ul>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the ul with nav-links
    const startTag = '<ul class="nav-links">';
    const endTag = '</ul>';
    
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        const fullEndIndex = endIndex + endTag.length;
        const newContent = content.substring(0, startIndex) + newNavLinks + content.substring(fullEndIndex);
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated navbar in ${file}`);
    }
}
