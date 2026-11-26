import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Resort, SlopeColor, SnowType, Visibility } from '../api/resorts';
import { Palette, useTheme } from '../theme';

// Noms en català dels valors que retorna el backend
export const slopeLabels: Record<SlopeColor, string> = {
  green: 'Verda',
  blue: 'Blava',
  red: 'Vermella',
  black: 'Negra',
};
const snowLabels: Record<SnowType, string> = {
  powder: 'Neu pols',
  packed: 'Neu dura',
  spring: 'Neu primavera',
  artificial: 'Neu artificial',
};
const visibilityLabels: Record<Visibility, string> = {
  good: 'Bona visibilitat',
  moderate: 'Visibilitat moderada',
  poor: 'Poca visibilitat',
};

export const slopeOrder: SlopeColor[] = ['green', 'blue', 'red', 'black'];

export function slopeColor(colors: Palette, slope: SlopeColor) {
  return {
    green: colors.slopeGreen,
    blue: colors.slopeBlue,
    red: colors.slopeRed,
    black: colors.slopeBlack,
  }[slope];
}

// Punt de color d'una pista; es fa servir a la targeta i als filtres
export function SlopeDot({ slope, size = 10 }: { slope: SlopeColor; size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: slopeColor(colors, slope),
        borderWidth: slope === 'black' ? 1 : 0,
        borderColor: colors.slopeBlackBorder,
      }}
    />
  );
}

const formatMeters = (m: number) => `${m.toLocaleString('ca-ES')} m`;

export function ResortCard({ resort }: { resort: Resort }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { base, summit } = resort.altitudeMeters;

  // Etiquetes opcionals: només surten si el backend les envia
  const tags = [
    resort.snowType && snowLabels[resort.snowType],
    resort.visibility && visibilityLabels[resort.visibility],
    ...resort.services,
  ].filter((tag): tag is string => Boolean(tag));

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleBox}>
          <Text style={styles.name}>{resort.name}</Text>
          <Text style={styles.where}>
            {resort.region} · {resort.country}
          </Text>
        </View>
        <View style={styles.km}>
          <Text style={styles.kmValue}>{resort.skiAreaKm}</Text>
          <Text style={styles.kmUnit}>km</Text>
        </View>
      </View>

      <View style={styles.altitude}>
        <View style={styles.altitudeLine}>
          <Text style={styles.small}>{formatMeters(base)}</Text>
          <View style={styles.track} />
          <Text style={styles.small}>{formatMeters(summit)}</Text>
        </View>
        <Text style={styles.small}>
          <Text style={styles.strong}>{formatMeters(summit - base)}</Text> de desnivell
        </Text>
      </View>

      {resort.slopes && (
        <View style={styles.slopes}>
          {slopeOrder.map((slope) => (
            <View key={slope} style={styles.slope} accessibilityLabel={`${resort.slopes![slope]} pistes ${slopeLabels[slope]}`}>
              <SlopeDot slope={slope} />
              <Text style={styles.small}>{resort.slopes![slope]}</Text>
            </View>
          ))}
        </View>
      )}

      {resort.description ? <Text style={styles.description}>{resort.description}</Text> : null}

      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
      gap: 12,
    },
    top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
    titleBox: { flex: 1 },
    name: { fontSize: 17, fontWeight: '700', color: colors.text },
    where: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
    km: { alignItems: 'flex-end' },
    kmValue: { fontSize: 22, fontWeight: '700', color: colors.primary, fontVariant: ['tabular-nums'] },
    kmUnit: { fontSize: 11, fontWeight: '600', color: colors.primary },
    altitude: { gap: 5 },
    altitudeLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    track: { flex: 1, height: 3, borderRadius: 2, backgroundColor: colors.primary, opacity: 0.6 },
    small: { fontSize: 12, color: colors.textMuted, fontVariant: ['tabular-nums'] },
    strong: { color: colors.text, fontWeight: '600' },
    slopes: { flexDirection: 'row', gap: 14 },
    slope: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    description: { fontSize: 13, lineHeight: 19, color: colors.textMuted },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    tag: {
      fontSize: 12,
      color: colors.text,
      backgroundColor: colors.chip,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: 'hidden',
    },
  });
