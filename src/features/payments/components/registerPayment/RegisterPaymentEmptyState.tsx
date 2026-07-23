import { Button } from '@/shared/components/ui/button';
import { CreditCard } from 'lucide-react';

type RegisterPaymentEmptyStateProps = {
  hasFilter: boolean;
  onClearFilter: () => void;
};

export function RegisterPaymentEmptyState({
  hasFilter,
  onClearFilter,
}: RegisterPaymentEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <div className="bg-riodavida/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <CreditCard className="text-riodavida h-8 w-8" />
      </div>
      <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 text-lg font-semibold">
        Nenhuma inscrição pendente
      </h3>
      <p className="text-muted-foreground">
        {hasFilter
          ? 'Não há inscrições pendentes para esta localidade.'
          : 'Todas as inscrições já foram pagas ou não estão disponíveis para pagamento.'}
      </p>
      {hasFilter && (
        <Button variant="outline" onClick={onClearFilter} className="mt-4">
          Limpar filtro
        </Button>
      )}
    </div>
  );
}
