const fs = require('fs');
const path = require('path');

const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

const platform = process.env.CAPACITOR_PLATFORM_NAME;
const projectDirPath = process.env.CAPACITOR_ROOT_DIR;
const webDirPath = process.env.CAPACITOR_WEB_DIR || 'dist';

console.log('\tAlternate Icons hook - platform:', platform);

if (platform === 'android') {
  const androidResBaseDir = path.resolve(
    projectDirPath,
    'android',
    'app',
    'src',
    'main',
    'res'
  );
  copyIcons(androidResBaseDir, webDirPath);
} else {
  console.log('\tAlternate Icons hook - nothing to do for platform:', platform);
}

function copyIcons(androidResBaseDir, webDirPath) {
  const imgDir = path.resolve(projectDirPath, webDirPath, 'img');

  if (!fs.existsSync(imgDir)) {
    console.warn('\t[SKIPPED] Icons source directory does not exist:', imgDir);
    return;
  }

  const files = fs
    .readdirSync(imgDir)
    .filter(
      name =>
        name.indexOf('ic_icon') > -1 &&
        /\.(png|jpg|jpeg|webp)$/i.test(name)
    );

  if (files.length === 0) {
    console.warn('\t[SKIPPED] No icon files starting with "ic_icon" found in', imgDir);
    return;
  }

  files.forEach(file => {
    const srcPath = path.join(imgDir, file);
    const buffer = fs.readFileSync(srcPath);
    const parsed = path.parse(file);
    const resName = parsed.name;
    const ext = parsed.ext.toLowerCase() || '.png';

    DENSITIES.forEach(density => {
      const destDir = path.join(androidResBaseDir, `mipmap-${density}`);
      const destPath = path.join(destDir, `${resName}${ext}`);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, buffer);
      console.log(`\t[SUCCESS] Copied ${file} -> ${destPath}`);
    });
  });
}
