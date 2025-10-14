const fs = require('fs');
const path = require('path');

let messagesCache = null;
let lastModified = null;

function loadMessages() {
    const messagesPath = path.join(__dirname, '../resources/messages.json');
    
    try {
        const stats = fs.statSync(messagesPath);
        const currentModified = stats.mtime.getTime();

        // load messages if not cached or file has changed
        if (!messagesCache || lastModified !== currentModified) {
            const fileContent = fs.readFileSync(messagesPath, 'utf8');
            messagesCache = JSON.parse(fileContent);
            lastModified = currentModified;
            console.log('Messages reloaded from file');
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        return messagesCache || {};
    }
    
    return messagesCache;
}

function getMessage(key, params = {}) {
    const messages = loadMessages();
    const keys = key.split('.');
    let message = messages;
    
    for (const k of keys) {
        if (message[k] === undefined) {
            return `Message not found: ${key}`;
        }
        message = message[k];
    }
    
    // Interpolación básica de parámetros si es necesario
    if (typeof message === 'string' && Object.keys(params).length > 0) {
        return message.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }
    
    return message;
}

module.exports = { getMessage };