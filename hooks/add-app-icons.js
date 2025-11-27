const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const androidRes = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
const distImg = path.join(projectRoot, 'dist', 'img');

const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

function getIconFiles() {
  if (!fs.existsSync(distImg)) return [];
  return fs
    .readdirSync(distImg)
    .filter(name =>
      name.startsWith('ic_icon') &&
      /\.(png|jpg|jpeg|webp)$/i.test(name)
    );
}

function copyBufferToDensities(resName, buffer) {
  for (const density of DENSITIES) {
    const destDir = path.join(androidRes, `mipmap-${density}`);
    const dest = path.join(destDir, `${resName}.png`);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(dest, buffer);
  }
}

(async function main() {
  const files = getIconFiles();
  for (const file of files) {
    const srcPath = path.join(distImg, file);
    const buffer = fs.readFileSync(srcPath);
    const resName = path.parse(file).name;
    copyBufferToDensities(resName, buffer);
  }
})();
