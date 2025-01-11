const fs = require('fs');
const path = require('path');

// Lee el archivo index.html
const indexPath = path.join(__dirname, 'dist', 'index.html');
let htmlContent = fs.readFileSync(indexPath, 'utf-8');

// Ajusta las rutas
htmlContent = htmlContent.replace(/src="\//g, 'src="');
htmlContent = htmlContent.replace(/href="\//g, 'href="');

// Guarda los cambios
fs.writeFileSync(indexPath, htmlContent);

console.log('Post-build: Rutas ajustadas en index.html'); 