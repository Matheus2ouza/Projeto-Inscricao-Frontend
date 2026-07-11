import { ImageSwatches, SwatchRole } from '../hooks/useImagePalette';

/**
 * Escurece uma cor hex para usar em dark mode
 * @param hex - Cor em hex (#RRGGBB)
 * @param amount - Quanto escurecer (0-1), default 0.3
 * @returns Cor escurecida em hex
 */
export function darkenColor(hex: string, amount: number = 0.3): string {
  // Remove o # se existir
  let color = hex.replace('#', '');

  // Converte para RGB
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Escurece
  r = Math.floor(r * (1 - amount));
  g = Math.floor(g * (1 - amount));
  b = Math.floor(b * (1 - amount));

  // Garante que não fique abaixo de 0
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);

  // Converte de volta para hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Gera versões dark mode para uma paleta de cores
 */
export function generateDarkPalette(lightPalette: string[]): string[] {
  return lightPalette.map((color) => darkenColor(color, 0.35));
}

/**
 * Gera swatches dark mode baseados nos light swatches
 */
export function generateDarkSwatches(
  lightSwatches: ImageSwatches,
): ImageSwatches {
  const darkSwatches: ImageSwatches = {
    Vibrant: null,
    Muted: null,
    DarkVibrant: null,
    DarkMuted: null,
    LightVibrant: null,
    LightMuted: null,
  };

  // Tipagem explícita para o loop
  const roles: SwatchRole[] = [
    'Vibrant',
    'Muted',
    'DarkVibrant',
    'DarkMuted',
    'LightVibrant',
    'LightMuted',
  ];

  // Para cada swatch, criar uma versão escura
  roles.forEach((role) => {
    const swatch = lightSwatches[role];
    if (swatch) {
      darkSwatches[role] = {
        color: darkenColor(swatch.color, 0.35),
        titleTextColor: '#FFFFFF',
        bodyTextColor: '#E5E7EB',
        isDark: true,
      };
    }
  });

  return darkSwatches;
}
