import Cookies from "./cookies";
import { CookiesStrategy } from "./CookiesStrategy";
import { LocalStorageStrategy } from "./LocalStorageStrategy";
import { StorageTypes } from "./types";
import { WrapperStorage } from "./wrapperStorage";

// act as a factory?
const SanitizeService = () => {
  let currentStorages: WrapperStorage[] = [];

  const createStorageWithSanitazer = (storage: any, type: StorageTypes) => {
    console.log(">> createStorageWithSanitazer: ", type);
    let myStrategy;
    if (type === StorageTypes.localStorage) {
      myStrategy = new LocalStorageStrategy(storage);
    } else if (type === StorageTypes.cookies) {
      myStrategy = new CookiesStrategy(storage);
    } else {
      //TODO: we should create a generic Storage Strategy?
      myStrategy = new LocalStorageStrategy(storage);
    }
    const genericStorage = new WrapperStorage(myStrategy);
    currentStorages.push(genericStorage);

    return genericStorage.getStorage();
  };

  return { createStorageWithSanitazer };
};

const proxySingleton = SanitizeService();

// newLocalStorage Que limpa o localstorage
const newLocalStorage = proxySingleton.createStorageWithSanitazer(
  localStorage,
  StorageTypes.localStorage,
);

// newCookies que limpa coookies
const newCookies = proxySingleton.createStorageWithSanitazer(
  Cookies,
  StorageTypes.cookies,
);

// TODO:
// limpei o local storage manualmetne, o que acontece?

export { proxySingleton, newLocalStorage, newCookies };
