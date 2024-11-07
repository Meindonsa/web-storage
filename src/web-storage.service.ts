import { CryptoService } from "./crypto.service";
import { Constant } from "./constant";

export class WebStorageService {
    private cryptoService: CryptoService;
    private metaData: any = null;

    constructor() {
        this.cryptoService = new CryptoService();
        this._init();
    }

    private _init() {
        let metaData = {
            _keyStr: this.cryptoService.generateRandomKey(),
            array: null,
        };
        const object: any = localStorage.getItem(Constant.keys_name) || null;
        if (!object) {
            const encrypted: any = this.cryptoService.encrypt(metaData, Constant.base_key);
            if (encrypted) localStorage.setItem(Constant.keys_name, encrypted);
        }
    }

    private _getMetaData() {
        const object: any = localStorage.getItem(Constant.keys_name);
        if (!object) {
            console.error("Metadata not found in localStorage.");
            return null;
        }
        return this.cryptoService.decrypt(object, Constant.base_key);
    }

    set(key: string, data: any, secretKey: string | null = null): void {
        this.metaData = this._getMetaData();
        if (!this.metaData || !this.metaData._keyStr) {
            console.error("Meta data is missing or invalid.");
            return;
        }

        const encryptedKey = secretKey ?? this.metaData._keyStr;
        const dataKey = this.cryptoService.generateRandomKey();
        const encryptedData = this.cryptoService.encrypt(data, dataKey);

        if (encryptedData) {
            this.updateMetaData(dataKey, encryptedKey, key);
            localStorage.setItem(key, encryptedData);
        }
    }

    private updateMetaData(dataKey: string, encryptedKey: string, key: string) {
        let array = new Map<string, string>();
        if (this.metaData.array == null) {
            array.set(key, dataKey);
        } else {
            const list: [string, string][] = this.decryptArray(this.metaData.array, encryptedKey);
            if (list) {
                array = new Map(list);
            }
            array.set(key, dataKey);
        }

        const encryptedArray = this.encryptArray(Array.from(array), encryptedKey);
        this.metaData.array = encryptedArray;
        this.metaData = this.encryptMetaData(this.metaData, Constant.base_key);
        localStorage.setItem(Constant.keys_name, this.metaData);
        this.metaData = null;
    }

    get(key: any, secretKey: string | null = null): any {
        this.metaData = this._getMetaData();
        if (!this.metaData) {
            console.error("Failed to retrieve meta data.");
            return null;
        }

        const encryptedKey = secretKey ?? this.metaData._keyStr;
        const array = this.getArray(encryptedKey);

        if (!array || array.size === 0) return null;

        const encryptedData = localStorage.getItem(key);
        if (!encryptedData) return null;

        this.metaData = null;
        const dataKey = array.get(key);

        if (!dataKey) {
            console.error("Data key not found in array.");
            return null;
        }

        try {
            return this.cryptoService.decrypt(encryptedData, dataKey);
        } catch (err) {
            console.error("Decryption error:", err);
            throw err;
        }
    }

    remove(key: any): void {
        localStorage.removeItem(key);
    }

    removeAll(): void {
        localStorage.clear();
    }

    private getArray(encryptionKey: string): Map<string, string> {
        let array = new Map<string, string>();
        if (this.metaData.array == null) {
            return array;
        }
        const arrayList = this.decryptArray(this.metaData.array, encryptionKey);
        if (arrayList) {
            array = new Map(arrayList);
        }
        return array;
    }

    private encryptArray(data: any, key: string): string {
        const metaData = this._getMetaData();
        if (!metaData) return "";
        return this.cryptoService.encrypt(data, key);
    }

    private decryptArray(data: any, key: string): [string, string][] {
        const metaData = this._getMetaData();
        if (!metaData) return [];
        return this.cryptoService.decrypt(data, key) as [string, string][];
    }

    private encryptMetaData(data: any, key: string): string {
        return this.cryptoService.encrypt(data, key);
    }
}