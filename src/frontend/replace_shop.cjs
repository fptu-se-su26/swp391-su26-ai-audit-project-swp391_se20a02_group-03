const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements, imports) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // add imports
    if (imports) {
        if (!content.includes("from 'lucide-react'")) {
            content = content.replace("import {", `import { ${imports},`);
        } else {
            // just append to the end of the imports if possible, or simpler: just add another import line
            content = content.replace(/(import .*? from 'react'.*?\n)/, `$1import { ${imports} } from 'lucide-react'\n`);
        }
    }

    // replace strings
    replacements.forEach(([search, replace]) => {
        content = content.split(search).join(replace);
    });

    fs.writeFileSync(filePath, content);
}

const shopCart = path.join(__dirname, 'src', 'pages', 'shop', 'ShopCartPage.jsx');
replaceInFile(shopCart, [
    ['♡ Save', '<Heart size={14} className="inline mr-1" /> Save'],
    ['🗑 Remove', '<Trash2 size={14} className="inline mr-1" /> Remove']
], 'Heart, Trash2');

const shopPage = path.join(__dirname, 'src', 'pages', 'shop', 'ShopPage.jsx');
replaceInFile(shopPage, [
    ['✓', '<Check size={12} className="inline" />'],
    ['★ ', '<Star size={12} fill="currentColor" className="inline mr-1 text-yellow-500" /> ']
], 'Check, Star');

const shopProduct = path.join(__dirname, 'src', 'pages', 'shop', 'ShopProductPage.jsx');
replaceInFile(shopProduct, [
    ['★ ', '<Star size={12} fill="currentColor" className="inline mr-1 text-yellow-500" /> ']
], 'Star');

console.log('Shop emojis replaced.');
