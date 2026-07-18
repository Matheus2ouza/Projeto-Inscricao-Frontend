'use client';

import { useFormRegisterGuestInscription } from '@/features/guest/hook/guestInscription/useFormRegisterGuestInscription';
import {
  Event,
  TypeInscription,
} from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import {
  InscriptionStatus,
  RegisterGuestInscriptionResponse,
  genderOptions,
  shirtSizeOptions,
} from '@/features/guest/types/guestInscription/registerGuesInscriptionTypes';
import { LocalityCombobox } from '@/features/locality/components/LocalityCombobox';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/shared/components/DatePicker';
import { GuestInscriptionAlready } from '@/shared/components/GuestInscriptionAlready';
import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import type { ImageSwatches } from '@/shared/hooks/useImagePalette';
import { getWithExpiry, setWithExpiry } from '@/shared/utils/storageWithExpiry';
import { Input } from 'antd';
import { format, parseISO } from 'date-fns';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { EventDetailsCard } from './EventDetailsCard';
import { InscriptionSuccessModal } from './InscriptionSuccessModal';
import { InscriptionTypeSelector } from './InscriptionTypeCard';

interface RegisterGuestProps {
  event: Event;
  typeInscriptions: TypeInscription[];
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
}

export function RegisterGuest({
  event,
  typeInscriptions,
  palette,
  isDark,
  swatches,
}: RegisterGuestProps) {
  const router = useRouter();
  const [openGender, setOpenGender] = useState(false);
  const [openShirtSize, setOpenShirtSize] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] =
    useState<RegisterGuestInscriptionResponse | null>(null);
  const [paymentCountdownSeconds, setPaymentCountdownSeconds] = useState<
    number | null
  >(null);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const [typeInscriptionId, setTypeInscriptionId] = useState<string>('');
  const throttleKey = 'guest_inscription_already_throttle_5m';

  const handleViewInscription = (eventId: string, confirmationCode: string) => {
    const params = new URLSearchParams({ confirmationCode });
    router.push(`/guest/${eventId}/inscription?${params.toString()}`);
  };

  // Usando o novo hook
  const { form, onSubmit, isLoading } = useFormRegisterGuestInscription(
    event.id,
    event.participanteConfig,
  );

  const formData = form.watch();
  const control = form.control;

  // Efeito para sincronizar o typeInscriptionId com o formulário
  useEffect(() => {
    const current = formData.typeInscriptionId?.trim() ?? '';
    if (current === typeInscriptionId) return;
    setTypeInscriptionId(current);
  }, [formData.typeInscriptionId, typeInscriptionId]);

  // Filtrar tipos de inscrição baseado na data de nascimento
  const filteredTypeInscriptions = useMemo(() => {
    const birthDate = formData.birthDate?.trim();
    if (!birthDate || birthDate.length !== 10) return typeInscriptions;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return typeInscriptions;

    return typeInscriptions.filter((t) => {
      if (!t.rule) return true;
      const ruleDate = new Date(t.rule as unknown as string);
      if (Number.isNaN(ruleDate.getTime())) return true;
      return birth.getTime() >= ruleDate.getTime();
    });
  }, [typeInscriptions, formData.birthDate]);

  // Efeito para limpar o typeInscriptionId quando não for mais válido
  useEffect(() => {
    const current = form.getValues('typeInscriptionId')?.trim();
    if (!current) return;

    const stillValid = filteredTypeInscriptions.some(
      (t) => (t.id || t.description) === current,
    );
    if (stillValid) return;

    form.setValue('typeInscriptionId', '');
    setTypeInscriptionId('');
  }, [form, filteredTypeInscriptions]);

  // Efeito para verificar se já existe inscrição
  useEffect(() => {
    if (successModalOpen) {
      setAlreadyDialogOpen(false);
      return;
    }

    const cached = getWithExpiry<{
      eventId: string;
      confirmationCode: string;
      thereIsPayment?: boolean;
    }>('guest_inscription');

    if (
      !cached ||
      cached.eventId !== event.id ||
      !cached.confirmationCode ||
      cached.thereIsPayment
    ) {
      setAlreadyDialogOpen(false);
      return;
    }

    const throttled = getWithExpiry<boolean>(throttleKey);
    if (throttled) {
      setAlreadyDialogOpen(false);
      return;
    }

    setAlreadyDialogOpen(true);
  }, [event.id, successModalOpen, throttleKey]);

  // Efeito para o countdown do pagamento
  useEffect(() => {
    if (
      !successModalOpen ||
      successData?.status !== InscriptionStatus.PENDING
    ) {
      setPaymentCountdownSeconds(null);
      return;
    }

    setPaymentCountdownSeconds(30 * 60);
    const intervalId = window.setInterval(() => {
      setPaymentCountdownSeconds((prev) => {
        if (prev === null) return prev;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [successModalOpen, successData?.status]);

  // Funções para remover máscara (apenas números)
  const unformatCpf = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const unformatPhone = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Funções para aplicar máscara (exibição)
  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 9);
    const part4 = digits.slice(9, 11);

    let out = part1;
    if (part2) out += `.${part2}`;
    if (part3) out += `.${part3}`;
    if (part4) out += `-${part4}`;
    return out;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const ddd = digits.slice(0, 2);
    const first = digits.slice(2, 7);
    const last = digits.slice(7, 11);

    if (!ddd) return '';
    if (digits.length <= 2) return `(${ddd}`;
    if (digits.length <= 7) return `(${ddd}) ${first}`;
    return `(${ddd}) ${first}-${last}`;
  };

  const calculateMaxAge = (ruleDate?: Date) => {
    if (!ruleDate) return '';

    const today = new Date();
    const rule = new Date(ruleDate);
    const age = today.getFullYear() - rule.getFullYear();

    const hasHadBirthday =
      today.getMonth() > rule.getMonth() ||
      (today.getMonth() === rule.getMonth() &&
        today.getDate() >= rule.getDate());

    return hasHadBirthday ? age : age - 1;
  };

  // Função para lidar com o submit - remove máscaras antes de enviar
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const cleanedValues = {
        ...values,
        cpf: values.cpf ? unformatCpf(values.cpf) : '',
        phone: unformatPhone(values.phone),
      };

      form.setValue('cpf', cleanedValues.cpf as any);
      form.setValue('phone', cleanedValues.phone);

      const result = await onSubmit(); // <-- pega o retorno aqui

      if (result) {
        setWithExpiry('guest_inscription', {
          eventId: event.id,
          confirmationCode: result.confirmationCode,
          thereIsPayment: event.paymentEnabled,
        });

        setSuccessData({
          id: result.id,
          status: result.status,
          confirmationCode: result.confirmationCode,
          expiresAt: result.expiresAt,
        });
        setSuccessModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
    }
  });

  // CORES ESTRATÉGICAS: Apenas para elementos de destaque
  const primaryColor = palette[0] || (isDark ? '#2A8A85' : '#3FB5AE');
  const secondaryColor = palette[1] || (isDark ? '#8A9E2E' : '#A8BE3C');

  // Glass surface adaptado ao tema
  const glassSurfaceClass = isDark
    ? 'bg-white/10 border-white/10'
    : 'bg-black/5 border-black/10';

  // Pegando a config de campos do evento
  const { participanteConfig } = event;

  if (!event) {
    return (
      <div className="liquid-card rounded-2xl p-10 text-center">
        <h2 className="text-foreground mb-2 text-2xl font-semibold">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GuestInscriptionAlready
        open={alreadyDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          }
          setAlreadyDialogOpen(open);
        }}
        onView={() => {
          setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          setAlreadyDialogOpen(false);
          const cached = getWithExpiry<{ confirmationCode: string }>(
            'guest_inscription',
          );
          if (cached?.confirmationCode) {
            handleViewInscription(event.id, cached.confirmationCode);
          }
        }}
      />

      {/* Event Details Card */}
      <EventDetailsCard
        event={event}
        typeInscriptions={typeInscriptions}
        filteredTypeInscriptions={filteredTypeInscriptions}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        glassSurfaceClass={glassSurfaceClass}
        calculateMaxAge={calculateMaxAge}
      />

      {/* Inscription Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md ${glassSurfaceClass}`}
          >
            <div className="relative z-10">
              <h2 className="text-foreground flex items-center gap-2 text-xl font-semibold">
                <User className="h-5 w-5" />
                Dados para Inscrição
              </h2>
            </div>
            <div className="relative z-10 space-y-6 pt-6">
              {/* ========== CAMPOS OBRIGATÓRIOS ========== */}

              {/* Linha 1: Nome Completo (100%) */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-base">
                      Nome Completo <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome"
                        {...field}
                        className="border-glass bg-background/50 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Linha 2: Email + Telefone (50% cada no desktop, 100% no mobile) */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        E-mail <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          {...field}
                          className="border-glass bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Telefone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(99) 9XXXX-XXXX"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={15}
                          className="border-glass bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* CPF (se visível) + Localidade */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* CPF */}
                {participanteConfig.cpf !== 'hidden' && (
                  <FormField
                    control={control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          CPF
                          {participanteConfig.cpf === 'required' && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatCpf(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={14}
                            className="border-glass bg-background/50 backdrop-blur-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Localidade */}
                <FormField
                  control={control}
                  name="localityId"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Localidade <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <LocalityCombobox
                          eventId={event.id}
                          form={form}
                          name="localityId"
                          placeholder="Selecione sua localidade"
                          glassSurfaceClass={glassSurfaceClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Data de Nascimento + Gênero */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Data de Nascimento{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? parseISO(field.value) : undefined
                          }
                          onChange={(date) => {
                            const formattedDate = date
                              ? format(date, 'yyyy-MM-dd')
                              : '';
                            field.onChange(formattedDate);
                          }}
                          placeholder="Selecione sua data de nascimento"
                          maxDate={new Date()}
                          required={true}
                          captionLayout="dropdown"
                          monthFormat="long"
                          className="w-full"
                          buttonClassName="border-glass bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gênero */}
                <FormField
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">
                        Gênero <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover open={openGender} onOpenChange={setOpenGender}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openGender}
                              type="button"
                              className={cn(
                                'border-glass bg-background/50 w-full justify-between backdrop-blur-sm',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? genderOptions.find(
                                    (gender) => gender.value === field.value,
                                  )?.label
                                : 'Selecione'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="border-glass bg-background/95 w-[var(--radix-popover-trigger-width)] p-0 backdrop-blur-sm"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandList>
                              <CommandEmpty>
                                Nenhum gênero encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {genderOptions.map((gender) => (
                                  <CommandItem
                                    value={gender.label}
                                    key={gender.value}
                                    onSelect={() => {
                                      field.onChange(gender.value);
                                      setOpenGender(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        gender.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {gender.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ========== CAMPOS OPCIONAIS ========== */}
              {/* Nome Preferido */}
              {participanteConfig.preferredName !== 'hidden' && (
                <FormField
                  control={control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Como quer ser chamado
                        {participanteConfig.preferredName === 'required' && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Como você quer ser chamado"
                          {...field}
                          className="border-glass bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Tamanho da Camisa */}
              {participanteConfig.shirtSize !== 'hidden' && (
                <FormField
                  control={control}
                  name="shirtSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">
                        Tamanho da camisa (Babylook)
                        {participanteConfig.shirtSize === 'required' && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </FormLabel>
                      <Popover
                        open={openShirtSize}
                        onOpenChange={setOpenShirtSize}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openShirtSize}
                              type="button"
                              className={cn(
                                'border-glass bg-background/50 w-full justify-between backdrop-blur-sm',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? shirtSizeOptions.find(
                                    (s) => s.value === field.value,
                                  )?.label
                                : 'Selecione'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="border-glass bg-background/95 w-[var(--radix-popover-trigger-width)] p-0 backdrop-blur-sm"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <Command>
                            <CommandEmpty>
                              Nenhum tamanho encontrado.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {shirtSizeOptions.map((size) => (
                                  <CommandItem
                                    key={size.value}
                                    value={size.value}
                                    onSelect={() => {
                                      field.onChange(size.value);
                                      setOpenShirtSize(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        size.value === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                    {size.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ========== TIPO DE INSCRIÇÃO ========== */}
              <div className="border-glass space-y-4 border-t pt-6">
                <div>
                  <div className="text-foreground text-lg font-semibold">
                    Tipo de Inscrição{' '}
                    <span className="text-destructive">*</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Selecione o tipo de inscrição desejado
                  </p>
                </div>

                <InscriptionTypeSelector
                  types={typeInscriptions}
                  selectedTypeId={typeInscriptionId}
                  onSelect={(typeId) => {
                    setTypeInscriptionId(typeId);
                    form.setValue('typeInscriptionId', typeId);
                  }}
                  hasBirthDate={
                    !!(formData.birthDate && formData.birthDate.length === 10)
                  }
                  calculateMaxAge={calculateMaxAge}
                />
              </div>

              {/* Botão Submit */}
              <div className="border-glass border-t pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full text-white transition-all hover:opacity-90"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Realizar Inscrição'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      {successModalOpen && (
        <InscriptionSuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          onViewInscription={() =>
            successData &&
            handleViewInscription(event.id, successData.confirmationCode)
          }
          successData={successData}
          paymentCountdownSeconds={paymentCountdownSeconds}
          primaryColor={primaryColor}
        />
      )}
    </div>
  );
}
