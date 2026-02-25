const fs = require('fs');

const fixWhite = (file) => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace hardcoded whites with text-primary ONLY if they aren't inside buttons that are accent-primary or success/danger.
    // Actually, simple regex might ruin button text. Let's do a smarter replace.

    // We will just do a few selective replaces.
    // In AuditForm, there is `color: 'white'` used for Headers like `h1`, `h2`.
    content = content.replace(/<h1(.*?)color: 'white'(.*?)>/g, "<h1$1color: 'var(--text-primary)'$2>");
    content = content.replace(/<h2(.*?)color: 'white'(.*?)>/g, "<h2$1color: 'var(--text-primary)'$2>");
    content = content.replace(/<span(.*?)color: 'white'(.*?)>/g, "<span$1color: 'var(--text-primary)'$2>");

    // Borders
    content = content.replace(/rgba\(255,255,255,0.05\)/g, "var(--glass-border)");
    content = content.replace(/rgba\(255,255,255,0.1\)/g, "var(--glass-border)");

    fs.writeFileSync(file, content);
};

fixWhite('src/pages/AuditForm.jsx');
fixWhite('src/pages/Dashboard.jsx');
fixWhite('src/pages/Login.jsx');

// For Login specifically:
let loginContent = fs.readFileSync('src/pages/Login.jsx', 'utf8');
loginContent = loginContent.replace(/backgroundColor: 'rgba\\(0,0,0,0.8\\)'/g, "backgroundColor: 'rgba(255,255,255,0.8)'");
loginContent = loginContent.replace(/backgroundColor: '#1e293b'/g, "backgroundColor: 'var(--bg-secondary)'");
loginContent = loginContent.replace(/color: '#cbd5e1'/g, "color: 'var(--text-secondary)'");
loginContent = loginContent.replace(/border: '1px solid #334155'/g, "border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-warm)'");
fs.writeFileSync('src/pages/Login.jsx', loginContent);

console.log('UI colors updated');
