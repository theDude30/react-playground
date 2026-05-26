import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://api.restful-api.dev';

export function useRestClient<T>(path: string) {
  return useQuery<T>({
    queryKey: ['rest', path],
    queryFn: async ({ signal }) => {
      const res = await fetch(`${BASE_URL}${path}`, { signal });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as T;
    },
  });
}
