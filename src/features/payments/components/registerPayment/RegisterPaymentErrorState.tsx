import { Button } from '@/shared/components/ui/button';

type RegisterPaymentErrorStateProps = {
  error: Error;
  onRetry: () => void;
};

export function RegisterPaymentErrorState({
  error,
  onRetry,
}: RegisterPaymentErrorStateProps) {
  return (
    <div className="flex min-h-96 items-center justify-center p-6">
      <div className="text-destructive text-center">
        <p className="mb-4">
          Erro ao carregar pagamentos pendentes: {error.message}
        </p>
        <Button onClick={onRetry}>Tentar Novamente</Button>
      </div>
    </div>
  );
}
