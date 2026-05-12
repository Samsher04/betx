export function applyGlobalTimezone(timezone = "Asia/Kolkata") {
  const formatDate = (date, options = {}) =>
    new Intl.DateTimeFormat("en-US", { timeZone: timezone, ...options }).format(date);

  Date.prototype.toLocaleString = function (locale, options) {
    return formatDate(this, options);
  };

  Date.prototype.toLocaleDateString = function (locale, options) {
    return formatDate(this, { year: "numeric", month: "2-digit", day: "2-digit", ...options });
  };

  Date.prototype.toLocaleTimeString = function (locale, options) {
    return formatDate(this, { hour: "2-digit", minute: "2-digit", second: "2-digit", ...options });
  };

  console.log(`✅ Global timezone applied: ${timezone}`);
}
