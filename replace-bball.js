const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src/frontend/src/pages');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let updated = content;

            // Basketball group -> Pickleball group
            updated = updated.split('1622227432807-91eb590c31ab').join('1698295627727-b5de3baec2c4');
            // Another basketball image -> Badminton
            updated = updated.split('1554068865-24cecd4e34b8').join('1599586120429-48281b6f0ece');

            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf-8');
                console.log(`Updated images in ${file}`);
            }
        }
    }
}

processDir(directory);
console.log('Done replacing basketball images.');
