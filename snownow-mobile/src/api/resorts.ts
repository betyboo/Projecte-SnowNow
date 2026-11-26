import { apiGet, apiGetPage, toQuery } from './client';

// Mòdul 2: Cercador d'estacions (snownow-backend/src/routes/resortRoutes.ts)
// Els camps marcats com a SUPOSAT encara no existeixen al backend: estan descrits a
// snownow-mobile/docs/suposicions-api.md perquè el company del mòdul 2 els faci coincidir.

export type SlopeColor = 'green' | 'blue' | 'red' | 'black';
export type SnowType = 'powder' | 'packed' | 'spring' | 'artificial';
export type Visibility = 'good' | 'moderate' | 'poor';

export interface Resort {
  _id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  skiAreaKm: number;
  altitudeMeters: { base: number; summit: number };
  services: string[];
  slopes?: Record<SlopeColor, number>; // SUPOSAT: nombre de pistes de cada color
  snowType?: SnowType; // SUPOSAT
  visibility?: Visibility; // SUPOSAT
}

export interface ResortSearchParams {
  q?: string;
  minSkiAreaKm?: number;
  difficulty?: SlopeColor; // SUPOSAT: estacions amb almenys una pista d'aquest color
  page?: number;
  limit?: number;
}

export function searchResorts(params: ResortSearchParams = {}) {
  return apiGetPage<Resort[]>(`/api/resorts/search${toQuery({ ...params })}`);
}

// SUPOSAT: GET /api/resorts/:id (el company l'afegirà)
export function getResort(id: string) {
  return apiGet<Resort>(`/api/resorts/${encodeURIComponent(id)}`);
}
