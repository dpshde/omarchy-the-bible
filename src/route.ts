export const ROUTE_BASE = "https://www.route.bible";
export const ROUTE_SRC = "omarchy";

export function routeUrl(canonical: string): string {
  const slug = String(canonical || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "");
  if (!slug) return `${ROUTE_BASE}/?src=${ROUTE_SRC}`;
  return `${ROUTE_BASE}/${encodeURIComponent(slug)}?src=${ROUTE_SRC}`;
}
