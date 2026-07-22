# Paleta de Cores — Riodavida Eventos

Paleta extraída da logo (símbolo "RV/S" + wordmark).

## Cores principais

| Nome               | Hex       | Uso sugerido           |
| ------------------ | --------- | ---------------------- |
| Turquesa / Teal    | `#3FB5AE` | Cor primária (Vibrant) |
| Verde-oliva / Lima | `#A8BE3C` | Cor secundária (Muted) |

## Variações (gradiente do símbolo)

| Nome         | Hex       |
| ------------ | --------- |
| Teal escuro  | `#2E8F8A` |
| Teal claro   | `#5FCFC7` |
| Oliva escuro | `#8AA02E` |
| Oliva claro  | `#C4D766` |

## Neutros

| Nome                   | Hex       | Uso sugerido                        |
| ---------------------- | --------- | ----------------------------------- |
| Branco                 | `#FFFFFF` | Texto sobre fundo escuro            |
| Cinza claro (contorno) | `#E5E7EB` | Contornos, texto sutil sobre escuro |
| Cinza escuro           | `#1F2937` | Texto sobre fundo claro             |

## Mapeamento tipo "Vibrant/Muted" (estilo ColorThief / useImagePalette)

```ts
Vibrant:      { color: '#3FB5AE', titleTextColor: '#FFFFFF', bodyTextColor: '#E5E7EB', isDark: true }
Muted:        { color: '#A8BE3C', titleTextColor: '#FFFFFF', bodyTextColor: '#E5E7EB', isDark: true }
DarkVibrant:  { color: '#2E8F8A', titleTextColor: '#FFFFFF', bodyTextColor: '#E5E7EB', isDark: true }
DarkMuted:    { color: '#8AA02E', titleTextColor: '#FFFFFF', bodyTextColor: '#E5E7EB', isDark: true }
LightVibrant: { color: '#5FCFC7', titleTextColor: '#1F2937', bodyTextColor: '#374151', isDark: false }
LightMuted:   { color: '#C4D766', titleTextColor: '#1F2937', bodyTextColor: '#374151', isDark: false }
```
