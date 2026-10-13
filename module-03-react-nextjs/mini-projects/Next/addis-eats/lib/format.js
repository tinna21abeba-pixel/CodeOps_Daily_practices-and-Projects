export function etb(amount) {
  const num = Number(amount) || 0;
  return `${num.toLocaleString()} ETB`;
}

export function when(date) {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relative(date) {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const diffInSeconds = Math.round((d.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const abs = Math.abs(diffInSeconds);
  if (abs < 60) return diffInSeconds <= 0 ? "just now" : "in a few seconds";
  if (abs < 3600) return rtf.format(Math.round(diffInSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffInSeconds / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffInSeconds / 86400), "day");
  return rtf.format(Math.round(diffInSeconds / 2592000), "month");
}
