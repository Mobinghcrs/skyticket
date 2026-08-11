import fs from 'fs';
import path from 'path';
import tailwindcss from 'tailwindcss';

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.git')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (/\.(html|ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
}

walk(root);

const candidates = new Set([
  'hidden', 'block', 'inline-block', 'inline', 'flex', 'grid', 'min-h-screen', 'bg-white', 'text-white'
]);

const tokenPattern = /[A-Za-z0-9_!\-:/.[\]%#(),]+/g;
const likelyClass = (token) => {
  if (!token) return false;
  if (token.length > 120) return false;
  if (/^(https?|data|mailto|tel):/i.test(token)) return false;
  if (/^[0-9]+$/.test(token)) return false;
  if (token.includes('/') && !token.includes('w-') && !token.includes('h-') && !token.includes('bg-') && !token.includes('text-')) return false;
  return /-|:|\[|\]|\//.test(token)
    || ['flex', 'grid', 'block', 'hidden', 'relative', 'absolute', 'fixed', 'sticky', 'group', 'container', 'prose', 'shadow', 'sr-only'].includes(token);
};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(tokenPattern) || [];
  for (const token of matches) {
    if (likelyClass(token)) candidates.add(token);
  }
}

// Safelist dynamic classes seen in the app.
[
  'left-6', 'right-6', 'left-4', 'right-4', 'pr-12', 'pl-12', 'pl-4', 'pr-4',
  'pr-10', 'pl-10', 'rotate-180', 'bg-gradient-to-r', 'bg-gradient-to-br', 'bg-gradient-to-t',
  'from-blue-500', 'to-indigo-600', 'from-sky-500', 'to-blue-600', 'from-purple-500', 'to-pink-600',
  'from-emerald-500', 'to-teal-600', 'from-amber-500', 'to-orange-600', 'to-transparent',
  'hover:scale-[1.01]', 'min-h-[420px]', 'w-[794px]', 'min-h-[1123px]', 'h-[90vh]', 'text-[10px]', 'text-[8px]', 'text-[9px]',
  'gap-[2px]', 'h-[2px]', 'top-3.5', 'tracking-[0.3em]'
].forEach((token) => candidates.add(token));

const inputCss = fs.readFileSync(path.join(root, 'node_modules', 'tailwindcss', 'index.css'), 'utf8');
const compiled = await tailwindcss.compile(inputCss);
const css = compiled.build([...candidates]);
fs.writeFileSync(path.join(root, 'generated-tailwind.css'), css);
console.log(`Generated Tailwind CSS with ${candidates.size} candidates.`);
