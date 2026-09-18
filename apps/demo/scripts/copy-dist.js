import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../dist');
const rootDist = path.resolve(__dirname, '../../../dist');
const appsDist = path.resolve(__dirname, '../../dist');

if (fs.existsSync(src)) {
  // Ensure both root /dist and apps/dist are populated
  fs.mkdirSync(rootDist, { recursive: true });
  fs.cpSync(src, rootDist, { recursive: true });
  console.log(`[copy-dist] Copied ${src} -> ${rootDist}`);

  fs.mkdirSync(appsDist, { recursive: true });
  fs.cpSync(src, appsDist, { recursive: true });
}
