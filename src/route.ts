export const ROUTE_BASE = "https://route.bible";
export const ROUTE_SRC = "route_bible_omarchy";
export const ROUTE_UTM_MEDIUM = "omarchy_plugin";
export const MARGIN_BASE = "https://margin.bible";
export const BROWSER_HOSTS = new Set(["route.bible", "margin.bible"]);

function slugFor(canonical: string): string {
  return String(canonical || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "");
}

function routeQuery(): string {
  return `src=${ROUTE_SRC}&utm_source=${ROUTE_SRC}&utm_medium=${ROUTE_UTM_MEDIUM}`;
}

export function routeUrl(canonical: string): string {
  const slug = slugFor(canonical);
  const query = routeQuery();
  if (!slug) return `${ROUTE_BASE}/?${query}`;
  return `${ROUTE_BASE}/${encodeURIComponent(slug)}?${query}`;
}

export function marginUrl(canonical: string): string {
  const slug = slugFor(canonical);
  if (!slug) return MARGIN_BASE;
  return `${MARGIN_BASE}/${encodeURIComponent(slug)}`;
}

export function isAllowedBrowserUrl(url: string): boolean {
  if (typeof url !== "string" || url.length > 2048) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    if (parsed.username || parsed.password) return false;
    return BROWSER_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}
