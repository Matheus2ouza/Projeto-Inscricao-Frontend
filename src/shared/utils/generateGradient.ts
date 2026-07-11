/**
 * Gera um gradiente aleatório usando a paleta de cores da logo Rio da vida Eventos.
 *
 * @param seed - String opcional para consistência (ex: nome do evento)
 * @returns String com a classe CSS do gradiente Tailwind
 */
export function generateGradientClass(seed?: string): string {
  // Combinações de gradiente usando a paleta Rio da vida
  const gradients = [
    // 'from-[#3FB5AE] to-[#A8BE3C]', // Turquesa -> Verde-oliva
    // 'from-[#2E8F8A] to-[#5FCFC7]', // Teal escuro -> Teal claro
    // 'from-[#8AA02E] to-[#C4D766]', // Oliva escuro -> Oliva claro
    'from-[#3FB5AE] to-[#2E8F8A]', // Turquesa -> Teal escuro
    // 'from-[#A8BE3C] to-[#8AA02E]', // Verde-oliva -> Oliva escuro
    // 'from-[#5FCFC7] to-[#C4D766]', // Teal claro -> Oliva claro
    // 'from-[#3FB5AE] to-[#C4D766]', // Turquesa -> Oliva claro
    // 'from-[#2E8F8A] to-[#A8BE3C]', // Teal escuro -> Verde-oliva
  ];

  // Se um seed for fornecido, usa hash para consistência
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  }

  // Se não houver seed, retorna o primeiro gradiente (ou aleatório)
  return gradients[Math.floor(Math.random() * gradients.length)];
}
