import fs from 'fs';
import path from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import { markers, MarkerArt } from './App';
import React from 'react';

// Generar el HTML de envoltorio usando Tailwind CSS Play CDN
const generateHTML = (title: string, svgContent: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Asset Steampunk</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        background-color: #393836;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .asset-container {
        width: 100%;
        max-width: 400px;
        aspect-ratio: 1/1;
      }
    </style>
</head>
<body>
    <div class="asset-container">
        ${svgContent}
    </div>
</body>
</html>
`;

// Directorio de salida
const outputDir = path.join(process.cwd(), 'html_exports');

// Crear la carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generar los HTML por cada marcador
let count = 0;
for (const marker of markers) {
  // Renderizar a string
  const svgContent = renderToStaticMarkup(
    <MarkerArt variant={marker.variant} number={marker.number} />
  );
  
  // Limpiar nombre de archivo
  const safeName = marker.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const fileName = `asset_${marker.id.toString().padStart(2, '0')}_${safeName}.html`;
  const filePath = path.join(outputDir, fileName);
  
  // Escribir archivo
  fs.writeFileSync(filePath, generateHTML(marker.name, svgContent));
  console.log(`✔️ Extraído: ${fileName}`);
  count++;
}

console.log(`✅ Completado: ${count} assets extraídos a la carpeta html_exports`);
