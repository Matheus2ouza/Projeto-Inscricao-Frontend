import type { RegisterPaymentCardSchema } from '@/features/payments/schema/registerPaymendCarcSchema';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Controller, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type RegisterPaymentCardDialogProps = {
  inscriptionsIds: string[];
  totalValue: number;
  onCancel: () => void;
  form: UseFormReturn<RegisterPaymentCardSchema>;
  onSubmitPayment: (passCustomerToAsaas: boolean) => Promise<{
    success: boolean;
    error?: string;
    redirectUrl?: string;
  }>;
};

type Step = 'dados-titular' | 'endereco';

export default function RegisterPaymentCard({
  inscriptionsIds,
  totalValue,
  onCancel,
  form,
  onSubmitPayment,
}: RegisterPaymentCardDialogProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = form;

  const [currentStep, setCurrentStep] = useState<Step>('dados-titular');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isCepResolved, setIsCepResolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passCustomerDialogOpen, setPassCustomerDialogOpen] = useState(false);

  const [extraAddressDetails, setExtraAddressDetails] = useState({
    bairro: '',
    localidade: '',
  });

  const lastCepFetchedRef = useRef<string | null>(null);
  const inFlightCepRef = useRef<string | null>(null);
  const cepFetchIdRef = useRef(0);

  const postalCode = useWatch({
    control: form.control,
    name: 'postalCode',
  });
  const provinceValue = useWatch({
    control: form.control,
    name: 'province',
  });

  const formatCep = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const nameError = errors.name?.message;
  const emailError = errors.email?.message;
  const telefoneError = errors.telefone?.message;
  const cpfCnpjError = errors.cpfCnpj?.message;
  const postalCodeError = errors.postalCode?.message;
  const addressError = errors.address?.message;
  const addressNumberError = errors.addressNumber?.message;
  const complementError = errors.complement?.message;
  const provinceError = errors.province?.message;
  const cityError = errors.city?.message;

  useEffect(() => {
    const cleanCep = (postalCode ?? '').replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      lastCepFetchedRef.current = null;
      inFlightCepRef.current = null;
      setIsCepLoading(false);
      setIsCepResolved(false);
      return;
    }

    if (lastCepFetchedRef.current === cleanCep) return;
    if (inFlightCepRef.current === cleanCep) return;
    inFlightCepRef.current = cleanCep;

    setIsCepResolved(false);
    form.setValue('city', '', { shouldValidate: false });
    setExtraAddressDetails({ bairro: '', localidade: '' });

    const abortController = new AbortController();
    const fetchId = ++cepFetchIdRef.current;

    (async () => {
      setIsCepLoading(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
          { signal: abortController.signal },
        );

        if (!response.ok) return;

        const data = (await response.json()) as {
          erro?: boolean;
          logradouro?: string;
          complemento?: string;
          ibge?: string;
          localidade?: string;
          uf?: string;
          bairro?: string;
        };

        if (data.erro) return;
        if (!data.logradouro && !data.ibge && !data.uf) return;

        lastCepFetchedRef.current = cleanCep;
        if (data.logradouro) {
          form.setValue('address', data.logradouro, { shouldValidate: true });
        }
        if (data.ibge) {
          form.setValue('city', data.ibge, { shouldValidate: true });
        }
        if (data.uf) {
          form.setValue('province', data.uf, { shouldValidate: true });
        }

        setExtraAddressDetails({
          bairro: data.bairro || '',
          localidade: data.localidade || '',
        });
        setIsCepResolved(Boolean(data.ibge));
      } catch (error) {
        if (abortController.signal.aborted) return;
        setIsCepResolved(false);
      } finally {
        if (cepFetchIdRef.current === fetchId) {
          setIsCepLoading(false);
        }
        if (inFlightCepRef.current === cleanCep) {
          inFlightCepRef.current = null;
        }
      }
    })();

    return () => {
      abortController.abort();
      if (inFlightCepRef.current === cleanCep) {
        inFlightCepRef.current = null;
      }
    };
  }, [postalCode, form]);

  useEffect(() => {
    if (isCepResolved) return;

    const uf = (provinceValue ?? '').trim().toUpperCase();
    const cityName = (extraAddressDetails.localidade ?? '').trim();

    if (!uf || uf.length !== 2) {
      form.setValue('city', '', { shouldValidate: false });
      return;
    }
    if (!cityName) {
      form.setValue('city', '', { shouldValidate: false });
      return;
    }

    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const normalizedCityName = normalize(cityName);
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
          { signal: abortController.signal },
        );
        if (!response.ok) return;

        const municipios = (await response.json()) as Array<{
          id: number;
          nome: string;
        }>;

        const exact = municipios.find(
          (m) => normalize(m.nome) === normalizedCityName,
        );

        const fallback =
          exact ??
          municipios.find((m) =>
            normalize(m.nome).startsWith(normalizedCityName),
          );

        if (!fallback) return;

        form.setValue('city', String(fallback.id), { shouldValidate: true });
      } catch {
        return;
      }
    }, 450);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [extraAddressDetails.localidade, form, isCepResolved, provinceValue]);

  const handleNextStep = async () => {
    const fieldsToValidate = ['name', 'email', 'telefone', 'cpfCnpj'] as const;

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep('endereco');
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePreviousStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep('dados-titular');
      setIsTransitioning(false);
      form.setValue('postalCode', '');
      form.setValue('address', '');
      form.setValue('addressNumber', '');
      form.setValue('complement', '');
      form.setValue('province', '');
      form.setValue('city', '');
      setExtraAddressDetails({
        bairro: '',
        localidade: '',
      });
      lastCepFetchedRef.current = null;
      inFlightCepRef.current = null;
    }, 300);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (currentStep === 'dados-titular') {
      await handleNextStep();
      return;
    }

    if (isCepLoading) {
      toast.error('Aguarde a busca do CEP terminar.');
      return;
    }

    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    setPassCustomerDialogOpen(true);
  };

  const handleSubmitPayment = async (passCustomerToAsaas: boolean) => {
    setPassCustomerDialogOpen(false);
    setIsSubmitting(true);

    const result = await onSubmitPayment(passCustomerToAsaas);
    if (result.success) {
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        setIsSubmitting(false);
        return;
      }
      toast.error('Link de redirecionamento inválido.');
      setIsSubmitting(false);
      return;
    }

    toast.error('Não foi possível registrar o pagamento no cartão', {
      description: result.error,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Informações do pagamento */}
      <div className="bg-muted/20 space-y-4 rounded-xl border p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">
              Inscrições selecionadas
            </p>
            <p className="text-sm font-medium">
              {inscriptionsIds.length}{' '}
              {inscriptionsIds.length === 1 ? 'inscrição' : 'inscrições'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Valor total</p>
            <p className="text-lg font-semibold">
              {getFormatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-6 rounded-xl border p-6">
        {/* Desktop Progress Bar */}
        <div className="mx-auto hidden w-[80%] items-center justify-between md:flex">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep === 'dados-titular'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <span
              className={`text-sm ${
                currentStep === 'dados-titular'
                  ? 'font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Dados do titular
            </span>
          </div>
          <div className="bg-muted mx-4 h-0.5 flex-1" />
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                currentStep === 'endereco'
                  ? 'font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Endereço
            </span>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep === 'endereco'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="flex w-full justify-between px-2 md:hidden">
          <div className="z-10 flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep === 'dados-titular'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <span
              className={`text-xs ${
                currentStep === 'dados-titular'
                  ? 'font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Titular
            </span>
          </div>

          <div className="bg-muted mx-2 mt-4 h-0.5 flex-1" />

          <div className="z-10 flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                currentStep === 'endereco'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs ${
                currentStep === 'endereco'
                  ? 'font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Endereço
            </span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          {/* Container principal com altura dinâmica */}
          <div className="relative overflow-hidden">
            {/* Passo 1: Dados do Titular */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                currentStep === 'dados-titular'
                  ? 'relative translate-x-0 opacity-100'
                  : 'absolute top-0 left-0 w-full -translate-x-full opacity-0'
              }`}
            >
              <div className="space-y-4 rounded-xl border p-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Dados do titular</h3>
                  <p className="text-muted-foreground text-xs">
                    Use os dados do responsável pelo pagamento.
                  </p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="card-name">Nome completo</Label>
                    <Input
                      id="card-name"
                      {...register('name')}
                      placeholder="Seu nome completo"
                      className="md:text-base"
                    />
                    {nameError && (
                      <p className="text-destructive text-xs">{nameError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-email">Email</Label>
                    <Input
                      id="card-email"
                      type="email"
                      {...register('email')}
                      placeholder="seuemail@exemplo.com"
                      className="md:text-base"
                    />
                    {emailError && (
                      <p className="text-destructive text-xs">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-phone">Telefone</Label>
                    <Controller
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <Input
                          id="card-phone"
                          type="tel"
                          value={field.value ? formatPhone(field.value) : ''}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value
                                .replace(/\D/g, '')
                                .slice(0, 11),
                            )
                          }
                          placeholder="(11) 99999-8888"
                          maxLength={15}
                          className="md:text-base"
                        />
                      )}
                    />
                    {telefoneError && (
                      <p className="text-destructive text-xs">
                        {telefoneError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-cpf">CPF</Label>
                    <Controller
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <Input
                          id="card-cpf"
                          value={field.value ? formatCPF(field.value) : ''}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value
                                .replace(/\D/g, '')
                                .slice(0, 11),
                            )
                          }
                          placeholder="123.456.789-09"
                          maxLength={14}
                          className="md:text-base"
                        />
                      )}
                    />
                    {cpfCnpjError && (
                      <p className="text-destructive text-xs">{cpfCnpjError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 2: Endereço */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                currentStep === 'endereco'
                  ? 'relative translate-x-0 opacity-100'
                  : 'absolute top-0 left-0 w-full translate-x-full opacity-0'
              }`}
            >
              <div className="space-y-4 rounded-xl border p-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    Endereço de cobrança
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Preenchido automaticamente ao informar o CEP.
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="col-span-1 space-y-2 md:col-span-4">
                    <Label htmlFor="card-postalCode">CEP</Label>
                    <Controller
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <Input
                          id="card-postalCode"
                          value={field.value ?? ''}
                          onChange={(event) =>
                            field.onChange(formatCep(event.target.value))
                          }
                          placeholder="00000-000"
                          maxLength={9}
                          className="md:text-base"
                        />
                      )}
                    />
                    {postalCodeError && (
                      <p className="text-destructive text-xs">
                        {postalCodeError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-12">
                    <Label htmlFor="card-address">Endereço</Label>
                    <Input
                      id="card-address"
                      {...register('address')}
                      placeholder="Rua / Avenida"
                      className="md:text-base"
                    />
                    {addressError && (
                      <p className="text-destructive text-xs">{addressError}</p>
                    )}
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-3">
                    <Label htmlFor="card-addressNumber">Número</Label>
                    <Input
                      id="card-addressNumber"
                      {...register('addressNumber')}
                      placeholder="123"
                      className="md:text-base"
                    />
                    {addressNumberError && (
                      <p className="text-destructive text-xs">
                        {addressNumberError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-9">
                    <Label htmlFor="card-complement">Complemento</Label>
                    <Input
                      id="card-complement"
                      {...register('complement')}
                      placeholder="Apto / Bloco (opcional)"
                      className="md:text-base"
                    />
                    {complementError && (
                      <p className="text-destructive text-xs">
                        {complementError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-5">
                    <Label htmlFor="card-bairro">Bairro</Label>
                    <Input
                      id="card-bairro"
                      value={extraAddressDetails.bairro}
                      onChange={(event) =>
                        setExtraAddressDetails((current) => ({
                          ...current,
                          bairro: event.target.value,
                        }))
                      }
                      readOnly={isCepResolved}
                      className={`md:text-base ${isCepResolved ? 'bg-muted text-muted-foreground' : ''}`}
                    />
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-5">
                    <Label htmlFor="card-city-display">Cidade</Label>
                    <Input
                      id="card-city-display"
                      value={extraAddressDetails.localidade}
                      onChange={(event) => {
                        const value = event.target.value;
                        setExtraAddressDetails((current) => ({
                          ...current,
                          localidade: value,
                        }));
                        form.setValue('city', '', { shouldValidate: false });
                      }}
                      readOnly={isCepResolved}
                      className={`md:text-base ${isCepResolved ? 'bg-muted text-muted-foreground' : ''}`}
                    />
                  </div>

                  <div className="col-span-1 space-y-2 md:col-span-2">
                    <Label htmlFor="card-province">UF</Label>
                    <Input
                      id="card-province"
                      {...register('province')}
                      placeholder="SP"
                      className="md:text-base"
                    />
                    {provinceError && (
                      <p className="text-destructive text-xs">
                        {provinceError}
                      </p>
                    )}
                  </div>
                </div>

                <input type="hidden" {...register('city')} />
                {cityError && (
                  <p className="text-destructive text-sm">{cityError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="flex items-center justify-end gap-2">
            {currentStep === 'dados-titular' ? (
              <>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCepLoading}>
                  Continuar para endereço
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                >
                  Voltar para dados
                </Button>
                <Button type="submit" disabled={isCepLoading || isSubmitting}>
                  Seguir para pagamento
                </Button>
              </>
            )}
          </div>
        </form>

        <Modal
          open={passCustomerDialogOpen}
          onCancel={() => {
            if (isSubmitting) return;
            setPassCustomerDialogOpen(false);
          }}
          title="Usar os dados?"
          footer={[
            <Button
              key="no"
              type="button"
              variant="outline"
              className="mr-3"
              disabled={isSubmitting}
              onClick={() => handleSubmitPayment(false)}
            >
              Não
            </Button>,
            <Button
              key="yes"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmitPayment(true)}
            >
              Sim
            </Button>,
          ]}
        >
          <p className="text-muted-foreground text-sm">
            Deseja utilizar os dados informados também como dados do cartão?
          </p>
        </Modal>
      </div>
    </div>
  );
}
