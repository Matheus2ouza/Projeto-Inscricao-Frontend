/**
 * Gera uma classe de gradiente baseada no nome do evento.
 * Usa um hash do nome para garantir que o mesmo evento sempre tenha o mesmo gradiente.
 *
 * @param eventName - Nome do evento
 * @returns String com a classe CSS do gradiente Tailwind
 */
export function generateGradient(eventName: string): string {
  // Gerar cores baseadas no nome do evento para consistência
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-blue-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500",
  ];

  // Gerar índice baseado no nome do evento
  let hash = 0;
  for (let i = 0; i < eventName.length; i++) {
    hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;

  return colors[index];
}

