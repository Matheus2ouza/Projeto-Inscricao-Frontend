import { ComboboxAccountSingle } from '@/features/accounts/components/ComboboxAccount';
import ImageUpload from '@/shared/components/ImageUpload';
import type { InputNumberProps, UploadFile } from 'antd';
import { InputNumber } from 'antd';
import { DollarSign, Paperclip, User, UserRound, UserStar } from 'lucide-react';

interface PaymentDataStepProps {
  paymentAmount: number;
  setPaymentAmount: (value: number) => void;
  payerType: 'account' | 'guest';
  setPayerType: (value: 'account' | 'guest') => void;
  payerName: string;
  setPayerName: (value: string) => void;
  accountId: string;
  setAccountId: (value: string) => void;
  fileList: UploadFile[];
  setFileList: (value: UploadFile[]) => void;
  imageData: string | null;
  setImageData: (value: string | null) => void;
  setFormError: (value: string | null) => void;
}

export default function PaymentDataStep({
  paymentAmount,
  setPaymentAmount,
  payerType,
  setPayerType,
  payerName,
  setPayerName,
  accountId,
  setAccountId,
  fileList,
  setFileList,
  setImageData,
  setFormError,
}: PaymentDataStepProps) {
  const formatter: InputNumberProps<number>['formatter'] = (value) => {
    if (value === undefined || value === null) return '';
    const [start, end] = `${value}`.split('.');
    const integer = start.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${end ? `${integer},${end}` : integer}`;
  };

  return (
    <div className="space-y-6">
      {/* Valor do Pagamento */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <DollarSign className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Valor do Pagamento</h3>
              <p className="text-muted-foreground text-sm">
                Informe o valor total que será pago
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="mr-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Valor total (R$)
            </label>
            <InputNumber
              min={0}
              step={0.01}
              value={paymentAmount}
              onChange={(value) => {
                const next =
                  value === null || value === undefined ? 0 : Number(value);
                setPaymentAmount(Number(next.toFixed(2)));
              }}
              stringMode
              className="w-full"
              size="medium"
              formatter={formatter}
              parser={(value) =>
                Number(value?.replace(/[R$\s.]/g, '').replace(',', '.')) || 0
              }
              placeholder="0,00"
            />
            <p className="text-muted-foreground text-xs">
              Este valor será distribuído entre as inscrições selecionadas
            </p>
          </div>
        </div>
      </div>

      {/* Dados do Pagador */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <User className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Dados do Pagador</h3>
              <p className="text-muted-foreground text-sm">
                Selecione o tipo de pagador e forneça as informações necessárias
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipo de pagador
              </label>
              <div className="w-full">
                <div className="grid grid-cols-2 gap-4">
                  {/* ACCOUNT */}
                  <div
                    onClick={() => setPayerType('account')}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                      payerType === 'account'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    <UserRound className="text-primary h-6 w-6" />

                    <div className="text-sm font-semibold">Conta</div>

                    <div className="text-muted-foreground text-xs leading-tight">
                      Pagamento via conta
                    </div>
                  </div>

                  {/* GUEST */}
                  <div
                    onClick={() => setPayerType('guest')}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-5 text-center transition-all ${
                      payerType === 'guest'
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    <UserStar className="text-primary h-6 w-6" />

                    <div className="text-sm font-semibold">Guest</div>

                    <div className="text-muted-foreground text-xs leading-tight">
                      Pagamento avulso
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {payerType === 'account' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Conta responsável
                </label>
                <ComboboxAccountSingle
                  value={accountId}
                  onChange={(value) => setAccountId(value)}
                  placeholder="Selecione a conta responsável"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome do pagador
                </label>
                <input
                  value={payerName}
                  onChange={(event) => setPayerName(event.target.value)}
                  placeholder="Digite o nome completo do pagador"
                  className="focus:border-primary focus:ring-primary/10 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comprovante */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <Paperclip className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Comprovante</h3>
              <p className="text-muted-foreground text-sm">
                Faça upload de uma imagem do comprovante de pagamento
              </p>
            </div>
          </div>

          <ImageUpload
            value={fileList}
            onChange={(next) => {
              setFileList(next);
              if (next.length === 0) {
                setImageData(null);
              }
            }}
            maxCount={1}
            title="Clique ou arraste o comprovante aqui"
            description="Apenas arquivos de imagem são aceitos (PNG, JPG, JPEG)"
            onInvalidFile={(msg) => {
              setFormError(msg);
              setImageData(null);
            }}
            onDataUrlChange={(dataUrl) => {
              if (!dataUrl) {
                setImageData(null);
                return;
              }
              setFormError(null);
              setImageData(dataUrl);
            }}
          />
        </div>
      </div>
    </div>
  );
}
