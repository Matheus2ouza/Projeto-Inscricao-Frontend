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

const defaultPalette = ['#8b7bb8', '#a58bc4', '#b98fc0', '#c48fb0', '#f1eef7'];

const buildDefaultSwatches = (): ImageSwatches => ({
  Vibrant: {
    color: '#8b7bb8',
    titleTextColor: '#ffffff',
    bodyTextColor: '#f1eef7',
    isDark: true,
  },
  Muted: {
    color: '#a58bc4',
    titleTextColor: '#ffffff',
    bodyTextColor: '#f5f2fa',
    isDark: true,
  },
  DarkVibrant: {
    color: '#6d5f96',
    titleTextColor: '#ffffff',
    bodyTextColor: '#ede9f4',
    isDark: true,
  },
  DarkMuted: {
    color: '#a06b8a',
    titleTextColor: '#ffffff',
    bodyTextColor: '#f5eaf0',
    isDark: true,
  },
  LightVibrant: {
    color: '#f1eef7',
    titleTextColor: '#111111',
    bodyTextColor: '#374151',
    isDark: false,
  },
  LightMuted: {
    color: '#f6eef2',
    titleTextColor: '#111111',
    bodyTextColor: '#4b5563',
    isDark: false,
  },
});

export function useImagePalette(
  imageUrl: string | null | undefined,
  colorCount = 5,
) {
  const [palette, setPalette] = useState<string[]>(defaultPalette);
  const [dominant, setDominant] = useState<string | null>(defaultPalette[0]);
  const [isDark, setIsDark] = useState(false);
  const [swatches, setSwatches] = useState<ImageSwatches>(
    buildDefaultSwatches(),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setPalette(defaultPalette);
      setDominant(defaultPalette[0] ?? null);
      setIsDark(false);
      setSwatches(buildDefaultSwatches());
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
        setDominant(dominantColor.hex());
        setIsDark(dominantColor.isDark);
      }

      if (paletteColors) {
        setPalette(paletteColors.map((c) => c.hex()));
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

          return {
            color: swatch.color.hex(),
            titleTextColor: swatch.titleTextColor.hex(),
            bodyTextColor: swatch.bodyTextColor.hex(),
            isDark: Boolean(swatch.color.isDark),
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
      setPalette(defaultPalette);
      setDominant(defaultPalette[0] ?? null);
      setIsDark(false);
      setSwatches(buildDefaultSwatches());
      setReady(true);
    };
  }, [imageUrl]);

  return { dominant, palette, isDark, swatches, ready };
}
