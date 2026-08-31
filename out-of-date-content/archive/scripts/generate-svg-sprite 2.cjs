const fs = require('fs');
const path = require('path');

const directoryPath = process.cwd();
const outputFile = path.join(directoryPath, 'combined-sprite.svg');

// Get all SVG files in the current directory
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.svg'));

if (files.length === 0) {
  console.log('No SVG files found in the current directory.');
  process.exit(0);
}

let spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n`;

files.forEach(file => {
  const filePath = path.join(directoryPath, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const id = path.basename(file, '.svg');

  // Extract the viewBox attribute if it exists to maintain aspect ratios
  const viewBoxMatch = fileContent.match(/viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? ` viewBox="${viewBoxMatch[1]}"` : '';

  // Extract the content inside the <svg> tags
  const innerSvgMatch = fileContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  
  if (innerSvgMatch && innerSvgMatch[1]) {
    spriteContent += `  <symbol id="${id}"${viewBox}>\n    ${innerSvgMatch[1].trim()}\n  </symbol>\n`;
  } else {
    console.warn(`Could not parse content for ${file}`);
  }
});

spriteContent += `</svg>\n`;

fs.writeFileSync(outputFile, spriteContent);
console.log(`Successfully generated ${outputFile} containing ${files.length} SVGs.`);