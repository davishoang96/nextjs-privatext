import crypto from 'crypto'
 
export const messageService = {
    async encryptMessage(message: string): Promise<{ encrypted: string; key: string }> {
        // Generate a random 256-bit (32-byte) encryption key
        const key = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
        const keyHex = Array.from(key).map(byte => byte.toString(16).padStart(2, '0')).join('');
    
        // Encode the message as bytes
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
    
        // Generate a random initialization vector (IV) for AES-GCM
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
        const ivHex = Array.from(iv).map(byte => byte.toString(16).padStart(2, '0')).join('');
    
        // Encrypt the message
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            key,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt"]
        );
        const encryptedBytes = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            cryptoKey,
            messageBytes
        );
    
        // Convert the encrypted bytes to a base64 string
        const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBytes)));
    
        return {
            encrypted: `${ivHex}:${encryptedBase64}`, // Combine IV and encrypted data
            key: keyHex,
        };
    }
}