const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Undoing previous fix and mapping to new structure in src/
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/menu\/(.*?)['"]?\)/g, "url('screens/main-menu/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/setup\/(.*?)['"]?\)/g, "url('screens/setup/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/categories\/(.*?)['"]?\)/g, "url('screens/categories/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/reveal\/(.*?)['"]?\)/g, "url('screens/reveal/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/timer\/(.*?)['"]?\)/g, "url('screens/timer/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/panic\/(.*?)['"]?\)/g, "url('screens/panic/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/score\/(.*?)['"]?\)/g, "url('screens/score/assets/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/IMG\/UI\/global\/(.*?)['"]?\)/g, "url('core/assets/global/$1')");
css = css.replace(/url\(['"]?\.\.\/assets\/players\/(.*?)['"]?\)/g, "url('core/assets/players/$1')");

// Also check for any direct assets/ paths that didn't have ../ but now need to be in screens
css = css.replace(/url\(['"]?assets\/IMG\/UI\/menu\/(.*?)['"]?\)/g, "url('screens/main-menu/assets/$1')");
css = css.replace(/url\(['"]?assets\/IMG\/UI\/setup\/(.*?)['"]?\)/g, "url('screens/setup/assets/$1')");
// Add a few more generic ones just in case
css = css.replace(/url\(['"]?assets\/IMG\/UI\/global\/(.*?)['"]?\)/g, "url('core/assets/global/$1')");

// Handle potential leftovers from original CSS
css = css.replace(/url\(['"]?assets\/IMG\/UI\/menu\/(.*?)['"]?\)/g, "url('screens/main-menu/assets/$1')");

fs.writeFileSync('src/style.css', css, 'utf8');
console.log('CSS paths updated to src/screens structure');
