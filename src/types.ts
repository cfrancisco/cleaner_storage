export enum StorageTypes {
  localStorage = "localStorage",
  cookies = "cookies",
}

export type StoragedObjectType = {
  key: string;
  data: {
    value: any;
    ttl: number;
    createdAt: Date;
  };
};

export interface StorageStrategy {
  type: StorageTypes;

  removeItem(key: string): void;
  getItem(key: string): any;
  setItem(
    key: string,
    value: any,
    ttl: number,
    callbackToAddItem: Function,
  ): any;

  getEnhancedMethods(callbackToAddItem: Function): any;
  sanitizeItem(key: string): void;
  retrieveDataFromStorage(callbackToAddItem: Function): void;
}
