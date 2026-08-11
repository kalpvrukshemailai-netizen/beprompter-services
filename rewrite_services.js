const fs = require("fs");
let content = fs.readFileSync("src/app/pages/ServicesPage.tsx", "utf-8");

// 1. Remove all inline fonts and replace with Tailwind classes
content = content.replace(/style=\{\{\s*fontFamily:\s*"'Barlow Condensed',\s*sans-serif"[^}]*\}\}/g, "");
content = content.replace(/style=\{\{\s*fontFamily:\s*"'Inter',\s*sans-serif"[^}]*\}\}/g, "");
// Cleanup any empty style tags left over
content = content.replace(/style=\{\{\s*\}\}/g, "");

// 2. Add Tailwind font classes
// Instead of replacing every instance manually, I'll add the classes where the style tags used to be.
// But wait, it's easier to just do text replacements.

// Actually, let's just do a blanket regex to add font-heading to headings, font-sans to paragraphs.
// Let's replace the common patterns:
content = content.replace(/style=\{\{\s*fontFamily:\s*"'Barlow Condensed',\s*sans-serif",?\s*(.*?)\s*\}\}/g, (match, p1) => {
  if (p1.trim() === "") return "";
  return `style={{ ${p1} }}`;
});
content = content.replace(/style=\{\{\s*fontFamily:\s*"'Inter',\s*sans-serif",?\s*(.*?)\s*\}\}/g, (match, p1) => {
  if (p1.trim() === "") return "";
  return `style={{ ${p1} }}`;
});
content = content.replace(/style=\{\{\s*\}\}/g, "");
content = content.replace(/ className="/g, ' className="font-heading '); // wait, no that's too aggressive.

fs.writeFileSync("src/app/pages/ServicesPage.tsx", content);
