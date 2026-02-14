import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Clock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessPaymentProps {
  clientName: string;
  onViewInscription: () => void;
}

export default function SuccessPayment({
  clientName,
  onViewInscription,
}: SuccessPaymentProps) {
  const storageKey = "success-payment-unlock-at";
  const [remainingSeconds, setRemainingSeconds] = useState(10);

  useEffect(() => {
    const now = Date.now();
    const storedUnlockAt = sessionStorage.getItem(storageKey);
    const unlockAt =
      storedUnlockAt && !Number.isNaN(Number(storedUnlockAt))
        ? Number(storedUnlockAt)
        : now + 10_000;

    if (!storedUnlockAt) {
      sessionStorage.setItem(storageKey, String(unlockAt));
    }

    setRemainingSeconds(Math.max(0, Math.ceil((unlockAt - now) / 1000)));

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((unlockAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [storageKey]);

  const isButtonDisabled = remainingSeconds > 0;

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            Pagamento em Processo
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Obrigado, {clientName}! Recebemos seu pagamento. Ele agora passará
            por um processo de análise e será confirmado em breve pelos
            organizadores.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Para acompanhar o status do pagamento
            </p>
            <p className="text-sm text-blue-700 font-medium">
              Acesse sua inscrição e acompanhe as atualizações
            </p>
          </div>

          <Button
            onClick={onViewInscription}
            disabled={isButtonDisabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Ir para Minha Inscrição
            {isButtonDisabled ? ` (${remainingSeconds}s)` : ""}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
