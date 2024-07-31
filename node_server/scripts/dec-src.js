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

function decrypt(text) {
    try {
        let { iv, encryptedData } = JSON.parse(text);
        iv = Buffer.from(iv, 'hex');
        let encryptedText = Buffer.from(encryptedData, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(HASHED_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
}

function decryptFile(filePath) {
    try {
        const encryptedContent = fs.readFileSync(filePath, 'utf8');
        const decrypted = decrypt(encryptedContent);
        const originalFilePath = filePath.slice(0, -4); // Remove '.enc' extension
        fs.writeFileSync(originalFilePath, decrypted);
        console.log(`Decrypted ${filePath}`);
    } catch (error) {
        console.error(`Error decrypting ${filePath}:`, error);
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
            } else if (stat.isFile() && path.extname(file) === '.enc') {
                decryptFile(filePath);
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
    console.log('Decryption process completed successfully.');
} catch (error) {
    console.error('An error occurred during the decryption process:', error);
    process.exit(1);
}