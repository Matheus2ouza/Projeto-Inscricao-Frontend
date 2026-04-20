import useFormCreatePaymentCard from '@/features/payments/hooks/registerPayment/useRegisterPaymentCard';
import { Event } from '@/features/payments/types/registerPaymentPublic/registerPaymentPublicType';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { formatDate } from '@/shared/utils/formatDate';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { getInitial } from '@/shared/utils/getInitials';
import { Calendar, CreditCardIcon, Loader2, Ticket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface RegisterPaymentCardPublicTableProps {
  event: Event | null;
  eventId: string;
  inscriptionsIds: string[];
  totalValue: number;
  userId: string;
}

type Step = 'dados-titular' | 'endereco';

export default function RegisterPaymentCardPublicTable({
  event,
  eventId,
  inscriptionsIds,
  totalValue,
  userId,
}: RegisterPaymentCardPublicTableProps) {
  const { form, onSubmit } = useFormCreatePaymentCard();
  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
  } = form;

  const [currentStep, setCurrentStep] = useState<Step>('dados-titular');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);

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
      return;
    }

    if (lastCepFetchedRef.current === cleanCep) return;
    if (inFlightCepRef.current === cleanCep) return;
    inFlightCepRef.current = cleanCep;

    const abortController = new AbortController();
    const fetchId = ++cepFetchIdRef.current;

    (async () => {
      setIsCepLoading(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error('CEP inválido');
        }

        const data = (await response.json()) as {
          erro?: boolean;
          logradouro?: string;
          complemento?: string;
          ibge?: string;
          localidade?: string;
          uf?: string;
          bairro?: string;
        };

        if (data.erro) {
          throw new Error('CEP não encontrado');
        }

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
      } catch (error) {
        if (abortController.signal.aborted) return;

        toast.error('Não foi possível buscar o CEP', {
          description:
            error instanceof Error
              ? error.message
              : 'Verifique o CEP e tente novamente.',
        });

        form.setValue('address', '', { shouldValidate: true });
        form.setValue('city', '', { shouldValidate: true });
        form.setValue('province', '', { shouldValidate: true });
        setExtraAddressDetails({ bairro: '', localidade: '' });
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

    const result = await onSubmit(eventId, totalValue, inscriptionsIds, userId);
    if (result.success) {
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      toast.error('Link de redirecionamento inválido.');
      return;
    }

    toast.error('Não foi possível registrar o pagamento no cartão', {
      description: result.error,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Event Details */}
      {event && (
        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="h-32 w-full rounded-lg object-cover md:w-48"
              />
            ) : (
              <div
                className={`flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br md:w-48 ${getGradientClass(
                  event.name,
                )}`}
              >
                <span className="text-3xl font-bold text-white">
                  {getInitial(event.name)}
                </span>
              </div>
            )}
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold uppercase">{event.name}</h2>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(event.startDate)} até {formatDate(event.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações do pagamento */}
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="leading-none font-semibold tracking-tight">
            Resumo da Inscrição
          </h3>
        </div>
        <div className="grid gap-4 p-6 pt-0 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-background flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Ticket className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Quantidade
              </p>
              <p className="text-xl font-bold">
                {inscriptionsIds.length}{' '}
                {inscriptionsIds.length === 1 ? 'Inscrição' : 'Inscrições'}
              </p>
            </div>
          </div>

          <div className="bg-background flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 rounded-full p-2">
              <CreditCardIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total a Pagar
              </p>
              <p className="text-primary text-xl font-bold">
                {getFormatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-6 rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
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
        <div className="flex items-center justify-between text-sm font-medium md:hidden">
          <span>
            {currentStep === 'dados-titular'
              ? 'Passo 1: Dados do titular'
              : 'Passo 2: Endereço'}
          </span>
          <span className="text-muted-foreground">
            {currentStep === 'dados-titular' ? '1/2' : '2/2'}
          </span>
        </div>
        <div className="bg-muted h-2 overflow-hidden rounded-full md:hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: currentStep === 'dados-titular' ? '50%' : '100%' }}
          />
        </div>

        <Separator />

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div
            className={`transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {currentStep === 'dados-titular' ? (
              <div className="animate-in fade-in slide-in-from-left-4 space-y-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome completo do titular"
                    {...register('name')}
                  />
                  {nameError && (
                    <p className="text-destructive text-sm">{nameError}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      {...register('email')}
                    />
                    {emailError && (
                      <p className="text-destructive text-sm">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Controller
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <Input
                          id="telefone"
                          type="tel"
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          value={field.value ? formatPhone(field.value) : ''}
                          onChange={(e) => {
                            field.onChange(
                              e.target.value.replace(/\D/g, '').slice(0, 11),
                            );
                          }}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      )}
                    />
                    {telefoneError && (
                      <p className="text-destructive text-sm">
                        {telefoneError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Controller
                    control={form.control}
                    name="cpfCnpj"
                    render={({ field }) => (
                      <Input
                        id="cpfCnpj"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        value={field.value ? formatCPF(field.value) : ''}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value.replace(/\D/g, '').slice(0, 11),
                          );
                        }}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    )}
                  />
                  {cpfCnpjError && (
                    <p className="text-destructive text-sm">{cpfCnpjError}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    CEP (Preencha por primeiro)
                  </Label>
                  <div className="relative">
                    <Controller
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="postalCode"
                          placeholder="00000-000"
                          maxLength={9}
                          onChange={(e) => {
                            field.onChange(formatCep(e.target.value));
                          }}
                        />
                      )}
                    />
                    {isCepLoading && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                      </div>
                    )}
                  </div>
                  {postalCodeError && (
                    <p className="text-destructive text-sm">
                      {postalCodeError}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Demais campos de endereço */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Rua/Avenida</Label>
                      <Input
                        id="address"
                        placeholder="Nome da rua"
                        readOnly
                        className="bg-muted/50"
                        {...register('address')}
                      />
                      {addressError && (
                        <p className="text-destructive text-sm">
                          {addressError}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="addressNumber">Número</Label>
                        <Input
                          id="addressNumber"
                          placeholder="123"
                          {...register('addressNumber')}
                        />
                        {addressNumberError && (
                          <p className="text-destructive text-sm">
                            {addressNumberError}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Apto, Bloco, etc"
                          {...register('complement')}
                        />
                        {complementError && (
                          <p className="text-destructive text-sm">
                            {complementError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input
                        value={extraAddressDetails.bairro}
                        readOnly
                        className="bg-muted/50"
                        placeholder="Bairro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input
                        value={extraAddressDetails.localidade}
                        readOnly
                        className="bg-muted/50"
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Input
                        id="province"
                        readOnly
                        className="bg-muted/50 uppercase"
                        placeholder="UF"
                        {...register('province')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            {currentStep === 'endereco' ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
            ) : (
              <div /> // Spacer
            )}

            <Button type="submit" disabled={isSubmitting || isCepLoading}>
              {currentStep === 'dados-titular' ? (
                'Próximo'
              ) : isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                `Pagar ${getFormatCurrency(totalValue)}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
