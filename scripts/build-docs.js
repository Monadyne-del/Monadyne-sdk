const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, '..', 'docs');
const outDir = path.join(docsDir, 'site');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mdToHtml(md) {
  // Very small markdown-to-html converter covering headings, lists, code blocks, inline code, images, paragraphs
  const lines = md.split(/\r?\n/);
  let html = '';
  let inCode = false;
  let codeLang = '';
  let inList = false;
  for (let rawLine of lines) {
    let line = rawLine;
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        html += `<pre><code class="lang-${escapeHtml(codeLang)}">`;
      } else {
        inCode = false;
        html += '</code></pre>\n';
      }
      continue;
    }
    if (inCode) {
      html += escapeHtml(line) + '\n';
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2];
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h${level}>${inline(text)}</h${level}>\n`;
      continue;
    }

    // image
    const img = line.match(/^!\[(.*?)\]\((.*?)\)\s*$/);
    if (img) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p><img src="${escapeHtml(img[2])}" alt="${escapeHtml(img[1])}" style="max-width:100%;height:auto;"/></p>\n`;
      continue;
    }

    // list
    const li = line.match(/^[-*+]\s+(.*)$/);
    if (li) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(li[1])}</li>\n`;
      continue;
    } else {
      if (inList) { html += '</ul>\n'; inList = false; }
    }

    // code indent (4 spaces)
    if (/^\s{4}/.test(line)) {
      html += `<pre><code>${escapeHtml(line.replace(/^\s{4}/, ''))}</code></pre>\n`;
      continue;
    }

    if (line.trim() === '') {
      html += '\n';
      continue;
    }

    html += `<p>${inline(line)}</p>\n`;
  }
  if (inList) html += '</ul>\n';
  return html;
}

function inline(text) {
  // inline code
  text = text.replace(/`([^`]+)`/g, (m, p1) => `<code>${escapeHtml(p1)}</code>`);
  // bold **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, (m, p1) => `<strong>${escapeHtml(p1)}</strong>`);
  // italics *text*
  text = text.replace(/\*([^*]+)\*/g, (m, p1) => `<em>${escapeHtml(p1)}</em>`);
  // links [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, (m, p1, p2) => `<a href="${escapeHtml(p2)}">${escapeHtml(p1)}</a>`);
  return text;
}

// Read all .md files in docs directory (non-recursive except site)
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

// Read banner if exists
let bannerPath = path.join(__dirname, '..', 'public', 'banner.png');
let bannerExists = fs.existsSync(bannerPath);
let bannerRel = bannerExists ? path.relative(outDir, bannerPath).split('\\').join('/') : null;

for (const file of files) {
  const full = path.join(docsDir, file);
  const md = fs.readFileSync(full, 'utf8');
  const body = mdToHtml(md);
  const titleMatch = md.split(/\r?\n/).find(l => l.startsWith('# '));
  const title = titleMatch ? titleMatch.replace(/^#\s+/, '') : 'Documentation';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} - Solana Monad SDK</title>
<style>
body{font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;margin:24px;color:#102a43}
header{max-width:1100px;margin:0 auto 24px}
.container{max-width:1100px;margin:0 auto;background:#fff;padding:24px;border-radius:10px;box-shadow:0 4px 24px rgba(16,42,67,0.08)}
img.banner{width:100%;height:auto;border-radius:8px;margin-bottom:16px}
pre{background:#0f1724;color:#e6eef8;padding:12px;border-radius:6px;overflow:auto}
code{background:#f1f5f9;padding:2px 4px;border-radius:4px}
h1,h2,h3{color:#0b3b53}
a{color:#0066cc}
</style>
</head>
<body>
<header>
${bannerExists?`<img src="${escapeHtml(bannerRel)}" class="banner" alt="Solana Monad SDK Banner"/>`:''}
</header>
<main class="container">
${body}
</main>
</body>
</html>`;
  const name = path.basename(file, '.md') + '.html';
  fs.writeFileSync(path.join(outDir, name), html, 'utf8');
  console.log('Wrote', name);
}

// Create index listing
let indexList = files.map(f => {
  const name = path.basename(f, '.md');
  const titleLine = fs.readFileSync(path.join(docsDir, f), 'utf8').split(/\r?\n/).find(l=>l.startsWith('# '));
  const title = titleLine? titleLine.replace('# ',''): name;
  return `<li><a href="${encodeURI(name + '.html')}">${escapeHtml(title)}</a></li>`;
}).join('\n');

const indexHtml = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Docs - Solana Monad SDK</title></head>
<body style="font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;padding:24px;max-width:1100px;margin:0 auto;">
${bannerExists?`<img src="${escapeHtml(bannerRel)}" style="width:100%;height:auto;border-radius:8px;margin-bottom:16px" alt="Banner"/>`:''}
<h1>Solana Monad SDK Documentation</h1>
<ul>
${indexList}
</ul>
</body>
</html>`;
fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml, 'utf8');
console.log('Wrote index.html');
