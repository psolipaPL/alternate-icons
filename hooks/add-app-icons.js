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
  const distDir = path.resolve(projectDirPath, webDirPath);

  if (!fs.existsSync(distDir)) {
    console.warn('\t[SKIPPED] Icons source directory does not exist:', distDir);
    return;
  }

  const files = fs
    .readdirSync(distDir)
    .filter(
      name =>
        name.indexOf('ic_icon') > -1 &&
        /\.(png|jpg|jpeg|webp)$/i.test(name)
    )
    .sort();

  if (files.length === 0) {
    console.warn('\t[SKIPPED] No icon files starting with "ic_icon" found in', distDir);
    return;
  }

  files.forEach((file, index) => {
    const srcPath = path.join(distDir, file);
    const buffer = fs.readFileSync(srcPath);
    const parsed = path.parse(file);
    const ext = parsed.ext.toLowerCase() || '.png';
    const targetBaseName = `ic_icon${index + 1}`;

    DENSITIES.forEach(density => {
      const destDir = path.join(androidResBaseDir, `mipmap-${density}`);
      const destPath = path.join(destDir, `${targetBaseName}${ext}`);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, buffer);
      console.log(`\t[SUCCESS] Copied ${file} -> ${destPath}`);
    });
  });
}
