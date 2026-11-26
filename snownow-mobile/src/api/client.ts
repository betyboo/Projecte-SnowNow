// URL base del backend. Es defineix a snownow-mobile/.env (veure .env.example).
// Des del mòbil, "localhost" és el propi telèfon: cal posar la IP local del PC.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

// Totes les respostes del backend segueixen el format { success, data | error }
type ApiResponse<T> = ({ success: true; data: T } & Record<string, unknown>) | { success: false; error: string };

// Respostes paginades (p. ex. /api/resorts/search): a més de data porten el total
export interface Page<T> {
  data: T;
  total: number;
  page: number;
  pages: number;
}

async function request<T>(path: string) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error(`No s'ha pogut connectar amb el servidor (${API_URL})`);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error || `Error ${res.status}`);
  }
  return body;
}

export async function apiGet<T>(path: string): Promise<T> {
  return (await request<T>(path)).data;
}

export async function apiGetPage<T>(path: string): Promise<Page<T>> {
  const body = await request<T>(path);
  return {
    data: body.data,
    total: Number(body.total ?? 0),
    page: Number(body.page ?? 1),
    pages: Number(body.pages ?? 1),
  };
}

// Construeix "?a=1&b=2" ignorant els valors buits
export function toQuery(params: Record<string, string | number | undefined>) {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return parts.length ? `?${parts.join('&')}` : '';
}
