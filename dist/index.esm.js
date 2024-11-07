import * as crypto from 'crypto-js';
import LZString from 'lz-string';

var CryptoService = /** @class */function () {
  function CryptoService() {}
  CryptoService.prototype.encrypt = function (data, secretKey) {
    try {
      var encryptedData = crypto.AES.encrypt(JSON.stringify(data), secretKey, {
        keySize: 256 / 32,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
      }).toString();
      return LZString.compressToUTF16(encryptedData);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };
  CryptoService.prototype.decrypt = function (encryptedData, secretKey) {
    try {
      var decompressedData = LZString.decompressFromUTF16(encryptedData);
      if (!decompressedData) {
        console.error("Decompression failed, data is null or empty");
        throw new Error("Decompression failed");
      }
      var originalData = crypto.AES.decrypt(decompressedData, secretKey, {
        keySize: 256 / 32,
        mode: crypto.mode.CBC,
        padding: crypto.pad.Pkcs7
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
  };
  CryptoService.prototype.generateRandomKey = function (length) {
    if (length === void 0) {
      length = 60;
    }
    var randomBytes = crypto.lib.WordArray.random(length / 2);
    return crypto.enc.Hex.stringify(randomBytes);
  };
  return CryptoService;
}();

var Constant = {
  keys_name: "_secure_storage",
  base_key: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#abcdefghijklmnopqrstuvwxyz@0123456789",
  iv: "8f3e5abe9f0406905fd09f8e8d5b30d8"
};

var WebStorageService = /** @class */function () {
  function WebStorageService() {
    this.metaData = null;
    this.cryptoService = new CryptoService();
    this._init();
  }
  WebStorageService.prototype._init = function () {
    var metaData = {
      _keyStr: this.cryptoService.generateRandomKey(),
      array: null
    };
    var object = localStorage.getItem(Constant.keys_name) || null;
    if (!object) {
      var encrypted = this.cryptoService.encrypt(metaData, Constant.base_key);
      if (encrypted) localStorage.setItem(Constant.keys_name, encrypted);
    }
  };
  WebStorageService.prototype._getMetaData = function () {
    var object = localStorage.getItem(Constant.keys_name);
    if (!object) {
      console.error("Metadata not found in localStorage.");
      return null;
    }
    return this.cryptoService.decrypt(object, Constant.base_key);
  };
  WebStorageService.prototype.set = function (key, data, secretKey) {
    if (secretKey === void 0) {
      secretKey = null;
    }
    this.metaData = this._getMetaData();
    if (!this.metaData || !this.metaData._keyStr) {
      console.error("Meta data is missing or invalid.");
      return;
    }
    var encryptedKey = secretKey !== null && secretKey !== void 0 ? secretKey : this.metaData._keyStr;
    var dataKey = this.cryptoService.generateRandomKey();
    var encryptedData = this.cryptoService.encrypt(data, dataKey);
    if (encryptedData) {
      this.updateMetaData(dataKey, encryptedKey, key);
      localStorage.setItem(key, encryptedData);
    }
  };
  WebStorageService.prototype.updateMetaData = function (dataKey, encryptedKey, key) {
    var array = new Map();
    if (this.metaData.array == null) {
      array.set(key, dataKey);
    } else {
      var list = this.decryptArray(this.metaData.array, encryptedKey);
      if (list) {
        array = new Map(list);
      }
      array.set(key, dataKey);
    }
    var encryptedArray = this.encryptArray(Array.from(array), encryptedKey);
    this.metaData.array = encryptedArray;
    this.metaData = this.encryptMetaData(this.metaData, Constant.base_key);
    localStorage.setItem(Constant.keys_name, this.metaData);
    this.metaData = null;
  };
  WebStorageService.prototype.get = function (key, secretKey) {
    if (secretKey === void 0) {
      secretKey = null;
    }
    this.metaData = this._getMetaData();
    if (!this.metaData) {
      console.error("Failed to retrieve meta data.");
      return null;
    }
    var encryptedKey = secretKey !== null && secretKey !== void 0 ? secretKey : this.metaData._keyStr;
    var array = this.getArray(encryptedKey);
    if (!array || array.size === 0) return null;
    var encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;
    this.metaData = null;
    var dataKey = array.get(key);
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
  };
  WebStorageService.prototype.remove = function (key) {
    localStorage.removeItem(key);
  };
  WebStorageService.prototype.removeAll = function () {
    localStorage.clear();
  };
  WebStorageService.prototype.getArray = function (encryptionKey) {
    var array = new Map();
    if (this.metaData.array == null) {
      return array;
    }
    var arrayList = this.decryptArray(this.metaData.array, encryptionKey);
    if (arrayList) {
      array = new Map(arrayList);
    }
    return array;
  };
  WebStorageService.prototype.encryptArray = function (data, key) {
    var metaData = this._getMetaData();
    if (!metaData) return "";
    return this.cryptoService.encrypt(data, key);
  };
  WebStorageService.prototype.decryptArray = function (data, key) {
    var metaData = this._getMetaData();
    if (!metaData) return [];
    return this.cryptoService.decrypt(data, key);
  };
  WebStorageService.prototype.encryptMetaData = function (data, key) {
    return this.cryptoService.encrypt(data, key);
  };
  return WebStorageService;
}();

export { Constant, CryptoService, WebStorageService };
//# sourceMappingURL=index.esm.js.map
