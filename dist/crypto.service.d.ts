export declare class CryptoService {
    encrypt(data: any, secretKey: string): string;
    decrypt(encryptedData: string, secretKey: string): any;
    generateRandomKey(length?: number): string;
}
