# @ossas-web-storage-security

WEB-STORAGE-SECURE is a library generated with `Angular CLI`
Its purpose is to encrypt your data and store it in localStorage.

####

Library use `Crypto-js` to encrypt you data, `Lz-string` to compress data encrypted and save it in localStorage using native `localStorage`

## Requirements

- [Crypto-js](https://www.npmjs.com/package/crypto-js)
- [LZ-String](https://www.npmjs.com/package/lz-string)

## Installation

```bash
npm web-storage-security --save
```

## Usage

#### Import service in your component an declare it in constructor

```typescript
import { WebStorageSecurityService } from "web-storage-security";

...

constructor(private webStorageSecurity: WebStorageSecurityService) {}
```

then, you can use differents methods of service:

- set

Encryptes your data with ecryption secret key and saves it in specifed key and in localStorage. If the key is not provided, the library will warn. Following types of JavaScript objects are supported: `Array`, `Blob`,`Float`,`Number`, `Object` ,`String`

| Parameter               | Description                        |
| :---------------------- | :--------------------------------- |
| `key`                   | key to store data in localStorage  |
| `data`                  | data to store                      |
| `encryption_secret_key` | your key used to encrypt your data |

###

- get

Gets data back from specified key from the localStorage library. If the key is not provided, the library will warn.

| Parameter               | Description                        |
| :---------------------- | :--------------------------------- |
| `key`                   | key to get data from localStorage  |
| `encryption_secret_key` | your key used to decrypt your data |

###

- remove

Removes the value of a key from the localStorage.

| Parameter | Description                                          |
| :-------- | :--------------------------------------------------- |
| `key`     | key to identify data and remove it from localStorage |

###

- remove all

Removes all data from the localStorage, this method don't take parameter

### Example

eg :

```typescript

import { WebStorageSecurityService } from "web-storage-security";

...

constructor(private webStorageSecurity: WebStorageSecurityService) {}

saveData(){
    this.webStorageSecurity.set(key, data,encryption_secret_key);
}

getData(){
    return this.webStorageSecurity.get(key,encryption_secret_key);
}

remove(){
    this.webStorageSecurity.remove(key);
}

removeAll(){
    this.webStorageSecurity.clear();
}

```

## Authors

- [@ossas-it team](https://www.ossas-it.com)

## Support

For support, email contact@ossas-it.com
