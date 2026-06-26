const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const frontendSrc = path.join(__dirname, 'src');
const files = walk(frontendSrc);

let changedFiles = 0;

// Regular expression to find className="..."
// We will replace text-[var(--theme-primary)] inside class strings that also contain specific backgrounds.
const bgRegex = /(bg-[#5E6AD2]|bg-[#0F172A]|bg-red-\d00|bg-green-\d00|bg-blue-\d00|bg-accent|bg-emerald-\d00)/;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // A simple regex to find all class strings: className="..." or className={`...`} or className={'...'}
    // It's safer to just split by 'className=' and process each chunk.
    const parts = content.split('className=');
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        
        // Find the boundary of the class string. It could be ", ', or {
        let boundary = part[0];
        let endIdx = -1;
        if (boundary === '"' || boundary === "'") {
            endIdx = part.indexOf(boundary, 1);
        } else if (boundary === '{') {
            // Very naive balancing for `
            let tickStart = part.indexOf('`');
            let tickEnd = part.indexOf('`', tickStart + 1);
            if (tickStart !== -1 && tickEnd !== -1) {
                endIdx = part.indexOf('}', tickEnd);
            } else {
                endIdx = part.indexOf('}');
            }
        }

        if (endIdx !== -1) {
            let classString = part.substring(0, endIdx + 1);
            
            // Check if this classString contains a colored background AND text-[var(--theme-primary)]
            if (bgRegex.test(classString) && classString.includes('text-[var(--theme-primary)]')) {
                let newClassString = classString.replace(/text-\[var\(--theme-primary\)\]/g, 'text-white');
                part = newClassString + part.substring(endIdx + 1);
                parts[i] = part;
            }
        }
    }
    
    let newContent = parts.join('className=');

    if (newContent !== original) {
        fs.writeFileSync(file, newContent);
        changedFiles++;
    }
});

console.log(`Fixed text color in ${changedFiles} files.`);
