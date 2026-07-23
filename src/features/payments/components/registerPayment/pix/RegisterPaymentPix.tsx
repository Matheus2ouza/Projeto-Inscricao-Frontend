'use client';

import { useRegisterPaymentPix } from '@/features/payments/hooks/registerPayment/useRegisterPaymentPix';
import { DatePicker } from '@/shared/components/DatePicker';
import ImageUpload from '@/shared/components/ImageUpload';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/shared/components/ui';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import type { UploadFile } from 'antd';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface RegisterPaymentPixPublicProps {
  eventId: string;
  inscriptionIds: string[];
  name: string;
  email?: string;
  remainingValue: number;
}

export default function RegisterPaymentPix({
  eventId,
  inscriptionIds,
  name,
  email,
  remainingValue,
}: RegisterPaymentPixPublicProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [copied, setCopied] = useState(false);

  const { form, onSubmit, isLoading } = useRegisterPaymentPix(
    inscriptionIds,
    name,
    remainingValue,
    eventId,
    file,
    email,
  );

  const watchName = form.watch('name');
  const watchEmail = form.watch('email');
  const watchValue = form.watch('value');
  const watchDate = form.watch('date');

  const formattedValue = watchValue
    ? getFormatCurrency(Number(watchValue))
    : 'R$ 0,00';

  // Obter data e hora atuais sempre que o componente renderizar
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Formata o nome do dia da semana com primeira letra maiúscula
  const formattedWeekDay =
    formattedDate.split(',')[0].charAt(0).toUpperCase() +
    formattedDate.split(',')[0].slice(1);

  const formattedDateComplete = `${formattedWeekDay}, ${formattedDate.split(',')[1].trim()}`;

  // Dados da conta
  const accountData = {
    beneficiary: 'IGREJA EM CASTANHAL',
    bank: 'BANCO BRADESCO',
    agency: '979-0',
    account: '160368',
    pixKey: 'sociosdoevangelho.conenorte@gmail.com',
  };

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(accountData.pixKey);
      setCopied(true);
      toast.success('Chave PIX copiada!', {
        description: 'A chave PIX foi copiada para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Erro ao copiar', {
        description: 'Não foi possível copiar a chave PIX.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-6xl bg-transparent">
      <Card className="liquid-card overflow-hidden border-0 p-0 shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Coluna Esquerda - Formulário (fundo sólido) */}
          <div className="bg-riodavida/5 p-3 lg:p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  Valor pendente: {getFormatCurrency(remainingValue)}
                </h2>
                <p className="mt-1 text-base font-medium"></p>
              </div>

              {/* Dados da Conta */}
              <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-3 text-sm font-semibold">
                  Dados para Transferência
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Favorecido:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {accountData.beneficiary}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Banco:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {accountData.bank}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Agência:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {accountData.agency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Conta:
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {accountData.account}
                    </span>
                  </div>
                  <div className="border-riodavida/10 flex items-center justify-between border-t pt-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Chave PIX:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-sm text-gray-700 dark:text-gray-300">
                        {accountData.pixKey}
                      </span>
                      <button
                        onClick={handleCopyPixKey}
                        className="text-riodavida hover:text-riodavida-dark transition-colors"
                        title="Copiar chave PIX"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Nome do Pagador{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome completo"
                            className="focus:border-riodavida focus:ring-riodavida/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          E-mail do Pagador{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Digite o e-mail"
                            className="focus:border-riodavida focus:ring-riodavida/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Valor Pago <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                              R$
                            </span>
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0,00"
                              className="focus:border-riodavida focus:ring-riodavida/20 pl-10"
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                              value={
                                field.value === undefined
                                  ? ''
                                  : String(field.value)
                              }
                              onChange={(e) => {
                                const raw = e.target.value.replace(',', '.');
                                if (raw === '') {
                                  field.onChange(undefined);
                                  return;
                                }
                                if (!/^\d*\.?\d{0,2}$/.test(raw)) return;
                                field.onChange(Number(raw));
                              }}
                            />
                          </div>
                        </FormControl>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-500">
                            Valor máximo: {getFormatCurrency(remainingValue)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Valor mínimo: {getFormatCurrency(0.01)}
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Data do Pagamento{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            value={
                              field.value ? parseISO(field.value) : new Date()
                            }
                            onChange={(date) => {
                              if (date) {
                                // Formata para ISO completo com hora
                                const formattedDate = format(
                                  date,
                                  "yyyy-MM-dd'T'HH:mm:ss",
                                );
                                field.onChange(formattedDate);
                              } else {
                                field.onChange('');
                              }
                            }}
                            placeholder="Selecione a data e horário"
                            maxDate={new Date()}
                            required={true}
                            captionLayout="dropdown"
                            monthFormat="long"
                            className="w-full"
                            buttonClassName="border-riodavida/20 bg-riodavida/5 hover:border-riodavida/30 backdrop-blur-sm"
                            disabled={isLoading}
                            withTime={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Comprovante{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={uploadFiles}
                            onChange={setUploadFiles}
                            maxCount={1}
                            singleMode={true}
                            title="Adicionar comprovante"
                            accept=".jpg,.jpeg,.png,.webp"
                            className="w-full"
                            onFileChange={setFile}
                            onDataUrlsChange={(dataUrls) => {
                              setFilePreview(
                                typeof dataUrls === 'string' ? dataUrls : null,
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size={'lg'}
                    disabled={isLoading || !file}
                    className="bg-riodavida hover:bg-riodavida-dark h-10 w-full text-white"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processando...
                      </span>
                    ) : (
                      'Confirmar Pagamento'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Coluna Direita - Comprovante PIX + Avisos */}
          <div className="flex flex-col items-center justify-center space-y-4 bg-white/50 p-6 lg:p-8 dark:bg-gray-800/50">
            {/* Comprovante - Centralizado */}
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {/* Header - ícone Pix */}
              <div className="mb-4 flex items-center justify-center dark:border-gray-700">
                <img src="/images/pix.svg" alt="Pix" className="h-8 w-8" />
              </div>

              {/* Valor - Centralizado */}
              <div className="mt-2 text-center">
                <p className="text-riodavida text-3xl font-bold">
                  {formattedValue}
                </p>
              </div>

              {/* Separador */}
              <hr className="my-4 border-gray-300 dark:border-gray-700" />

              {/* Sobre a transação */}
              <h4 className="mb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sobre a transação
              </h4>

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Data do pagamento
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {watchDate && !isNaN(new Date(watchDate).getTime())
                      ? format(new Date(watchDate), 'EEEE, dd/MM/yyyy', {
                          locale: ptBR,
                        })
                      : formattedDateComplete}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Horário
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {watchDate && !isNaN(new Date(watchDate).getTime())
                      ? format(new Date(watchDate), 'HH:mm', {
                          locale: ptBR,
                        })
                      : formattedTime}
                  </p>
                </div>
              </div>

              {/* Separador */}
              <hr className="my-4 border-gray-300 dark:border-gray-700" />

              {/* Quem recebeu */}
              <h4 className="mb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Quem recebeu
              </h4>

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nome
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {accountData.beneficiary}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Agência
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {accountData.agency}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Conta
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {accountData.account}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Chave PIX
                  </p>
                  <div className="flex items-center gap-1 text-right">
                    <p className="truncate text-right text-xs font-medium text-gray-800 dark:text-gray-200">
                      {accountData.pixKey}
                    </p>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <hr className="my-4 border-gray-300 dark:border-gray-700" />

              {/* Quem pagou */}
              <h4 className="mb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Quem pagou
              </h4>

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nome
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {watchName || 'aguardando...'}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    E-mail
                  </p>
                  <p className="text-right text-sm font-medium text-gray-800 dark:text-gray-200">
                    {watchEmail || 'aguardando...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Avisos - Abaixo do comprovante */}
            <div className="w-full space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-blue-200/50 bg-blue-50/80 p-3 dark:border-blue-800/30 dark:bg-blue-900/20">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Verifique os dados:</span>{' '}
                  Antes de realizar o PIX, confira todos os dados da conta e o
                  valor a ser pago.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-amber-200/50 bg-amber-50/80 p-3 dark:border-amber-800/30 dark:bg-amber-900/20">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">Importante:</span> Uma vez
                  pago,{' '}
                  <span className="font-bold">
                    não será permitida a devolução
                  </span>{' '}
                  de inscrições pagas. Apenas poderá ser realizada a{' '}
                  <span className="font-bold">PERMUTA</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
