import { apiGet } from './client';

// Mòdul 3: Telemetria GPS i rànquing (snownow-backend/src/routes/skierSessionRoutes.ts)

export type LeaderboardMetric = 'speed' | 'distance' | 'vertical';

export interface LeaderboardEntry {
  rank: number;
  skierId: string;
  skierName: string;
  resortName: string;
  maxSpeedKmh: number;
  totalDistanceKm: number;
  totalVerticalDropMeters: number;
  sessionsCount: number;
  lastSession: string;
}

export function getLeaderboard(metric: LeaderboardMetric, limit = 20) {
  return apiGet<LeaderboardEntry[]>(
    `/api/skier-sessions/leaderboard?metric=${metric}&limit=${limit}`
  );
}
