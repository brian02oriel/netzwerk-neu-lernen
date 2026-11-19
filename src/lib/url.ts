/** Configured `base` without trailing slash ("" when deployed at the root). */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an absolute internal path ("/verben", "/kapitel/x#y") with the site base. */
export const url = (path: string) => `${BASE}${path}`;

/** Inverse of `url`: turn a full pathname back into a base-relative one. */
export const stripBase = (pathname: string) =>
  BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || "/" : pathname;
