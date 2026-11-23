import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getLeaderboard, LeaderboardEntry, LeaderboardMetric } from '../../api/telemetry';
import { colors } from '../../theme';

// Cada mètrica del backend amb l'etiqueta i com es mostra el seu valor
const metrics: { key: LeaderboardMetric; label: string; format: (e: LeaderboardEntry) => string }[] = [
  { key: 'speed', label: 'Velocitat', format: (e) => `${e.maxSpeedKmh} km/h` },
  { key: 'distance', label: 'Distància', format: (e) => `${e.totalDistanceKm} km` },
  { key: 'vertical', label: 'Desnivell', format: (e) => `${e.totalVerticalDropMeters} m` },
];

const medalColors = [colors.gold, colors.silver, colors.bronze];

export default function RankingScreen() {
  const [metric, setMetric] = useState<LeaderboardMetric>('speed');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setEntries(await getLeaderboard(metric));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [metric]);

  // Es torna a carregar cada cop que canvia la mètrica seleccionada
  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const current = metrics.find((m) => m.key === metric)!;

  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        {metrics.map((m) => (
          <Pressable
            key={m.key}
            onPress={() => setMetric(m.key)}
            style={[styles.segment, m.key === metric && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, m.key === metric && styles.segmentTextActive]}>
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.center} size="large" color={colors.primary} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={onRefresh} style={styles.retry}>
            <Text style={styles.retryText}>Torna-ho a provar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.skierId}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>Encara no hi ha sessions registrades.</Text>}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View
                style={[
                  styles.rank,
                  { backgroundColor: medalColors[item.rank - 1] ?? colors.border },
                ]}
              >
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.skierName}</Text>
                <Text style={styles.resort}>
                  {item.resortName} · {item.sessionsCount} sessions
                </Text>
              </View>
              <Text style={styles.value}>{current.format(item)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  selector: {
    flexDirection: 'row',
    margin: 16,
    padding: 4,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  segment: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.card },
  segmentText: { color: colors.textMuted, fontWeight: '500' },
  segmentTextActive: { color: colors.primary, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: colors.danger, textAlign: 'center', marginBottom: 12 },
  retry: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.primary },
  retryText: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rank: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#fff', fontWeight: '700' },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  resort: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  value: { fontSize: 16, fontWeight: '700', color: colors.primary },
});
