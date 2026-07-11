// useImagePalette.ts
import { darkenColor } from '@/shared/utils/colorUtils';
import { getColorSync, getPaletteSync, getSwatchesSync } from 'colorthief';
import { useEffect, useState } from 'react';

export type SwatchRole =
  | 'Vibrant'
  | 'Muted'
  | 'DarkVibrant'
  | 'DarkMuted'
  | 'LightVibrant'
  | 'LightMuted';

export type SemanticSwatch = {
  color: string;
  titleTextColor: string;
  bodyTextColor: string;
  isDark: boolean;
};

export type ImageSwatches = Record<SwatchRole, SemanticSwatch | null>;

// Paleta Riodavida Eventos (versão light)
const defaultPalette = ['#3FB5AE', '#A8BE3C', '#2E8F8A', '#8AA02E', '#E5E7EB'];

// Paleta Riodavida Eventos (versão dark)
const defaultPaletteDark = [
  '#2A8A85',
  '#8A9E2E',
  '#1F6B66',
  '#6E821E',
  '#2D3748',
];

const buildDefaultSwatches = (isDarkMode: boolean = false): ImageSwatches => {
  const base = {
    Vibrant: {
      color: isDarkMode ? '#2A8A85' : '#3FB5AE',
      titleTextColor: '#FFFFFF',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#E5E7EB',
      isDark: isDarkMode,
    },
    Muted: {
      color: isDarkMode ? '#8A9E2E' : '#A8BE3C',
      titleTextColor: '#FFFFFF',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#E5E7EB',
      isDark: isDarkMode,
    },
    DarkVibrant: {
      color: isDarkMode ? '#1F6B66' : '#2E8F8A',
      titleTextColor: '#FFFFFF',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#E5E7EB',
      isDark: isDarkMode,
    },
    DarkMuted: {
      color: isDarkMode ? '#6E821E' : '#8AA02E',
      titleTextColor: '#FFFFFF',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#E5E7EB',
      isDark: isDarkMode,
    },
    LightVibrant: {
      color: isDarkMode ? '#4AB0A8' : '#5FCFC7',
      titleTextColor: isDarkMode ? '#FFFFFF' : '#1F2937',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#374151',
      isDark: isDarkMode,
    },
    LightMuted: {
      color: isDarkMode ? '#B0C44E' : '#C4D766',
      titleTextColor: isDarkMode ? '#FFFFFF' : '#1F2937',
      bodyTextColor: isDarkMode ? '#B0BEC5' : '#374151',
      isDark: isDarkMode,
    },
  };

  return base;
};

export function useImagePalette(
  imageUrl: string | null | undefined,
  isDarkMode: boolean = false,
  colorCount = 5,
) {
  const [palette, setPalette] = useState<string[]>(
    isDarkMode ? defaultPaletteDark : defaultPalette,
  );
  const [dominant, setDominant] = useState<string | null>(
    isDarkMode ? defaultPaletteDark[0] : defaultPalette[0],
  );
  const [isDark, setIsDark] = useState(isDarkMode);
  const [swatches, setSwatches] = useState<ImageSwatches>(
    buildDefaultSwatches(isDarkMode),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setPalette(isDarkMode ? defaultPaletteDark : defaultPalette);
      setDominant(isDarkMode ? defaultPaletteDark[0] : defaultPalette[0]);
      setIsDark(isDarkMode);
      setSwatches(buildDefaultSwatches(isDarkMode));
      setReady(true);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const dominantColor = getColorSync(img);
      const paletteColors = getPaletteSync(img, { colorCount });
      const rawSwatches = getSwatchesSync(img);

      if (dominantColor) {
        const hexColor = dominantColor.hex();
        const finalColor = isDarkMode ? darkenColor(hexColor, 0.3) : hexColor;
        setDominant(finalColor);
        setIsDark(isDarkMode);
      }

      if (paletteColors) {
        const hexPalette = paletteColors.map((c) => c.hex());
        const finalPalette = isDarkMode
          ? hexPalette.map((color) => darkenColor(color, 0.3))
          : hexPalette;
        setPalette(finalPalette);
      }

      if (rawSwatches) {
        const toSemantic = (
          swatch:
            | {
                color: { hex: () => string; isDark?: boolean };
                titleTextColor: { hex: () => string };
                bodyTextColor: { hex: () => string };
              }
            | null
            | undefined,
        ): SemanticSwatch | null => {
          if (!swatch) return null;

          const color = swatch.color.hex();
          const finalColor = isDarkMode ? darkenColor(color, 0.3) : color;

          return {
            color: finalColor,
            titleTextColor: isDarkMode
              ? '#FFFFFF'
              : swatch.titleTextColor.hex(),
            bodyTextColor: isDarkMode ? '#B0BEC5' : swatch.bodyTextColor.hex(),
            isDark: isDarkMode,
          };
        };

        setSwatches({
          Vibrant: toSemantic(rawSwatches.Vibrant),
          Muted: toSemantic(rawSwatches.Muted),
          DarkVibrant: toSemantic(rawSwatches.DarkVibrant),
          DarkMuted: toSemantic(rawSwatches.DarkMuted),
          LightVibrant: toSemantic(rawSwatches.LightVibrant),
          LightMuted: toSemantic(rawSwatches.LightMuted),
        });
      }

      setReady(true);
    };

    img.onerror = () => {
      setPalette(isDarkMode ? defaultPaletteDark : defaultPalette);
      setDominant(isDarkMode ? defaultPaletteDark[0] : defaultPalette[0]);
      setIsDark(isDarkMode);
      setSwatches(buildDefaultSwatches(isDarkMode));
      setReady(true);
    };
  }, [imageUrl, isDarkMode]);

  return { dominant, palette, isDark, swatches, ready };
}
