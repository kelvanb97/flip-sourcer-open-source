type Cookies = "s" | "referrer" | "c";

export function setCookie(cname: Cookies, cvalue: string, days = 365): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname: Cookies): string {
  const name = `${cname}=`;
  const cookiesArray = decodeURIComponent(document.cookie).split(";");

  for (const cookie of cookiesArray) {
    const c = cookie.trim();
    if (c.startsWith(name)) {
      return c.slice(name.length);
    }
  }

  return "";
}

export function deleteCookie(cname: Cookies): void {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
