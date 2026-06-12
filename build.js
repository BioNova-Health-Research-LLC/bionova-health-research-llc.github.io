const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const { minify: terserMinify } = require('terser');
const { minify: htmlMinify } = require('html-minifier-terser');

const DIST = path.join(__dirname, 'dist');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

async function build() {
  // Clean and recreate dist
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);

  // Copy assets folder
  copyDir(path.join(__dirname, 'assets'), path.join(DIST, 'assets'));

  // Minify CSS
  const cssPath = path.join(DIST, 'assets/styles/style.css');
  const cssOutput = new CleanCSS({ level: 2 }).minify(fs.readFileSync(cssPath, 'utf8'));
  fs.writeFileSync(cssPath, cssOutput.styles);
  console.log(`CSS: ${cssOutput.stats.originalSize}B → ${cssOutput.stats.minifiedSize}B`);

  // Minify JS
  const jsPath = path.join(DIST, 'assets/scripts/main.js');
  const jsOutput = await terserMinify(fs.readFileSync(jsPath, 'utf8'), { compress: true, mangle: true });
  fs.writeFileSync(jsPath, jsOutput.code);
  console.log(`JS minified`);

  // Minify HTML
  const htmlPath = path.join(__dirname, 'index.html');
  const htmlOutput = await htmlMinify(fs.readFileSync(htmlPath, 'utf8'), {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), htmlOutput);
  console.log(`HTML minified`);

  console.log('Build complete → dist/');
}

build().catch(err => { console.error(err); process.exit(1); });
