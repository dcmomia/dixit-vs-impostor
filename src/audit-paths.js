const fs = require('fs');
const paths = [
    'src/style.css',
    'src/screens/main-menu/assets/bg_main.jpg',
    'src/screens/main-menu/assets/btn_nueva_partida.png',
    'src/screens/main-menu/assets/dixit_logo.png',
    'src/screens/main-menu/assets/vs_impostor_logo.png'
];
console.log('--- Path Audit ---');
paths.forEach(p => {
    const exists = fs.existsSync(p);
    console.log(`${p}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
    if (exists) {
        const stats = fs.statSync(p);
        console.log(`  Size: ${stats.size} bytes`);
    }
});
