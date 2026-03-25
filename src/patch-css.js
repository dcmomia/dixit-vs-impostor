const fs = require('fs');
const path = require('path');

const cssPath = 'src/style.css';
const mapPath = 'asset-map.json';
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

let css = fs.readFileSync(cssPath, 'utf8');

// For each asset, find old broken patterns in CSS and replace with correct ones.
// The old patterns usually start with ../assets/IMG/UI/ or similar.
// And they were broken because they were pointing to the root 'assets' which is now empty or missing.

for (const [filename, physicalPath] of Object.entries(map)) {
    // Relative path from src/style.css to the physical path
    // Physical path is 'src/screens/...' 
    // From 'src', it is './screens/...'
    const newRelativePath = physicalPath.replace(/^src\//, './');
    
    // We look for patterns like url('.../filename') or url(".../filename")
    // Use a regex that matches the filename regardless of its previous folder structure
    const escapedFilename = filename.replace(/\./g, '\\.');
    const pattern = new RegExp(`url\\(['"]?(?:\\.\\.\\/)*assets\\/IMG\\/UI\\/[^'"]*?\\/${escapedFilename}['"]?\\)`, 'g');
    
    css = css.replace(pattern, `url('${newRelativePath}')`);
}

// Special case: bg_votaciones.png might have different name or path?
// Wait, I saw bg_votaciones.png was broken but not found in src?
// Let me check my asset-map.json again. 
// Ah, bg_votaciones.png is MISSING from asset-map.json!

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS paths patched successfully.');
