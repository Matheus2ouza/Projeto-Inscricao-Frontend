'use client';

import { useRegisterPayment } from '@/features/payments/hooks/registerPayment/useRegisterPayment';
import { RegisterPaymentResponse } from '@/features/payments/types/registerPayment/registerPaymentTypes';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import {
  CheckCheck,
  Copy,
  CreditCard,
  FileText,
  ImageIcon,
  QrCode,
  X,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface RegisterPaymentPixProps {
  selectedInscriptions: { id: string }[];
  eventId: string;
  totalValue: number;
  allowCard?: boolean;
  onPaymentRegistered?: (payment: RegisterPaymentResponse) => void;
  allowCustomValue?: boolean;
}

export default function RegisterPaymentPix({
  selectedInscriptions,
  eventId,
  totalValue,
  allowCard = false,
  onPaymentRegistered,
  allowCustomValue = true,
}: RegisterPaymentPixProps) {
  const [paymentValue, setPaymentValue] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Hook para registrar pagamento
  const registerPayment = useRegisterPayment();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  const bankData = {
    beneficiary: 'Rosymeire de Oliveira E Brito',
    bank: 'Nubank',
    agency: '0001',
    account: '53874496-8',
    pixKey: '400.588.752-04',
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
      reader.readAsDataURL(file);
    });
  };

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido', {
        description: 'Por favor, selecione uma imagem JPG, PNG ou WebP.',
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Arquivo muito grande', {
        description: 'O tamanho máximo permitido é 5MB.',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success('Copiado!', {
      description: 'Copiado para a área de transferência',
    });
  };

  const handleGoToCardPayment = () => {
    const isGuestFlow = pathname?.startsWith('/guest/');
    const basePath = isGuestFlow
      ? `/guest/${eventId}/payment/card`
      : `/user/payment/register/${eventId}/card`;
    const search = new URLSearchParams();
    if (selectedInscriptions.length > 0) {
      search.set(
        'inscriptions',
        selectedInscriptions.map((s) => s.id).join(','),
      );
    }
    search.set('totalValue', String(totalValue));
    router.push(`${basePath}?${search.toString()}`);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((!paymentValue && allowCustomValue) || !receiptFile) {
      toast.error('Campos obrigatórios', {
        description: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const resolvedValue = allowCustomValue
      ? parseFloat(paymentValue)
      : totalValue;
    if (Number.isNaN(resolvedValue)) {
      toast.error('Valor inválido', {
        description: 'Não foi possível identificar o valor pago.',
      });
      return;
    }

    if (allowCustomValue) {
      if (resolvedValue <= 0 || resolvedValue > totalValue) {
        toast.error('Valor inválido', {
          description: `Por favor, insira um valor entre R$ 0,01 e ${getFormatCurrency(totalValue)}.`,
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const imageData =
        receiptPreview && receiptPreview.length > 0
          ? receiptPreview
          : await readFileAsDataURL(receiptFile);

      const paymentResult = await registerPayment.mutateAsync({
        eventId,
        input: {
          accountId: '',
          totalValue: resolvedValue,
          image: imageData,
          inscriptions: selectedInscriptions.map((ins) => ({ id: ins.id })),
        },
      });

      setPaymentValue('');
      setReceiptFile(null);
      setReceiptPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onPaymentRegistered && paymentResult) {
        onPaymentRegistered(paymentResult);
      }

      toast.success('Pagamento registrado com sucesso!', {
        description: 'Sua inscrição foi processada.',
      });
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento', {
        description:
          error instanceof Error ? error.message : 'Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'image/jpeg': 'JPEG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
      'image/webp': 'WebP',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="liquid-card w-full border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-riodavida/10 rounded-lg p-2">
                  <QrCode className="text-riodavida h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                    Dados para Transferência PIX
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Utilize estas informações para realizar o pagamento
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(bankData).map(([key, value]) => {
                    const labels: { [key: string]: string } = {
                      beneficiary: 'Favorecido',
                      bank: 'Banco',
                      agency: 'Agência',
                      account: 'Conta',
                      pixKey: 'Chave PIX',
                    };

                    const isPixKey = key === 'pixKey';

                    return (
                      <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {labels[key]}
                        </Label>
                        <div
                          className={`flex items-center justify-between rounded-lg p-3 ${
                            isPixKey
                              ? 'border-riodavida/20 bg-riodavida/5 border'
                              : 'bg-riodavida/5 dark:bg-riodavida/10'
                          }`}
                        >
                          <div
                            className={`font-medium ${
                              isPixKey
                                ? 'text-riodavida'
                                : 'text-riodavida-gray-dark dark:text-riodavida-gray'
                            }`}
                          >
                            {value}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(value, key)}
                            className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                          >
                            {copiedField === key ? (
                              <CheckCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 rounded-xl border p-4">
                  <h3 className="text-riodavida dark:text-riodavida-light mb-2 font-semibold">
                    Instruções importantes:
                  </h3>
                  <ul className="text-riodavida-gray-dark dark:text-riodavida-gray space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="bg-riodavida mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span>
                        Realize o pagamento via PIX com os dados acima
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-riodavida mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span>
                        Caso o comprovante esteja em formato{' '}
                        <strong>PDF</strong> então poderá tirar um print ou foto
                        do comprovante e enviá-lo no formulário
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-riodavida mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      <span>Envie o comprovante no formulário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-riodavida mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                      {allowCustomValue ? (
                        <span>O valor pode ser pago parcial ou total</span>
                      ) : (
                        <span>O valor deve ser exatamente o valor total</span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {allowCard && (
            <Card className="liquid-card w-full border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="bg-riodavida/10 rounded-lg p-2">
                    <CreditCard className="text-riodavida h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray font-semibold">
                      Pagar com Cartão
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pagamento instantâneo com cartão de crédito
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleGoToCardPayment}
                  variant="outline"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark h-12 w-full"
                >
                  Ir para pagamento com cartão
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-full">
          <Card className="liquid-card h-full w-full border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-riodavida/10 rounded-lg p-2">
                  <ImageIcon className="text-riodavida h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                    Enviar Comprovante
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Após realizar o pagamento, envie o comprovante aqui
                  </p>
                </div>
              </div>

              <div className="bg-riodavida/5 border-riodavida/20 mb-6 rounded-xl border p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Valor total
                </div>
                <div className="text-riodavida dark:text-riodavida-light text-2xl font-bold">
                  {getFormatCurrency(totalValue)}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="paymentValue" className="text-sm font-medium">
                    Valor Pago{allowCustomValue ? '*' : ''}
                  </Label>
                  {allowCustomValue ? (
                    <>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                          R$
                        </span>
                        <Input
                          id="paymentValue"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={totalValue}
                          placeholder="0,00"
                          value={paymentValue}
                          onChange={(e) => setPaymentValue(e.target.value)}
                          required
                          className="focus:border-riodavida focus:ring-riodavida/20 h-12 pl-10 text-lg font-semibold"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Insira o valor que você pagou (máximo:{' '}
                        {getFormatCurrency(totalValue)})
                      </p>
                    </>
                  ) : (
                    <div className="border-riodavida/20 bg-riodavida/5 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-riodavida dark:text-riodavida-light text-lg font-bold">
                            {getFormatCurrency(totalValue)}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            Valor fixo da inscrição
                          </div>
                        </div>
                        <div className="bg-riodavida/10 text-riodavida dark:text-riodavida-light rounded px-2 py-1 text-xs">
                          Obrigatório
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="bg-riodavida/10" />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Comprovante de Pagamento*
                  </Label>
                  <p className="mb-4 text-xs text-gray-500">
                    Envie o comprovante do pagamento realizado
                  </p>

                  {receiptFile ? (
                    <div className="space-y-4">
                      {receiptPreview && (
                        <div className="group border-riodavida/20 bg-riodavida/5 relative overflow-hidden rounded-xl border-2">
                          <div className="relative aspect-video">
                            <img
                              src={receiptPreview}
                              alt="Preview do comprovante"
                              className="h-full w-full object-contain p-4"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-9 w-9 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                onClick={handleRemoveFile}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="absolute right-3 bottom-3 left-3">
                            <div className="rounded-lg bg-black/70 p-3 text-white backdrop-blur-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="truncate text-sm font-medium">
                                    {receiptFile.name}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-300">
                                  {formatFileSize(receiptFile.size)}
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-gray-300">
                                {getFileTypeName(receiptFile.type)} • Enviado
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRemoveFile}
                          className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark gap-2"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Trocar Comprovante
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                        isDragOver
                          ? 'border-riodavida bg-riodavida/5 scale-[1.02]'
                          : 'border-riodavida/30 hover:border-riodavida hover:bg-riodavida/5'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div
                            className={`rounded-full p-4 transition-all ${
                              isDragOver
                                ? 'bg-riodavida/20 scale-110'
                                : 'bg-riodavida/10'
                            }`}
                          >
                            {isDragOver ? (
                              <svg
                                className="text-riodavida h-8 w-8 animate-bounce"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <ImageIcon className="text-riodavida h-8 w-8" />
                            )}
                          </div>
                          {isDragOver && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-green-500" />
                          )}
                        </div>

                        <div>
                          <p className="text-riodavida-gray-dark dark:text-riodavida-gray mb-1 font-medium">
                            {isDragOver
                              ? 'Solte o arquivo aqui'
                              : 'Clique para fazer upload'}
                          </p>
                          <p className="text-sm text-gray-500">
                            ou arraste e solte o arquivo aqui
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs text-gray-500">JPG</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-xs text-gray-500">PNG</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            <span className="text-xs text-gray-500">WebP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span className="text-xs text-gray-500">5MB</span>
                          </div>
                        </div>

                        {!isDragOver && (
                          <div className="bg-riodavida/5 mt-3 flex items-center gap-2 rounded-lg p-2">
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-xs text-gray-500">
                              Caso seja PDF, tire um screenshot do comprovante e
                              envie.
                            </span>
                          </div>
                        )}
                      </div>

                      <Input
                        ref={fileInputRef}
                        id="receipt-upload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>

                <div className="border-riodavida/20 border-t pt-6">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !receiptFile ||
                      (allowCustomValue ? !paymentValue : false)
                    }
                    className="bg-riodavida hover:bg-riodavida-dark h-12 w-full text-base font-semibold text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Registrando pagamento...
                      </div>
                    ) : (
                      'Registrar Pagamento'
                    )}
                  </Button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    Após registrar, sua inscrição será processada
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
