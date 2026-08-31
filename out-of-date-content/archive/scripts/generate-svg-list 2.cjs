const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), 'node_modules/@material-design-icons/svg/round');
const outputFile = path.join(process.cwd(), 'svg-list.txt');

// Get all SVG files in the target directory
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.svg'));

if (files.length === 0) {
  console.log(`No SVG files found in ${directoryPath}.`);
  process.exit(0);
}

// Create a newline-separated list of the file names
const listContent = files.join('\n') + '\n';

fs.writeFileSync(outputFile, listContent);
console.log(`Successfully generated ${outputFile} containing ${files.length} SVG filenames.`);