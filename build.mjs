// Zubalenok Lifetime — tiny build: partials -> index.html, src/css -> css/style.css, src/js -> js/app.js
// Usage: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const list = (dir, ext) =>
  fs.existsSync(path.join(ROOT, dir))
    ? fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith(ext)).sort()
    : [];

// `12u` = 12px of the artboard (428 on mobile, 1440 on desktop) scaled fluidly. See src/css/00-base.css
const U = /(?<![\w#.])(-?\d*\.?\d+)u(?![\w-])/g;
const compileU = (css) => css.replace(U, (_, n) => `calc(${n} * var(--u))`);

// CSS
const css = list('src/css', '.css').map((f) => `/* ${f} */\n${read('src/css/' + f)}`).join('\n');
fs.writeFileSync(path.join(ROOT, 'css/style.css'), compileU(css));

// JS
const js = list('src/js', '.js').map((f) => `/* ${f} */\n${read('src/js/' + f)}`).join('\n;\n');
fs.writeFileSync(path.join(ROOT, 'js/app.js'), js);

// HTML
const tpl = read('src/index.template.html');
const partials = list('src/partials', '.html');
const html = (body) => tpl.replace('<!-- @sections -->', body);
fs.writeFileSync(
  path.join(ROOT, 'index.html'),
  html(partials.map((f) => read('src/partials/' + f)).join('\n'))
);

// Per-section previews (for isolated screenshots): preview/<name>.html
fs.mkdirSync(path.join(ROOT, 'preview'), { recursive: true });
for (const f of partials) {
  const out = html(read('src/partials/' + f))
    .replace(/(href|src|srcset)="(css|js|images|fonts)\//g, '$1="../$2/');
  fs.writeFileSync(path.join(ROOT, 'preview', f), out);
}
console.log(`built: ${partials.length} sections`);
