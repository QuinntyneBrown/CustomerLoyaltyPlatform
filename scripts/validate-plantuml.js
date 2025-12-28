const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

// PlantUML encoding functions
function encode64(data) {
    let r = "";
    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 == data.length) {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
        } else if (i + 1 == data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        } else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
        }
    }
    return r;
}

function append3bytes(b1, b2, b3) {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3F;
    let r = "";
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    return r;
}

function encode6bit(b) {
    if (b < 10) return String.fromCharCode(48 + b);
    b -= 10;
    if (b < 26) return String.fromCharCode(65 + b);
    b -= 26;
    if (b < 26) return String.fromCharCode(97 + b);
    b -= 26;
    if (b == 0) return '-';
    if (b == 1) return '_';
    return '?';
}

function encodePlantUML(text) {
    const deflated = zlib.deflateRawSync(Buffer.from(text, 'utf-8'));
    return encode64(deflated.toString('binary'));
}

function validateDiagram(filePath) {
    return new Promise((resolve, reject) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const encoded = encodePlantUML(content);
        const url = `https://www.plantuml.com/plantuml/png/${encoded}`;

        https.get(url, (res) => {
            if (res.statusCode === 200) {
                resolve({ file: filePath, valid: true });
            } else {
                resolve({ file: filePath, valid: false, error: `HTTP ${res.statusCode}` });
            }
        }).on('error', (err) => {
            resolve({ file: filePath, valid: false, error: err.message });
        });
    });
}

async function main() {
    const featuresDir = path.join(__dirname, '..', 'docs', 'features');
    const pumlFiles = [];

    function findPumlFiles(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                findPumlFiles(fullPath);
            } else if (file.endsWith('.puml')) {
                pumlFiles.push(fullPath);
            }
        }
    }

    findPumlFiles(featuresDir);

    console.log(`Found ${pumlFiles.length} PlantUML files to validate...\n`);

    const results = [];
    for (const file of pumlFiles) {
        const result = await validateDiagram(file);
        results.push(result);
        const status = result.valid ? '✓' : '✗';
        const relativePath = path.relative(process.cwd(), file);
        console.log(`${status} ${relativePath}${result.error ? ` - ${result.error}` : ''}`);
    }

    const validCount = results.filter(r => r.valid).length;
    console.log(`\nValidation complete: ${validCount}/${results.length} diagrams valid`);

    if (validCount < results.length) {
        process.exit(1);
    }
}

main().catch(console.error);
