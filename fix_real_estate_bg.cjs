const fs = require('fs');

let content = fs.readFileSync('src/app/pages/RealEstateIndustryPage.tsx', 'utf-8');

// 1. Replace AnimatedBuildingBg definition with GlobalBuildingBg
const oldBgStart = "function AnimatedBuildingBg({ scrollYProgress }: { scrollYProgress: any }) {";
const newBgStart = "function GlobalBuildingBg() {\n  const { scrollYProgress } = useScroll();";

content = content.replace(oldBgStart, newBgStart);
// Update scroll progress logic
content = content.replace(
  'const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);',
  'const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);'
);
content = content.replace(
  'const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);',
  'const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);'
);
content = content.replace(
  'const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);',
  'const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);'
);

// Make it fixed and remove its own background color
content = content.replace(
  '<div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] pointer-events-none">',
  '<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">'
);

// Increase opacity drastically and remove grayscale for better visibility
content = content.replace('grayscale opacity-30', 'opacity-40');
content = content.replace('grayscale opacity-40', 'opacity-60');
content = content.replace('grayscale opacity-50', 'opacity-80');

// Fix overlays
content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-[#050505]" />',
  '<div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />'
);

// 2. Modify RealEstateIndustryPage component structure
// Remove the AnimatedBuildingBg from hero section
content = content.replace(
  '<AnimatedBuildingBg scrollYProgress={scrollYProgress} />',
  ''
);

// Remove overflow-hidden from hero section so fixed bg doesn't get weird
content = content.replace(
  'className="relative min-h-[95vh] flex flex-col justify-center border-b border-white/10 overflow-hidden pt-24 pb-16"',
  'className="relative min-h-[95vh] flex flex-col justify-center border-b border-white/10 pt-24 pb-16"'
);

// Add GlobalBuildingBg to the top of the page, and remove bg-black from main container
content = content.replace(
  '<div className="bg-black text-white selection:bg-white selection:text-black font-sans">',
  '<div className="text-white selection:bg-white selection:text-black font-sans relative min-h-screen">\n      <GlobalBuildingBg />'
);

// 3. Remove backgrounds from sections so the global bg shows through
content = content.replace(/bg-black/g, 'bg-transparent');
content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-transparent');
content = content.replace(/bg-\[#050505\]/g, 'bg-transparent');

// But we need to fix some specific elements that need backgrounds
content = content.replace(/<span className="w-1.5 h-1.5 rounded-full bg-transparent inline-block" \/>/g, '<span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />');
content = content.replace(/className="bg-white overflow-hidden py-3"/g, 'className="bg-white overflow-hidden py-3 text-black"'); // ensure ticker is visible
// Restore some card backgrounds that shouldn't be transparent
content = content.replace(/bg-transparent\/80 backdrop-blur-xl/g, 'bg-black/80 backdrop-blur-xl');
content = content.replace(/bg-transparent border border-white\/10 p-8 h-full/g, 'bg-black/40 backdrop-blur-md border border-white/10 p-8 h-full');
content = content.replace(/bg-transparent border border-white\/10 p-8 rounded-xl/g, 'bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl');

fs.writeFileSync('src/app/pages/RealEstateIndustryPage.tsx', content);
console.log("Real estate page updated to have global background animation.");
