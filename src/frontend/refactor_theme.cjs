const fs = require('fs');
const path = require('path');

const replacements = [
    // Backgrounds
    ['bg-[#050506]', 'bg-background-base'],
    ['bg-[#020203]', 'bg-background-deep'],
    ['bg-[#0a0a0c]', 'bg-background-elevated'],
    ['bg-[#0A0A0B]', 'bg-background-elevated'],
    
    // Surfaces (glassmorphism)
    ['bg-white/5', 'bg-[var(--theme-surface)]'],
    ['bg-white/10', 'bg-[var(--theme-surface-hover)]'],
    ['bg-white/[0.03]', 'bg-[var(--theme-surface)]'],
    ['bg-white/[0.04]', 'bg-[var(--theme-surface)]'],
    ['bg-white/[0.08]', 'bg-[var(--theme-surface-hover)]'],
    
    // Borders
    ['border-white/5', 'border-border-default'],
    ['border-white/10', 'border-border-default'],
    ['border-white/20', 'border-border-hover'],
    ['border-white/[0.06]', 'border-border-default'],
    
    // Text colors
    ['text-[#EDEDEF]', 'text-foreground'],
    ['text-gray-400', 'text-foreground-muted'],
    ['text-gray-500', 'text-foreground-muted'],
    
    // Replace text-white with adaptive primary text, but try to avoid buttons if possible.
    // Actually, simple string replacement might be fine, we can fix buttons later if they look weird.
    ['text-white', 'text-[var(--theme-primary)]']
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const frontendSrc = path.join(__dirname, 'src');
const files = walk(frontendSrc);

let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(([search, replace]) => {
        // Use global regex or split/join
        content = content.split(search).join(replace);
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});

console.log(`Updated ${changedFiles} files with new theme variables.`);
