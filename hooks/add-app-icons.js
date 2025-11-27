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
      name.startsWith('ic_icon') &&
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
  const iosAssetsBaseDir = path.resolve(
    projectDirPath,
    'ios',
    'App',
    'App',
    'Assets.xcassets'
  );

  if (!fs.existsSync(iosAssetsBaseDir)) {
    console.warn('\t[SKIPPED] iOS Assets.xcassets directory does not exist:', iosAssetsBaseDir);
    return;
  }

  files.forEach((file, index) => {
    const srcPath = path.join(imgDir, file);
    const buffer = fs.readFileSync(srcPath);
    const iconName = `icon${index + 1}`;
    const appIconSetDir = path.join(iosAssetsBaseDir, `${iconName}.appiconset`);
    const destFileName = `${iconName}.png`;
    const destPath = path.join(appIconSetDir, destFileName);

    fs.mkdirSync(appIconSetDir, { recursive: true });
    fs.writeFileSync(destPath, buffer);

    const contents = {
      images: [
        {
          idiom: 'iphone',
          size: '60x60',
          scale: '3x',
          filename: destFileName
        }
      ],
      info: {
        version: 1,
        author: 'xcode'
      }
    };

    fs.writeFileSync(
      path.join(appIconSetDir, 'Contents.json'),
      JSON.stringify(contents, null, 2)
    );

    console.log(`\t[SUCCESS][ios] Copied ${file} -> ${destPath}`);
  });
}
