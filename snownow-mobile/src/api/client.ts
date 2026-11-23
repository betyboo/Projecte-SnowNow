// URL base del backend. Es defineix a snownow-mobile/.env (veure .env.example).
// Des del mòbil, "localhost" és el propi telèfon: cal posar la IP local del PC.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

// Totes les respostes del backend segueixen el format { success, data | error }
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export async function apiGet<T>(path: string): Promise<T> {
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
  return body.data;
}
