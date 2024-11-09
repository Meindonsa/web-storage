import { CryptoService } from "./crypto.service";
import { Constant } from "./constant";

export class WebStorageService {
    private cryptoService: CryptoService;

    constructor() {
        this.cryptoService = new CryptoService();
    }

    set(key: string, data: any): void {
        try {
            const secretKey = Constant.base_key;
            const encryptedData = this.cryptoService.encrypt(data, secretKey);
            localStorage.setItem(key, encryptedData);
        } catch (error) {
            console.error(`Failed to set item for key "${key}":`, error);
        }
    }

    get(key: string): any {
        try {
            const secretKey = Constant.base_key;
            const encryptedData = localStorage.getItem(key);
            if (!encryptedData) return null;

            return this.cryptoService.decrypt(encryptedData, secretKey);
        } catch (error) {
            console.error(`Failed to get item for key "${key}":`, error);
            return null;
        }
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    removeAll(): void {
        localStorage.clear();
    }
}
