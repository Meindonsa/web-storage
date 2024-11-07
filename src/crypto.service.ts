import * as crypto from "crypto-js";
import LZString from "lz-string";

export class CryptoService {
    encrypt(data: any, secretKey: string): string {
        try {
            const encryptedData = crypto.AES.encrypt(JSON.stringify(data), secretKey, {
                keySize: 256 / 32,
                mode: crypto.mode.CBC,
                padding: crypto.pad.Pkcs7,
            }).toString();
            return LZString.compressToUTF16(encryptedData);
        } catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    decrypt(encryptedData: string, secretKey: string): any {
        try {
            const decompressedData = LZString.decompressFromUTF16(encryptedData);
            if (!decompressedData) {
                console.error("Decompression failed, data is null or empty");
                throw new Error("Decompression failed");
            }
            const originalData = crypto.AES.decrypt(decompressedData, secretKey, {
                keySize: 256 / 32,
                mode: crypto.mode.CBC,
                padding: crypto.pad.Pkcs7,
            }).toString(crypto.enc.Utf8);

            if (!originalData) {
                console.error("Decryption failed, possibly due to incorrect key");
                throw new Error("Decryption failed");
            }
            return JSON.parse(originalData);
        } catch (error) {
            console.error("Decryption error:", error);
            throw error;
        }
    }

    generateRandomKey(length: number = 60): string {
        const randomBytes = crypto.lib.WordArray.random(length / 2);
        return crypto.enc.Hex.stringify(randomBytes);
    }
}