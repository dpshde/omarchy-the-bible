// Generated from /workspace/src/route.ts. Do not edit by hand.
.pragma library
function objectFromEntries(entries) {
  var obj = {};
  if (!entries) return obj;
  var list = [];
  if (typeof entries.length === "number") {
    for (var i = 0; i < entries.length; i++) list.push(entries[i]);
  } else if (entries.forEach) {
    entries.forEach(function(item) { list.push(item); });
  }
  for (var j = 0; j < list.length; j++) {
    var pair = list[j];
    if (pair) obj[pair[0]] = pair[1];
  }
  return obj;
}
var RouteApi = (function() {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/route.ts
  var route_exports = {};
  __export(route_exports, {
    BROWSER_HOSTS: () => BROWSER_HOSTS,
    MARGIN_BASE: () => MARGIN_BASE,
    ROUTE_BASE: () => ROUTE_BASE,
    ROUTE_SRC: () => ROUTE_SRC,
    ROUTE_UTM_MEDIUM: () => ROUTE_UTM_MEDIUM,
    isAllowedBrowserUrl: () => isAllowedBrowserUrl,
    marginUrl: () => marginUrl,
    routeUrl: () => routeUrl
  });
  var ROUTE_BASE = "https://route.bible";
  var ROUTE_SRC = "route_bible_omarchy";
  var ROUTE_UTM_MEDIUM = "omarchy_plugin";
  var MARGIN_BASE = "https://margin.bible";
  var BROWSER_HOSTS = /* @__PURE__ */ new Set(["route.bible", "margin.bible"]);
  function slugFor(canonical) {
    return String(canonical || "").trim().toLowerCase().replace(/^\/+/, "");
  }
  function routeQuery() {
    return `src=${ROUTE_SRC}&utm_source=${ROUTE_SRC}&utm_medium=${ROUTE_UTM_MEDIUM}`;
  }
  function routeUrl(canonical) {
    const slug = slugFor(canonical);
    const query = routeQuery();
    if (!slug) return `${ROUTE_BASE}/?${query}`;
    return `${ROUTE_BASE}/${encodeURIComponent(slug)}?${query}`;
  }
  function marginUrl(canonical) {
    const slug = slugFor(canonical);
    if (!slug) return MARGIN_BASE;
    return `${MARGIN_BASE}/${encodeURIComponent(slug)}`;
  }
  function isAllowedBrowserUrl(url) {
    if (typeof url !== "string" || url.length > 2048) return false;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") return false;
      if (parsed.username || parsed.password) return false;
      return BROWSER_HOSTS.has(parsed.hostname.toLowerCase());
    } catch (e) {
      return false;
    }
  }
  return __toCommonJS(route_exports);
})();

function routeUrl() { return RouteApi.routeUrl.apply(null, arguments); }
function marginUrl() { return RouteApi.marginUrl.apply(null, arguments); }
function isAllowedBrowserUrl() { return RouteApi.isAllowedBrowserUrl.apply(null, arguments); }
