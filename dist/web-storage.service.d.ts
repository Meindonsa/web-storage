export declare class WebStorageService {
    private cryptoService;
    private metaData;
    constructor();
    private _init;
    private _getMetaData;
    set(key: string, data: any, secretKey?: string | null): void;
    private updateMetaData;
    get(key: any, secretKey?: string | null): any;
    remove(key: any): void;
    removeAll(): void;
    private getArray;
    private encryptArray;
    private decryptArray;
    private encryptMetaData;
}
