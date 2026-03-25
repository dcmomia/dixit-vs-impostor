const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');
css = css.replace(/url\(['"]?(.*?)['"]?\)/g, (match, path) => {
    if (path.startsWith('data:')) return match;
    if (path.startsWith('http')) return match;
    if (path.startsWith('../')) return match;
    return `url('../${path}')`;
});
fs.writeFileSync('src/style.css', css, 'utf8');
console.log('CSS rutas de imagenes corregidas');
