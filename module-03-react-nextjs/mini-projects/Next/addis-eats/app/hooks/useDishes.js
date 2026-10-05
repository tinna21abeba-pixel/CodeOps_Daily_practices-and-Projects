import useSWR from "swr";

export const PAGE_SIZE = 4;


export function useDishes({ category = "All", page = 1 }) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (category && category !== "All") params.set("category", category);

  return useSWR(`/api/dishes?${params}`, {
    keepPreviousData: true,  
    revalidateOnFocus: false, 
    dedupingInterval: 60_000, 
  });
}


export function useDishSearch(term) {
  const clean = term.trim();
  const key = clean ? `/api/dishes?q=${encodeURIComponent(clean)}` : null;

  return useSWR(key, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });
}