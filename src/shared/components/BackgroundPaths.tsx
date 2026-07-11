'use client';

type IntensityLevel = 'low' | 'medium' | 'high';

interface BackgroundPathsProps {
  palette: string[];
  intensity?: IntensityLevel; // 'low' | 'medium' | 'high'
}

export default function BackgroundPaths({
  palette,
  intensity = 'medium',
}: BackgroundPathsProps) {
  const hasPalette = palette.length >= 3;

  // Mapeia os níveis para valores numéricos
  const intensityMap: Record<IntensityLevel, number> = {
    low: 0.25, // 25% - bem sutil
    medium: 0.6, // 60% - equilibrado
    high: 1, // 100% - total
  };

  const opacity = intensityMap[intensity] ?? 0.6;

  const paletteGradient = hasPalette
    ? `radial-gradient(ellipse 800px 800px at 50% -100px, ${palette[0]} 0%, ${palette[1]} 20%, ${palette[2]} 50%, ${palette[3] ?? palette[2]} 70%, ${palette[4] ?? palette[1]} 100%)`
    : undefined;

  const fallbackGradient =
    'radial-gradient(ellipse 800px 800px at 50% -100px, #f5f5f5 0%, #ebebeb 25%, #dedede 50%, #d0d0d0 75%, #c2c2c2 100%)';

  return (
    <div className="fixed inset-0 -z-3">
      {/* Fallback — some quando a paleta chega */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: fallbackGradient,
          opacity: hasPalette ? 0 : 1,
        }}
      />
      {/* Paleta — aparece por cima com intensidade controlada */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: paletteGradient,
          opacity: hasPalette ? opacity : 0,
        }}
      />
    </div>
  );
}
