import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function fixImportsInFile(filePath) {
    const content = readFileSync(filePath, 'utf8');
    const newContent = content.replace(/from\s+["'](.+)\.ts["']/g, 'from "$1.js"');
    writeFileSync(filePath, newContent);
}

function walkDir(dir) {
    const files = readdirSync(dir);
    files.forEach(file => {
        const filePath = join(dir, file);
        if (statSync(filePath).isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.ts')) {
            console.log(`Fixing imports in ${filePath}`);
            fixImportsInFile(filePath);
        }
    });
}

// Start from src and bin directories
['src', 'bin'].forEach(dir => {
    if (existsSync(dir)) {
        walkDir(dir);
    }
});

console.log('Done fixing imports!'); 