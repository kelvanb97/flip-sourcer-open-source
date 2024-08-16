type LocalVar =
  | "referrer"
  | "isDarkMode"
  | "filters"
  | "sorters"
  | "discounts"
  | "pageSize"
  | "analyticsUUID"
  | "mixpanelHasAliased";

export function setLocalStorageVar(name: LocalVar, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(name, value);
}

export function getLocalStorageVar(name: LocalVar) {
  if (typeof window === "undefined") return;
  return localStorage.getItem(name);
}
