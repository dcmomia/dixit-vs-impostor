const fs = require('fs');
const path = require('path');

const cssPath = 'src/style.css';
const css = fs.readFileSync(cssPath, 'utf8');
const rootDir = process.cwd();

const regex = /url\(['"]?(.*?)['"]?\)/g;
let match;
const broken = [];
const checked = new Set();

while ((match = regex.exec(css)) !== null) {
    const url = match[1];
    if (url.startsWith('http') || url.startsWith('data:') || checked.has(url)) continue;
    
    // Paths are relative to src/style.css
    const fullPath = path.resolve(path.dirname(cssPath), url);
    const exists = fs.existsSync(fullPath);
    
    if (!exists) {
        broken.push({ url, fullPath });
    }
    checked.add(url);
}

if (broken.length > 0) {
    console.log('--- Broken Paths Found ---');
    broken.forEach(b => console.log(`URL: ${b.url}\nRESOLVED: ${b.fullPath}\n`));
} else {
    console.log('All CSS assets are valid!');
}
