"use client";

interface BackgroundPathsProps {
  palette: string[];
}

export default function BackgroundPaths({ palette }: BackgroundPathsProps) {
  const hasPalette = palette.length >= 3;

  const paletteGradient = hasPalette
    ? `radial-gradient(ellipse 800px 800px at 50% -100px, ${palette[0]} 0%, ${palette[1]} 20%, ${palette[2]} 50%, ${palette[3] ?? palette[2]} 70%, ${palette[4] ?? palette[1]} 100%)`
    : undefined;

  const fallbackGradient =
    "radial-gradient(ellipse 800px 800px at 50% -100px, #f5f5f5 0%, #ebebeb 25%, #dedede 50%, #d0d0d0 75%, #c2c2c2 100%)";

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
      {/* Paleta — aparece por cima */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: paletteGradient,
          opacity: hasPalette ? 1 : 0,
        }}
      />
    </div>
  );
}
