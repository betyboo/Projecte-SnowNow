import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Resort, searchResorts, SlopeColor } from '../../api/resorts';
import { ResortCard, SlopeDot, slopeLabels, slopeOrder } from '../../components/ResortCard';
import { Palette, useTheme } from '../../theme';

// Filtre de superfície mínima: consulta per rang (minSkiAreaKm) al backend
const areaOptions: { label: string; value?: number }[] = [
  { label: 'Totes' },
  { label: '+25 km', value: 25 },
  { label: '+50 km', value: 50 },
  { label: '+100 km', value: 100 },
];

const SEARCH_DELAY_MS = 400;

export default function EstacionsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [text, setText] = useState('');
  const [query, setQuery] = useState(''); // el text ja "estabilitzat" després de l'espera
  const [minArea, setMinArea] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<SlopeColor | undefined>();

  const [resorts, setResorts] = useState<Resort[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cada petició té un número; si n'arriba una de vella fora d'ordre, s'ignora
  const lastRequest = useRef(0);

  // Esperem que l'usuari deixi d'escriure abans de buscar
  useEffect(() => {
    const timer = setTimeout(() => setQuery(text.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const load = useCallback(async () => {
    const requestId = ++lastRequest.current;
    try {
      const result = await searchResorts({ q: query, minSkiAreaKm: minArea, difficulty, limit: 50 });
      if (requestId !== lastRequest.current) return;
      setResorts(result.data);
      setTotal(result.total);
      setError(null);
    } catch (e) {
      if (requestId !== lastRequest.current) return;
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [query, minArea, difficulty]);

  // Es torna a buscar cada cop que canvia el text o un filtre
  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const hasFilters = Boolean(query || minArea || difficulty);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Cerca per nom, regió o país"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
            accessibilityLabel="Cerca estacions"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {slopeOrder.map((slope) => {
            const active = difficulty === slope;
            return (
              <Pressable
                key={slope}
                onPress={() => setDifficulty(active ? undefined : slope)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <SlopeDot slope={slope} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{slopeLabels[slope]}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.chips}>
          {areaOptions.map((option) => {
            const active = minArea === option.value;
            return (
              <Pressable
                key={option.label}
                onPress={() => setMinArea(option.value)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loading && !refreshing ? (
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
          data={resorts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            <Text style={styles.count}>
              {total === 1 ? '1 estació trobada' : `${total} estacions trobades`}
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {hasFilters
                ? 'Cap estació coincideix amb la cerca. Prova amb menys filtres.'
                : 'Encara no hi ha estacions registrades.'}
            </Text>
          }
          renderItem={({ item }) => <ResortCard resort={item} />}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 4, paddingBottom: 8, gap: 10 },
    search: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text },
    chips: { flexDirection: 'row', gap: 6, paddingHorizontal: 16 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.chip,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
    chipTextActive: { color: colors.onPrimary },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    error: { color: colors.danger, textAlign: 'center', marginBottom: 12 },
    retry: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.primary },
    retryText: { color: colors.onPrimary, fontWeight: '600' },
    list: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
    count: { fontSize: 13, color: colors.textMuted },
    empty: { textAlign: 'center', color: colors.textMuted, marginTop: 32 },
  });
