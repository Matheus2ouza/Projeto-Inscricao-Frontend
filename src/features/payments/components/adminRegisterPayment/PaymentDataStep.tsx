import { ComboboxAccountSingle } from '@/features/accounts/components/ComboboxAccount';
import type { UploadFile } from 'antd';
import { InputNumber, Radio, Space, Upload } from 'antd';
import {
  DollarSign,
  Paperclip,
  UploadCloud,
  User,
  UserRound,
  UserStar,
} from 'lucide-react';

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Falha ao processar imagem.'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao processar imagem.'));
  });

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
  imageData,
  setImageData,
  setFormError,
}: PaymentDataStepProps) {
  const handleUploadChange = ({
    fileList: nextFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    const latestFileList = nextFileList.slice(-1);
    setFileList(latestFileList);

    const file = latestFileList[0]?.originFileObj as File | undefined;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Apenas imagem é permitida.');
        setImageData(null);
        return;
      }

      void getBase64(file).then((data) => {
        setFormError(null);
        setImageData(data);
      });
    } else {
      setImageData(null);
    }
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
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Valor total (R$)
            </label>
            <InputNumber
              min={0}
              step={0.01}
              value={paymentAmount}
              onChange={(value) => setPaymentAmount(value || 0)}
              stringMode
              className="w-full"
              size="large"
              formatter={(value) =>
                `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              }
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
              <Radio.Group
                value={payerType}
                onChange={(e) => setPayerType(e.target.value)}
                className="w-full"
                size="large"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      payerType === 'account'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    <Radio value="account" className="hidden" />
                    <div className="text-center">
                      <UserRound className="text-primary" />
                      <div className="font-medium">Conta</div>
                      <div className="text-muted-foreground text-xs">
                        Pagamento via conta
                      </div>
                    </div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      payerType === 'guest'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 dark:border-zinc-700'
                    }`}
                  >
                    <Radio value="guest" className="hidden" />
                    <div className="text-center">
                      <UserStar className="text-primary" />
                      <div className="font-medium">Guest</div>
                      <div className="text-muted-foreground text-xs">
                        Pagamento avulso
                      </div>
                    </div>
                  </div>
                </div>
              </Radio.Group>
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

          <Upload.Dragger
            multiple={false}
            beforeUpload={() => false}
            accept="image/*"
            fileList={fileList}
            onChange={handleUploadChange}
            className="hover:border-primary hover:bg-primary/5 dark:hover:border-primary rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors dark:border-zinc-700 dark:bg-zinc-900"
          >
            <Space direction="vertical" size={12} className="w-full">
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
              <div>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                  Clique ou arraste o comprovante aqui
                </p>
                <p className="text-muted-foreground text-sm">
                  Apenas arquivos de imagem são aceitos (PNG, JPG, JPEG)
                </p>
              </div>
            </Space>
          </Upload.Dragger>

          {imageData && (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Preview do comprovante:
              </p>
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={imageData}
                    alt="Preview do comprovante"
                    className="max-h-48 max-w-full rounded-lg border border-slate-200 shadow-md dark:border-zinc-800"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
