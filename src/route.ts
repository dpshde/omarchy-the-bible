export const ROUTE_BASE = "https://www.route.bible";
export const ROUTE_SRC = "omarchy";
export const MARGIN_BASE = "https://margin.bible";

function slugFor(canonical: string): string {
  return String(canonical || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "");
}

export function routeUrl(canonical: string): string {
  const slug = slugFor(canonical);
  if (!slug) return `${ROUTE_BASE}/?src=${ROUTE_SRC}`;
  return `${ROUTE_BASE}/${encodeURIComponent(slug)}?src=${ROUTE_SRC}`;
}

export function marginUrl(canonical: string): string {
  const slug = slugFor(canonical);
  if (!slug) return MARGIN_BASE;
  return `${MARGIN_BASE}/${encodeURIComponent(slug)}`;
}
