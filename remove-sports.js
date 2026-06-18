const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'frontend');

const replacements = [
    { regex: /(?<!Table\s)Tennis(?!\sBalls)/gi, replace: 'Pickleball' },
    { regex: /Basketball/gi, replace: 'Badminton' },
    { regex: /Padel/gi, replace: 'Pickleball' },
    { regex: /Golf/gi, replace: 'Badminton' },
    { regex: /Soccer/gi, replace: 'Pickleball' },
    { regex: /Football/gi, replace: 'Badminton' },
    { regex: /Squash/gi, replace: 'Pickleball' },
    { regex: /Table Tennis/gi, replace: 'Pickleball' },
    { regex: /Tennis Balls/gi, replace: 'Pickleball Balls' },
    { regex: /Tennis Club/gi, replace: 'Pickleball Club' },
    { regex: /bóng rổ/gi, replace: 'cầu lông' },
    { regex: /bóng đá/gi, replace: 'cầu lông' },
    { regex: /quần vợt/gi, replace: 'pickleball' },
    { regex: /🎾/g, replace: '🏸' },
    { regex: /🏀/g, replace: '🏸' },
    { regex: /⚽/g, replace: '🏸' }
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
        
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const { regex, replace } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, (match) => {
                        // Preserve case logic
                        if (match === match.toUpperCase() && match.length > 2) {
                            return replace.toUpperCase();
                        }
                        if (match[0] === match[0].toUpperCase()) {
                            return replace.charAt(0).toUpperCase() + replace.slice(1);
                        }
                        return replace.toLowerCase();
                    });
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    }
}

processDirectory(targetDir);
console.log('Done!');
