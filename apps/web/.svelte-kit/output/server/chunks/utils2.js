function timeAgo(date) {
  const seconds = Math.floor(((/* @__PURE__ */ new Date()).getTime() - date.getTime()) / 1e3);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
function rewriteAffiliateUrl(url, affiliateTag) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("amazon.")) {
      parsed.searchParams.set("tag", affiliateTag);
      return parsed.toString();
    }
  } catch {
  }
  return url;
}
function formatPrice(price) {
  if (price === null || price === void 0 || price === "") return "Free";
  return `$${Number(price).toFixed(2)}`;
}
function formatDiscount(price, originalPrice) {
  if (!price || !originalPrice) return null;
  const p = Number(price);
  const op = Number(originalPrice);
  if (op <= p) return null;
  const pct = Math.round((op - p) / op * 100);
  return `${pct}% off`;
}
export {
  formatDiscount as a,
  formatPrice as f,
  rewriteAffiliateUrl as r,
  timeAgo as t
};
