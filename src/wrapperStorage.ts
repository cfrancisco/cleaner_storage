import {
  ArrayWithSortedObject,
  ArrayObjectType,
} from "./ArrayWithSortedObject";
import { StoragedObjectType, StorageStrategy } from "./types";

export class WrapperStorage {
  private strategy: StorageStrategy;
  private currentList = ArrayWithSortedObject();
  private lastTimeout: any;
  private defaultTimerInMs = 5000;

  /** Setting the current storage service and asks to it to retrieve
   * the already storage data */
  constructor(_strategy: StorageStrategy) {
    this.strategy = _strategy;
    this.strategy.retrieveDataFromStorage(this.addItemToList);

    console.log(
      "[" + this.strategy.type + "] >>> init. Loop in: ",
      this.defaultTimerInMs,
    );

    this.lastTimeout = setTimeout(() => {
      let r = (Math.random() + 1).toString(36).substring(7);
      console.log(
        "[" +
          this.strategy.type +
          "] Running cleaner for the first Time ID (" +
          r +
          ")",
      );
      this.checkNextElement(r);
    }, this.defaultTimerInMs);
  }

  addItemToList = (key: string, data: StoragedObjectType["data"]) => {
    const { value, ttl, createdAt } = data;
    if (ttl === undefined && createdAt === undefined) return;

    const ed = new Date(createdAt);
    ed.setSeconds(ed.getSeconds() + ttl);
    const expirationDate = ed.getTime();

    this.currentList.push({ key, value, expirationDate });
  };

  clearLoop = () => {
    clearTimeout(this.lastTimeout);
  };

  checkExpiration = (data: ArrayObjectType) => {
    console.log("[" + this.strategy.type + "] Checking element: ", data);

    const currentTs = new Date().getTime();
    if (data.expirationDate <= currentTs) {
      this.strategy.sanitizeItem(data.key);
      this.currentList.removeFirstItem();
      return true;
    }
    return false;
  };

  checkNextElement = (id: string) => {
    const data = this.currentList.top();
    if (data === undefined) {
      console.log("[" + this.strategy.type + "] No data for now. ");
      this.nextLoop(this.defaultTimerInMs, id);
      return;
    }
    const wasRemoved = this.checkExpiration(data);
    if (wasRemoved) {
      console.log(
        "[" + this.strategy.type + "] Element Removed. Array length: ",
        this.currentList.getLength(),
        " ID (" + id + ")",
      );
      this.checkNextElement(id);
    } else {
      const currentTs = new Date().getTime();
      const nextInMs = data.expirationDate - currentTs + 100;
      console.log(
        "[" +
          this.strategy.type +
          "] Loop encerrado. Proxima expiração em:" +
          nextInMs,
      );
      this.nextLoop(nextInMs, id);
    }
  };

  nextLoop = (timer: number, id: string) => {
    console.log(
      "[" + this.strategy.type + "] >>> NextLoop em: ",
      timer + " ID (" + id + ")",
    );
    // just to be sure
    this.clearLoop();

    this.lastTimeout = setTimeout(() => {
      this.checkNextElement(id);
    }, timer);
  };

  // Works as a Proxy
  getStorage = () => {
    return this.strategy.getEnhancedMethods(this.addItemToList);
  };
}
