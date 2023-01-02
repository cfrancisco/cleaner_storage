import { StorageStrategy, StorageTypes } from "./types";

export class LocalStorageStrategy implements StorageStrategy {
  public type = StorageTypes.localStorage;
  public storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  sanitizeItem = (key: string) => {
    console.log("[" + this.type + "] Cleaning key:", key);
    this.storage.removeItem(key);
  };

  setItem = (
    key: string,
    value: any,
    ttl: number,
    callbackToAddItem: Function,
  ) => {
    const createdAt = new Date();
    const newValue = {
      value: value,
      ttl: ttl,
      createdAt: createdAt,
    };
    this.storage.setItem(key, JSON.stringify(newValue));
    callbackToAddItem(key, newValue);
  };

  removeItem = (key: string) => {
    return this.storage.removeItem(key);
  };

  getItem = (key: string) => {
    const myItem = this.storage.getItem(key);
    if (myItem === undefined || myItem == null) return "";
    return JSON.parse(myItem).value;
  };

  // Local Storage schema
  retrieveDataFromStorage = (callbackToAddItem: Function) => {
    console.log("retrieveDataFrom LocalStorage");
    for (const key in localStorage) {
      // Skip built-in properties like length, setItem, etc.
      if (localStorage.hasOwnProperty(key)) {
        const myItem = localStorage.getItem(key);
        if (myItem !== null) {
          const ttl = JSON.parse(myItem).ttl;
          const value = JSON.parse(myItem).value;
          const createdAt = JSON.parse(myItem).createdAt;
          callbackToAddItem(key, { value, ttl, createdAt });
        }
      }
    }
  };

  getEnhancedMethods = (callbackToAddItem: Function) => {
    return {
      getItem: this.getItem,
      removeItem: this.removeItem,
      setItem: (key: string, value: any, ttl: number) =>
        this.setItem(key, value, ttl, callbackToAddItem),
    };
  };
}
