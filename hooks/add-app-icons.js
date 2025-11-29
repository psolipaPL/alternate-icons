const fs = require('fs');
const path = require('path');

const DENSITIES = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];

const platform = process.env.CAPACITOR_PLATFORM_NAME || '';
const projectDirPath = process.env.CAPACITOR_ROOT_DIR || process.cwd();
const webDirPath = process.env.CAPACITOR_WEB_DIR || 'dist';

console.log('\tAlternate Icons hook - platform:', platform);

const imgDir = path.resolve(projectDirPath, webDirPath, 'img');

if (!fs.existsSync(imgDir)) {
  console.warn('\t[SKIPPED] Icons source directory does not exist:', imgDir);
  process.exit(0);
}

const files = fs
  .readdirSync(imgDir)
  .filter(
    name =>
      name.indexOf('ic_icon') > -1 &&
      /\.png$/i.test(name)
  )
  .sort();

if (files.length === 0) {
  console.warn('\t[SKIPPED] No icon files starting with "ic_icon" and ending with .png found in', imgDir);
  process.exit(0);
}

if (platform === 'android') {
  copyIconsAndroid(files);
} else if (platform === 'ios') {
  copyIconsIos(files);
} else {
  console.log('\t[SKIPPED] Platform not handled by Alternate Icons hook:', platform);
}

function copyIconsAndroid(files) {
  const androidResBaseDir = path.resolve(
    projectDirPath,
    'android',
    'app',
    'src',
    'main',
    'res'
  );

  files.forEach((file, index) => {
    const srcPath = path.join(imgDir, file);
    const buffer = fs.readFileSync(srcPath);
    const baseName = `ic_icon${index + 1}`;

    DENSITIES.forEach(density => {
      const destDir = path.join(androidResBaseDir, `mipmap-${density}`);
      const destPath = path.join(destDir, `${baseName}.png`);
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destPath, buffer);
      console.log(`\t[SUCCESS][android] Copied ${file} -> ${destPath}`);
    });
  });
}

function copyIconsIos(files) {
  const iosAppDir = path.resolve(
    projectDirPath,
    'ios',
    'App',
    'App'
  );

  if (!fs.existsSync(iosAppDir)) {
    console.warn('\t[SKIPPED] iOS App directory does not exist:', iosAppDir);
    return;
  }

  files.forEach((file, index) => {
    const srcPath = path.join(imgDir, file);
    const iconName = `icon${index + 1}`;      // icon1, icon2, ...
    const destFileName = `${iconName}.png`;   // icon1.png, icon2.png
    const destPath = path.join(iosAppDir, destFileName);

    fs.copyFileSync(srcPath, destPath);
    console.log(`\t[SUCCESS][ios] Copied ${file} -> ${destPath}`);
  });
}

