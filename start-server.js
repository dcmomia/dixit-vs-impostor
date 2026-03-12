const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // 1. Limpiar la URL de query strings (?v=3) y fragmentos (#hash)
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = parsedUrl.pathname;

    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${pathname}`);

    // 2. Ruta por defecto
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, pathname);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.warn(`[404] No encontrado: ${filePath}`);
                // Solo hacer fallback a index.html si no tiene extensión (asumiendo rutas SPA)
                if (extname === '') {
                    fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(indexContent, 'utf-8');
                    });
                } else {
                    res.writeHead(404);
                    res.end(`Archivo no encontrado: ${pathname}`);
                }
            } else {
                res.writeHead(500);
                res.end(`Error de servidor: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`🚀 Dixit vs Impostor está corriendo!`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`--------------------------------------------------`);
});
