// Estil "Glacera": fons blau gel i targetes que es distingeixen del fons.
// Les dues paletes tenen els mateixos noms perquè les pantalles no hagin de saber quin mode hi ha.

export type ColorScheme = 'light' | 'dark';

export interface Palette {
  primary: string; // blau d'accent (botons, element actiu)
  onPrimary: string; // text a sobre del blau d'accent
  background: string; // fons de pantalla
  card: string; // targetes i barra de pestanyes
  cardBorder: string; // vora de les targetes
  text: string;
  textMuted: string;
  border: string; // separadors
  chip: string; // fons dels botons de filtre no seleccionats
  tabInactive: string; // icones de pestanyes no seleccionades
  danger: string;
  gold: string;
  silver: string;
  bronze: string;
}

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    primary: '#0B6BCB',
    onPrimary: '#FFFFFF',
    background: '#EEF4FB',
    card: '#FFFFFF',
    cardBorder: '#E3ECF6',
    text: '#0F1B2D',
    textMuted: '#5B6B80',
    border: '#DCE5EF',
    chip: '#DCE7F4',
    tabInactive: '#8A9BB0',
    danger: '#C62828',
    gold: '#D4A017',
    silver: '#8E9AA6',
    bronze: '#B0703A',
  },
  dark: {
    primary: '#5AA7F2',
    onPrimary: '#0B1624',
    background: '#0B1624',
    card: '#132339',
    cardBorder: '#1D3350',
    text: '#E6EEF8',
    textMuted: '#8FA3BC',
    border: '#1D3350',
    chip: '#1A2E48',
    tabInactive: '#6F86A3',
    danger: '#EF7070',
    gold: '#D4A017',
    silver: '#8E9AA6',
    bronze: '#B0703A',
  },
};
