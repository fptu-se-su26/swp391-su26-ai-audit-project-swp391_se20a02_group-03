const fs = require('fs');
const path = require('path');

const replacements = [
    // Fix faint grays
    ['text-gray-300', 'text-foreground-muted'],
    ['text-gray-200', 'text-foreground'],
    ['text-gray-100', 'text-foreground'],
    
    // Fix faint white opacities
    ['text-white/90', 'text-foreground'],
    ['text-white/80', 'text-foreground'],
    ['text-white/70', 'text-foreground-subtle'],
    ['text-white/60', 'text-foreground-subtle'],
    ['text-white/50', 'text-foreground-subtle'],
    
    // Fix hardcoded hexes often used in light themes that should adapt
    ['text-[#64748B]', 'text-foreground-muted'],
    ['text-[#0F172A]', 'text-foreground'],
    ['bg-[#0F172A]', 'bg-[var(--theme-primary)]'],
    ['text-[#1E293B]', 'text-foreground'],
    
    // Fix the accidental text-white reversion in false branches
    ['bg-[var(--theme-surface)] text-white', 'bg-[var(--theme-surface)] text-foreground'],
    ['bg-[var(--theme-surface-hover)] text-white', 'bg-[var(--theme-surface-hover)] text-foreground'],
    ['bg-transparent border-border-hover text-white', 'bg-transparent border-border-hover text-foreground-muted'],
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
        content = content.split(search).join(replace);
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});

console.log(`Fixed faint text in ${changedFiles} files.`);
