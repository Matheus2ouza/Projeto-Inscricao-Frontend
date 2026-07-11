type CalculateMaxAgeType = {
  ruleDate: Date | string | null;
  baseDate: Date | string;
};

export function calculateMaxAge({
  ruleDate,
  baseDate = new Date(),
}: CalculateMaxAgeType) {
  if (ruleDate === null) {
    return 'Qualquer idade';
  }

  const rule = ruleDate instanceof Date ? ruleDate : new Date(ruleDate);

  if (isNaN(rule.getTime())) {
    return 'Qualquer idade';
  }

  // Usa a data base (evento) ou a data atual se não for fornecida
  const base = baseDate instanceof Date ? baseDate : new Date(baseDate);
  if (isNaN(base.getTime())) {
    return 'Qualquer idade';
  }

  let age = base.getFullYear() - rule.getFullYear();

  const hasHadBirthday =
    base.getMonth() > rule.getMonth() ||
    (base.getMonth() === rule.getMonth() && base.getDate() >= rule.getDate());

  if (!hasHadBirthday) {
    age -= 1;
  }

  // Se a idade for negativa, retorna "Qualquer idade"
  if (age < 0) {
    return 'Qualquer idade';
  }

  return `Até ${age} anos`;
}
