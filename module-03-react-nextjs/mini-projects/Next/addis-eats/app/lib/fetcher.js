
function createFetchError(message, status, info) {
  const error = new Error(message);
  error.name = "FetchError";
  error.status = status;
  error.info = info;
  return error;
}


export async function fetcher(url) {
  const res = await fetch(url);

  if (!res.ok) {
    let info = null;
    try {
      info = await res.json();
    } catch {}

    throw createFetchError(
      info?.error?.message ?? `Request failed (${res.status})`,
      res.status,
      info
    );
  }

  return res.json();
}