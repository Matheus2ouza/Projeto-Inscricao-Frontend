/**
 * Constantes de layout centralizadas
 * Use estas constantes para manter consistência em todo o sistema
 */

// Classes CSS para container de página
export const PAGE_CONTAINER_CLASSES = {
  // Container principal com largura máxima e padding
  container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8",

  // Background padrão para páginas
  background:
    "min-h-screen bg-gradient-to-b from-background via-background to-muted/40",

  // Header com botão de voltar
  header: "flex items-center gap-4",

  // Título da página
  title: "text-3xl font-bold text-gray-900 dark:text-white",

  // Descrição/subtítulo
  description: "text-muted-foreground",
} as const;

// Largura máxima do container (pode ser usado para cálculos)
export const MAX_CONTAINER_WIDTH = "6xl"; // Tailwind: max-w-6xl = 72rem = 1152px

// Alternativas de largura máxima (caso precise mudar no futuro)
export const CONTAINER_WIDTHS = {
  sm: "max-w-4xl", // 56rem = 896px
  md: "max-w-5xl", // 64rem = 1024px
  lg: "max-w-6xl", // 72rem = 1152px (padrão atual)
  xl: "max-w-7xl", // 80rem = 1280px
  "2xl": "max-w-[1536px]", // 96rem = 1536px
} as const;
