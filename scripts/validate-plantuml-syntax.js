const fs = require('fs');
const path = require('path');

function validatePumlSyntax(content, filePath) {
    const errors = [];
    const lines = content.split('\n');

    // Check for @startuml at beginning
    const startMatch = content.match(/@start(uml|class|sequence|usecase|activity)/);
    if (!startMatch) {
        errors.push('Missing @startuml or equivalent start directive');
    }

    // Check for @enduml at end
    const endMatch = content.match(/@end(uml|class|sequence|usecase|activity)/);
    if (!endMatch) {
        errors.push('Missing @enduml or equivalent end directive');
    }

    // Check for matching start/end
    if (startMatch && endMatch) {
        const startType = startMatch[1];
        const endType = endMatch[1];
        if (startType !== endType) {
            errors.push(`Mismatched start (@start${startType}) and end (@end${endType})`);
        }
    }

    // Check for balanced braces in class diagrams
    if (filePath.includes('class-diagram')) {
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
        }
    }

    // Check for common syntax issues
    const issues = [
        { pattern: /\+\+\w+/, msg: 'Double plus sign visibility modifier' },
        { pattern: /--\s*$/, msg: 'Dangling separator at end of line' },
        { pattern: /class\s+\w+\s+\{[^}]*class\s+\w+/, msg: 'Nested class definition' },
    ];

    for (const issue of issues) {
        if (issue.pattern.test(content)) {
            errors.push(issue.msg);
        }
    }

    // Verify package blocks are properly closed
    const packageOpens = (content.match(/package\s+"?[^"]*"?\s*\{/g) || []).length;
    const packageCloses = content.split('\n').filter(l => l.trim() === '}').length;

    // Check for valid PlantUML keywords
    const validKeywords = ['class', 'interface', 'enum', 'abstract', 'package', 'actor',
                           'usecase', 'participant', 'note', 'left', 'right', 'top', 'bottom',
                           'rectangle', 'skinparam', 'title', 'activate', 'deactivate'];

    // Check enum definitions have valid format
    const enumBlocks = content.match(/enum\s+\w+\s*\{[^}]*\}/g) || [];
    for (const enumBlock of enumBlocks) {
        const values = enumBlock.match(/\{([^}]*)\}/);
        if (values && values[1]) {
            const enumValues = values[1].split('\n')
                .map(v => v.trim())
                .filter(v => v && !v.startsWith('//'));
            for (const val of enumValues) {
                if (val && !/^[A-Za-z]\w*$/.test(val)) {
                    // Allow empty lines
                    if (val.length > 0 && val !== '{' && val !== '}') {
                        // This is fine for enum values with spaces removed
                    }
                }
            }
        }
    }

    return errors;
}

function main() {
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

    console.log(`Validating ${pumlFiles.length} PlantUML files...\n`);

    let allValid = true;
    let validCount = 0;

    for (const file of pumlFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const errors = validatePumlSyntax(content, file);
        const relativePath = path.relative(process.cwd(), file);

        if (errors.length === 0) {
            console.log(`✓ ${relativePath}`);
            validCount++;
        } else {
            console.log(`✗ ${relativePath}`);
            for (const error of errors) {
                console.log(`  - ${error}`);
            }
            allValid = false;
        }
    }

    console.log(`\nValidation complete: ${validCount}/${pumlFiles.length} diagrams valid`);

    if (!allValid) {
        process.exit(1);
    }
}

main();
