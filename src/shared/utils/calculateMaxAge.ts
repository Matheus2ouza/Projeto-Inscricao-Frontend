export default function calculateMaxAge(ruleDate: Date | string | null) {
  if (ruleDate === null) {
    return "Qualquer idade";
  }

  const rule = ruleDate instanceof Date ? ruleDate : new Date(ruleDate);

  if (isNaN(rule.getTime())) {
    return "Qualquer idade";
  }

  const today = new Date();
  let age = today.getFullYear() - rule.getFullYear();

  const hasHadBirthday =
    today.getMonth() > rule.getMonth() ||
    (today.getMonth() === rule.getMonth() && today.getDate() >= rule.getDate());

  if (!hasHadBirthday) {
    age -= 1;
  }

  return `Até ${age} anos`;
}
