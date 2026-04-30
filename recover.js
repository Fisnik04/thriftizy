const fs = require('fs');

function extractFile(logPath, fileName) {
    if (!fs.existsSync(logPath)) return;
    const log = fs.readFileSync(logPath, 'utf8');
    const lines = log.split('\n');
    let content = null;
    
    // Find view_file output for this file
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`"File Path": "file:///c:/Users/fisni/OneDrive/Desktop/AD/${fileName}"`) || 
            lines[i].includes(`File Path: \`file:///c:/Users/fisni/OneDrive/Desktop/AD/${fileName}\``)) {
            
            // This is a view_file response!
            // Let's try to extract the lines.
            let j = i;
            while(j < lines.length && !lines[j].includes('The following code has been modified to include a line number')) {
                j++;
            }
            if (j < lines.length) {
                j++; // skip the message
                let extracted = [];
                while(j < lines.length && !lines[j].includes('The above content does NOT show the entire file contents') && !lines[j].includes('The above content shows the entire, complete file contents')) {
                    // lines look like "1: <!DOCTYPE html>" or "144:             <div class=\"hero-badge reveal\">..."
                    const match = lines[j].match(/^\d+:\s(.*)$/);
                    if (match) {
                        extracted.push(match[1]);
                    } else if (lines[j].match(/^\d+:$/)) {
                        extracted.push(''); // empty line
                    }
                    j++;
                }
                if (extracted.length > 50) {
                    content = extracted.join('\n');
                }
            }
        }
    }
    
    if (content) {
        fs.writeFileSync(`recovered_${fileName}`, content, 'utf8');
        console.log(`Recovered ${fileName}`);
    } else {
        console.log(`Could not recover ${fileName}`);
    }
}

extractFile('C:\\Users\\fisni\\.gemini\\antigravity\\brain\\4a87c1a7-045c-471a-9310-3b5732c04b3b\\.system_generated\\logs\\overview.txt', 'index.html');
extractFile('C:\\Users\\fisni\\.gemini\\antigravity\\brain\\a850f7ae-a69b-4ca5-8029-6402e8541779\\.system_generated\\logs\\overview.txt', 'index.html');
