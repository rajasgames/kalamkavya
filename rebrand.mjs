import fs from 'fs';
import path from 'path';

const searchStr1 = 'Inkwell Pro';
const replaceStr1 = 'कalam काvya';

const searchStr2 = 'Inkwell';
const replaceStr2 = 'कalam काvya';

const searchStr3 = 'inkwell';
const replaceStr3 = 'kalam-kavya';

const targetExts = ['.ts', '.tsx', '.html', '.json', '.md'];
const excludeDirs = ['node_modules', 'dist', '.git', '.vite', 'src-tauri/target'];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!excludeDirs.includes(file) && !excludeDirs.some(ex => fullPath.includes(path.normalize(ex)))) {
        processDir(fullPath);
      }
    } else {
      if (targetExts.includes(path.extname(fullPath))) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content;
        
        // Priority to 'Inkwell Pro' then 'Inkwell'
        newContent = newContent.replace(new RegExp(searchStr1, 'g'), replaceStr1);
        newContent = newContent.replace(new RegExp(searchStr2, 'g'), replaceStr2);
        
        // Finally lowercase inkwell
        newContent = newContent.replace(new RegExp(searchStr3, 'g'), replaceStr3);

        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

processDir(process.cwd());
console.log('Rebranding complete.');
