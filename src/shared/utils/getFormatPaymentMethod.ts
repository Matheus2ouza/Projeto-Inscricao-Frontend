export type PaymentMethodDisplay = {
  label: string;
  className: string;
};

const defaultDisplay: PaymentMethodDisplay = {
  label: "Não informado",
  className: "border-border text-muted-foreground",
};

const paymentMethodMap: Record<string, PaymentMethodDisplay> = {
  PIX: {
    label: "PIX",
    className: "border-emerald-500 text-emerald-700 bg-emerald-50",
  },
  DINHEIRO: {
    label: "Dinheiro",
    className: "border-amber-400 text-amber-700 bg-amber-50",
  },
  CARTAO: {
    label: "Cartão",
    className: "border-sky-400 text-sky-700 bg-sky-50",
  },
  CARTÃO: {
    label: "Cartão",
    className: "border-sky-400 text-sky-700 bg-sky-50",
  },
  BOLETO: {
    label: "Boleto",
    className: "border-purple-400 text-purple-700 bg-purple-50",
  },
  TRANSFERENCIA: {
    label: "Transferência",
    className: "border-blue-400 text-blue-700 bg-blue-50",
  },
  TRANSFERÊNCIA: {
    label: "Transferência",
    className: "border-blue-400 text-blue-700 bg-blue-50",
  },
};

export function getFormatPaymentMethod(
  method?: string | null
): PaymentMethodDisplay {
  if (!method) {
    return defaultDisplay;
  }

  const normalized = method.trim();
  if (!normalized) {
    return defaultDisplay;
  }

  const normalizedKey = normalized
    .normalize("NFD")
    .replace(/[^\w]/g, "")
    .toUpperCase();

  if (paymentMethodMap[normalizedKey]) {
    return paymentMethodMap[normalizedKey];
  }

  return {
    label: normalized,
    className: defaultDisplay.className,
  };
}
