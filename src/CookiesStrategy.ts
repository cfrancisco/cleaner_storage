import { StorageStrategy, StorageTypes } from "./types";

export class CookiesStrategy implements StorageStrategy {
  public type = StorageTypes.cookies;
  public storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  sanitizeItem = (key: string) => {
    console.log("[" + this.type + "] Cleaning key:", key);
    this.storage.deleteCookie(key);
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
    this.storage.setCookie(key, JSON.stringify(newValue), ttl);
    callbackToAddItem(key, newValue);
  };

  removeItem = (key: string) => {
    return this.storage.deleteCookie(key);
  };

  getItem = (key: string) => {
    const myItem = this.storage.getCookie(key);
    if (myItem === undefined || myItem == null) return "";
    return JSON.parse(myItem).value;
  };

  // Local Storage schema
  retrieveDataFromStorage = (callbackToAddItem: Function) => {
    console.log("retrieveDataFrom Cookies");
    // Cookies are generally separated by a "; "
    // https://stackoverflow.com/a/4843598/2968465
    const cookieList = document.cookie.split("; ");

    // A key-value pair in the cookie list is separated by a "="
    // We pass a function to cookieList.map that will return
    // an array of tuples, like [key, value]
    const cookieToObjEntry = (cookie: string) => cookie.split("=");
    const cookieEntries = cookieList.map(cookieToObjEntry);

    // Such an array can be passed to Object.fromEntries to
    // obtain an object with all cookie key-value pairs as
    // the keys and values of an object
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
    const asObject = Object.fromEntries(cookieEntries);

    Object.entries(asObject).forEach((el) => {
      const [key, cookie] = el;
      if (cookie === undefined || cookie === null) return;

      const ttl = JSON.parse(cookie as string).ttl;
      const value = JSON.parse(cookie as string).value;
      const createdAt = JSON.parse(cookie as string).createdAt;
      callbackToAddItem(key, { value, ttl, createdAt });
    });

    // So, for a cookies stored as "c1=v1; c2=v2", you'll get
    // an object like `{c1: v1, c2: v2}`
  };

  getEnhancedMethods = (callbackToAddItem: Function) => {
    return {
      getCookie: this.getItem,
      deleteCookie: this.removeItem,
      setCookie: (key: string, value: any, ttl: number) =>
        this.setItem(key, value, ttl, callbackToAddItem),
    };
  };
}
