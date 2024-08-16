import { logout } from "./auth";
import { getCookie } from "./cookies";
import { apiBase } from "./envVars";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiCallProps {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  isSessionRequest?: boolean;
  logoutRedirect?: string;
  softError?: boolean;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function apiCall<
  T = unknown & { status: number; message: string }
>(
  route: string,
  {
    method = "GET",
    headers = { "Content-Type": "application/json" },
    body,
    isSessionRequest = false,
    logoutRedirect = "/",
    softError = false,
  }: ApiCallProps
): Promise<T | void> {
  try {
    const sessionToken = getCookie("s");
    headers = {
      ...headers,
      ...(isSessionRequest ? { Authorization: `Bearer ${sessionToken}` } : {}),
    };
    body = body ? JSON.stringify(body) : null;

    const res = await fetch(`${apiBase}${route}`, { method, headers, body });
    const json: T & { error: string } = await res.json();

    if (json.error) throw new Error(json.error);

    return json;
  } catch (error) {
    if (softError) {
      console.log("soft error");
      return;
    }
    if (isSessionRequest) {
      return logout(logoutRedirect);
    }
  }
}
