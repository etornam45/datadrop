const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key';

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function decryptFile(filePath) {
    const encryptedContent = fs.readFileSync(filePath, 'utf8');
    const decrypted = decrypt(encryptedContent);
    const originalPath = filePath.slice(0, -4); // Remove '.enc'
    fs.writeFileSync(originalPath, decrypted);
    console.log(`Decrypted ${filePath}`);
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (stat.isFile() && path.extname(file) === '.enc') {
            decryptFile(filePath);
        }
    });
}

const srcDir = path.join(process.cwd(), 'src');
walkDir(srcDir);