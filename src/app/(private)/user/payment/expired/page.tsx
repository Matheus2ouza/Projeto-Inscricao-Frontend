import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export default function PaymentExpired() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">Pagamento expirado</h1>
      <p className="text-sm text-muted-foreground">
        Página de teste para retorno de pagamento.
      </p>
      <Button asChild>
        <Link href="/user/home">Voltar para Home</Link>
      </Button>
    </div>
  );
}
