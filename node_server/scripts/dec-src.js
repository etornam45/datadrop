const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Ensure the ENCRYPTION_KEY is set
const SECRET_KEY = process.env.ENCRYPTION_KEY;
if (!SECRET_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
}

// Hash the secret key to ensure it's always the correct length
const HASHED_KEY = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);

function encrypt(text) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(HASHED_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { 
            iv: iv.toString('hex'), 
            encryptedData: encrypted.toString('hex') 
        };
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
}

function encryptFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const encrypted = encrypt(content);
        fs.writeFileSync(filePath + '.enc', JSON.stringify(encrypted));
        console.log(`Encrypted ${filePath}`);
    } catch (error) {
        console.error(`Error encrypting ${filePath}:`, error);
    }
}

function walkDir(dir) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (stat.isFile() && path.extname(file) === '.ts' && file !== 'decrypt.ts') {
                encryptFile(filePath);
            }
        });
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }
}

// Main execution
try {
    const srcDir = path.join(process.cwd(), 'node_server/src');
    walkDir(srcDir);
    console.log('Encryption process completed successfully.');
} catch (error) {
    console.error('An error occurred during the encryption process:', error);
    process.exit(1);
}