// Copy existing payment logos to the dist folder for production
const fs = require('fs');
const path = require('path');

const sourceDir = '.';
const targetDir = './dist';

// List of payment logo files to copy
const logoFiles = [
  'easypaisa-logo.png',
  'easypaisa-new-logo-0B6AAF8329-seeklogo.com.png', 
  'new-Jazzcash-logo.png',
  'new-Jazzcash-logo (1).png'
];

// Create dist directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy logo files
logoFiles.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied ${file} to dist folder`);
  } else {
    console.log(`⚠️ Source file ${file} not found`);
  }
});

// Also create simplified names for easier access
const simplifiedNames = [
  { src: 'easypaisa-new-logo-0B6AAF8329-seeklogo.com.png', dest: 'easypaisa-logo.png' },
  { src: 'new-Jazzcash-logo.png', dest: 'jazzcash-logo.png' }
];

simplifiedNames.forEach(({ src, dest }) => {
  const sourcePath = path.join(sourceDir, src);
  const targetPath = path.join(targetDir, dest);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Created simplified name: ${dest}`);
  }
});

console.log('🎉 Payment logos copied successfully!');
