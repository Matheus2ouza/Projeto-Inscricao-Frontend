import { ListInscriptionsPending } from '@/features/payments/types/adminRegisterPayment/adminRegisterPaymentTypes';
import { RegisterPaymentInput } from '@/features/payments/types/adminRegisterPayment/registerPaymentType';
import { Button } from '@/shared/components/ui/button';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import type { UploadFile } from 'antd';
import { Steps } from 'antd';
import { useMemo, useState, type Key } from 'react';
import InscriptionSelectionStep from './InscriptionSelectionStep';
import PaymentDataStep from './PaymentDataStep';

const toCents = (value: number | string) =>
  Math.round(Number(value || 0) * 100);

interface RegisterPaymentProps {
  listInscriptions: ListInscriptionsPending[] | null;
  loading: boolean;
  registerPayment: (payload: RegisterPaymentInput) => Promise<unknown>;
  isRegisteringPayment: boolean;
}

export default function RegisterPayment({
  listInscriptions,
  loading,
  registerPayment,
  isRegisteringPayment,
}: RegisterPaymentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [payerType, setPayerType] = useState<'account' | 'guest'>('account');
  const [payerName, setPayerName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageData, setImageData] = useState<string | string[] | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedInscriptions = useMemo(
    () =>
      selectedIds
        .map((id) =>
          listInscriptions?.find((inscription) => inscription.id === id),
        )
        .filter((inscription): inscription is ListInscriptionsPending =>
          Boolean(inscription),
        ),
    [listInscriptions, selectedIds],
  );

  const totalPayment = useMemo(
    () =>
      selectedInscriptions.reduce(
        (sum: number, item) => sum + toCents(amounts[item.id] ?? 0),
        0,
      ) / 100,
    [amounts, selectedInscriptions],
  );

  const handleTransferChange = (nextTargetKeys: Key[]) => {
    const selectedStrings = nextTargetKeys.map(String);
    const nextAmounts = { ...amounts };

    selectedStrings.forEach((id) => {
      if (nextAmounts[id] === undefined) {
        const inscription = listInscriptions?.find((item) => item.id === id);
        if (inscription) {
          nextAmounts[id] = Number(
            (inscription.totalValue - inscription.totalPaid).toFixed(2),
          );
        }
      }
    });

    setSelectedIds(selectedStrings);
    setAmounts(nextAmounts);
  };

  const handleRemoveInscription = (id: string) => {
    setSelectedIds((prev) => prev.filter((value) => value !== id));
    setAmounts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleMoveInscription = (id: string, direction: 'up' | 'down') => {
    setSelectedIds((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleAmountChange = (id: string, value: number | null) => {
    const inscription = listInscriptions?.find((item) => item.id === id);
    if (!inscription) {
      return;
    }

    const remaining = Number(
      (inscription.totalValue - inscription.totalPaid).toFixed(2),
    );
    const normalized = value === null ? 0 : Number(value);
    const clamped = Math.min(Math.max(normalized, 0), remaining);
    setAmounts((prev) => ({
      ...prev,
      [id]: Number(clamped.toFixed(2)),
    }));
  };

  const validateStep1 = () => {
    if (paymentAmount <= 0) {
      setFormError('Informe o valor total do pagamento.');
      return false;
    }

    if (payerType === 'account' && !accountId) {
      setFormError('Selecione uma conta para o pagamento.');
      return false;
    }

    if (payerType === 'guest' && !payerName.trim()) {
      setFormError('Informe o nome do pagador.');
      return false;
    }

    if (!imageData) {
      setFormError('Envie uma imagem do comprovante.');
      return false;
    }

    setFormError(null);
    return true;
  };

  const validateStep2 = () => {
    if (selectedInscriptions.length === 0) {
      setFormError(
        'Selecione ao menos uma inscrição para receber o pagamento.',
      );
      return false;
    }

    const totalAllocated = selectedInscriptions.reduce(
      (sum: number, item) => sum + toCents(amounts[item.id] ?? 0),
      0,
    );

    if (totalAllocated !== toCents(paymentAmount)) {
      setFormError(
        `O total alocado (${getFormatCurrency(totalAllocated / 100)}) deve ser igual ao valor do pagamento (${getFormatCurrency(paymentAmount)}).`,
      );
      return false;
    }

    const invalidAmount = selectedInscriptions.some(
      (inscription: ListInscriptionsPending) => {
        const amount = amounts[inscription.id] ?? 0;
        const remaining = Number(
          (inscription.totalValue - inscription.totalPaid).toFixed(2),
        );
        return amount <= 0 || amount > remaining;
      },
    );
    if (invalidAmount) {
      setFormError('Verifique os valores de pagamento de cada inscrição.');
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && validateStep1()) {
      setCurrentStep(1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      return;
    }

    const paymentAmountCents = toCents(paymentAmount);
    const requestPayload: RegisterPaymentInput = {
      amount: paymentAmountCents / 100,
      image: imageData,
      isGuest: payerType === 'guest',
      guestName: payerType === 'guest' ? payerName.trim() : undefined,
      accountId: payerType === 'account' ? accountId : undefined,
      inscriptions: selectedInscriptions.map(
        (inscription: ListInscriptionsPending, index: number) => ({
          index,
          id: inscription.id,
          amount: Number((amounts[inscription.id] ?? 0).toFixed(2)),
        }),
      ),
    };

    try {
      await registerPayment(requestPayload);
      setCurrentStep(0);
      setSelectedIds([]);
      setAmounts({});
      setPaymentAmount(0);
      setPayerType('account');
      setFileList([]);
      setImageData(null);
      setPayerName('');
      setAccountId('');
    } catch {
      setFormError(
        'Erro ao registrar pagamento. Verifique os dados e tente novamente.',
      );
    }
  };

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">
            Registrar pagamento de inscrições
          </h2>
        </div>

        <Steps
          current={currentStep}
          className="mb-6"
          items={[
            {
              title: 'Dados do Pagamento',
            },
            {
              title: 'Selecionar Inscrições',
            },
          ]}
        />

        {currentStep === 0 && (
          <PaymentDataStep
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            payerType={payerType}
            setPayerType={setPayerType}
            payerName={payerName}
            setPayerName={setPayerName}
            accountId={accountId}
            setAccountId={setAccountId}
            fileList={fileList}
            setFileList={setFileList}
            imageData={imageData}
            setImageData={setImageData}
            setFormError={setFormError}
          />
        )}
      </div>

      {currentStep === 1 && (
        <InscriptionSelectionStep
          listInscriptions={listInscriptions}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          amounts={amounts}
          setAmounts={setAmounts}
          paymentAmount={paymentAmount}
          totalPayment={totalPayment}
          handleTransferChange={handleTransferChange}
          handleRemoveInscription={handleRemoveInscription}
          handleMoveInscription={handleMoveInscription}
          handleAmountChange={handleAmountChange}
        />
      )}

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {formError}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end">
        <div className="flex gap-2">
          {currentStep === 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              className="h-11"
            >
              Voltar
            </Button>
          )}
          {currentStep === 0 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="h-11"
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isRegisteringPayment || loading}
              className="h-11"
            >
              {isRegisteringPayment ? 'Registrando...' : 'Registrar pagamento'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
