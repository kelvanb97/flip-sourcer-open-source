import { getLocalStorageVar, setLocalStorageVar } from "../localstorage";
import { v4 as uuidv4 } from "uuid";

export function getAnalyticsUUID(): string {
  let analyticsUUID = getLocalStorageVar("analyticsUUID") as string;
  if (!analyticsUUID) {
    analyticsUUID = uuidv4();
    setLocalStorageVar("analyticsUUID", analyticsUUID);
  }
  return analyticsUUID;
}
