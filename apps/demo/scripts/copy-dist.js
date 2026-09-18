import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoDist = path.resolve(__dirname, '../dist');
const rootDist = path.resolve(__dirname, '../../../dist');

// If apps/demo/dist exists, copy to root dist
if (fs.existsSync(demoDist)) {
  fs.mkdirSync(rootDist, { recursive: true });
  fs.cpSync(demoDist, rootDist, { recursive: true });
  console.log(`[copy-dist] Copied ${demoDist} -> ${rootDist}`);
} else if (fs.existsSync(rootDist)) {
  // If root dist exists, copy to apps/demo/dist
  fs.mkdirSync(demoDist, { recursive: true });
  fs.cpSync(rootDist, demoDist, { recursive: true });
  console.log(`[copy-dist] Copied ${rootDist} -> ${demoDist}`);
}
