import { getColorSync, getPaletteSync, getSwatchesSync } from "colorthief";
import { useEffect, useState } from "react";

export type SwatchRole =
  | "Vibrant"
  | "Muted"
  | "DarkVibrant"
  | "DarkMuted"
  | "LightVibrant"
  | "LightMuted";

export type SemanticSwatch = {
  color: string;
  titleTextColor: string;
  bodyTextColor: string;
  isDark: boolean;
};

export type ImageSwatches = Record<SwatchRole, SemanticSwatch | null>;

export function useImagePalette(
  imageUrl: string | null | undefined,
  colorCount = 5,
) {
  const [palette, setPalette] = useState<string[]>([]);
  const [dominant, setDominant] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [swatches, setSwatches] = useState<ImageSwatches>({
    Vibrant: null,
    Muted: null,
    DarkVibrant: null,
    DarkMuted: null,
    LightVibrant: null,
    LightMuted: null,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setReady(true);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
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

    img.onerror = () => setReady(true);
  }, [imageUrl]);

  return { dominant, palette, isDark, swatches, ready };
}
