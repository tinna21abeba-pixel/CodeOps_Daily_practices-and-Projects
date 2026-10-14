const numberFormat = new Intl.NumberFormat("en-US");

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const relativeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export function etb(amount) {
  const num = Number(amount) || 0;
  return `${numberFormat.format(num)} ETB`;
}

export function when(date) {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return dateTimeFormat.format(d);
}

export function relative(date) {
  if (!date) return "";
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const diffInSeconds = Math.round((d.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffInSeconds);
  if (abs < 60) return diffInSeconds <= 0 ? "just now" : "in a few seconds";
  if (abs < 3600) return relativeFormat.format(Math.round(diffInSeconds / 60), "minute");
  if (abs < 86400) return relativeFormat.format(Math.round(diffInSeconds / 3600), "hour");
  if (abs < 2592000) return relativeFormat.format(Math.round(diffInSeconds / 86400), "day");
  return relativeFormat.format(Math.round(diffInSeconds / 2592000), "month");
}
