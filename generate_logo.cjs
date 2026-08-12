const sharp = require('sharp');

const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 24 24" fill="none">
  <defs>
    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="url(#blueGlow)" stroke="none"/>
</svg>
`;

sharp(Buffer.from(svgCode))
  .png()
  .toFile('./public/logo.png')
  .then(info => {
    console.log('Successfully generated transparent logo.png:', info);
  })
  .catch(err => {
    console.error('Error generating logo:', err);
  });
