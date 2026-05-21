import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export async function post(path: string, body?: unknown) {
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    credentials: "include",
    ...(body
      ? {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
      : {}),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw Object.assign(new Error(json.error ?? res.statusText), {
      status: res.status,
    });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
