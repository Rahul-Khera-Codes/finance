import {Injectable} from '@angular/core';
@Injectable()
export class StorageService {
    constructor() {}
    getLocaldata(getItem) {
        return localStorage.getItem(getItem);
    }
    setLocalData(key, setItem) {
        localStorage.setItem(key, setItem);
    }
    removeItem(value) {
        localStorage.removeItem(value);
    }
}
