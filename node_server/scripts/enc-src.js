const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key';
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function encryptFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const encrypted = encrypt(content);
    fs.writeFileSync(filePath + '.enc', encrypted);
    console.log(`Encrypted ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (stat.isFile() && path.extname(file) === '.ts') {
            encryptFile(filePath);
        }
    });
}

const srcDir = path.join(process.cwd(), 'src');
walkDir(srcDir);