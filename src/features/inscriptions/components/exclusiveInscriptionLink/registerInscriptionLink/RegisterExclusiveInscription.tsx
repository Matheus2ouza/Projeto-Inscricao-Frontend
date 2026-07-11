'use client';

import { InscriptionSuccessModal } from '@/features/guest/components/guestInscription/InscriptionSuccessModal';
import { InscriptionTypeSelector } from '@/features/guest/components/guestInscription/InscriptionTypeCard';
import { ExclusiveInscriptionTerms } from '@/features/inscriptions/components/exclusiveInscriptionLink/registerInscriptionLink/ExclusiveInscriptionTerms';
import { useFormCreateExclusiveInscriptionLink } from '@/features/inscriptions/hooks/exclusiveInscriptionLink/registerInscriptionLink/useFormCreateExclusiveInscriptionLink';
import {
  registerExclusiveInscriptionLinkSchema,
  RegisterExclusiveInscriptionLinkSchemaType,
} from '@/features/inscriptions/schema/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkSchema';
import { RegisterInscriptionLinkResponse } from '@/features/inscriptions/types/exclusiveInscriptionLink/registerInscriptionLink/registerInscriptionLinkTypes';
import {
  Event,
  ExclusiveInscriptionLink,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveInscriptionLinkTypes';
import { cn } from '@/lib/utils';
import { GuestInscriptionAlready } from '@/shared/components/GuestInscriptionAlready';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import { ImageSwatches } from '@/shared/hooks/useImagePalette';
import { formatInput } from '@/shared/utils/format';
import { setWithExpiry } from '@/shared/utils/storageWithExpiry';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Input, Radio } from 'antd';
import dayjs from 'dayjs';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface RegisterExclusiveInscriptionProps {
  token: string;
  event: Event | null;
  exclusiveInscriptionLink: ExclusiveInscriptionLink | null;
  status: 'valid' | 'inactive' | 'expired';
  canInscribe: boolean;
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
  onViewInscription: () => void;
}

export function RegisterExclusiveInscription({
  token,
  event,
  exclusiveInscriptionLink,
  status,
  canInscribe,
  palette,
  isDark,
  swatches,
  onViewInscription,
}: RegisterExclusiveInscriptionProps) {
  const [successData, setSuccessData] =
    useState<RegisterInscriptionLinkResponse | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentCountdownSeconds, setPaymentCountdownSeconds] = useState<
    number | null
  >(null);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const throttleKey = 'guest_inscription_already_throttle_5m';

  const availableTypes = exclusiveInscriptionLink?.typeInscriptions ?? [];
  const primaryColor = palette[0] ?? '#f97316';

  const MAX_HOSTING_VACANCIES = availableTypes[0].participantLimit;
  const hostingVacanciesLeft = Math.max(
    MAX_HOSTING_VACANCIES - (availableTypes[0].currentCount ?? 0),
    0,
  );

  // Determina se o campo de alojamento deve ser exibido
  const showHostingOption = hostingVacanciesLeft > 0;

  const genderOptions = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMININO', label: 'Feminino' },
  ];

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

  const formatPhone = (value: string) => formatInput(value, 'phone');
  const formatCpf = (value: string) => formatInput(value, 'cpf');

  const { initialValues, submit } = useFormCreateExclusiveInscriptionLink(
    event?.id ?? '',
    token,
  );

  const form = useForm<RegisterExclusiveInscriptionLinkSchemaType>({
    resolver: zodResolver(registerExclusiveInscriptionLinkSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  const termsAccepted = form.watch('termsAccepted');

  const unformatDigits = (value: string) => value.replace(/\D/g, '');

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    const payload = {
      ...values,
      phone: unformatDigits(values.phone),
      cpf: unformatDigits(values.cpf),
    };
    const result = await submit(payload);
    if (result.success) {
      setSuccessData(result.success as RegisterInscriptionLinkResponse);
      setSuccessModalOpen(true);
      setWithExpiry(
        'guest_inscription',
        {
          eventId: event?.id ?? '',
          confirmationCode: result.success.confirmationCode,
        },
        1000 * 60 * 60 * 24,
      );
      form.reset();
      return;
    }

    setSubmitError(result.error ?? 'Não foi possível concluir a inscrição');
  });

  if (!exclusiveInscriptionLink || !event) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-10 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Link inválido
        </h2>
        <p className="text-muted-foreground">
          O link de inscrição exclusiva não é válido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuestInscriptionAlready
        open={alreadyDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          }
          setAlreadyDialogOpen(open);
        }}
        onView={onViewInscription}
      />

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Inscrição Exclusiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nome completo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como quer ser chamado</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Apelido ou nome preferido"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="seu@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(99) 99999-9999"
                          onChange={(event) =>
                            field.onChange(formatPhone(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="000.000.000-00"
                          onChange={(event) =>
                            field.onChange(formatCpf(event.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Gênero</FormLabel>
                      <Popover open={openGender} onOpenChange={setOpenGender}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openGender}
                              type="button"
                              className={cn(
                                'w-full justify-between',
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
                          className="w-[var(--radix-popover-trigger-width)] p-0"
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidade</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Cidade / Estado" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de nascimento</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(date) => {
                            const formattedDate = date
                              ? date.format('YYYY-MM-DD')
                              : '';
                            field.onChange(formattedDate);
                          }}
                          disabledDate={(current) => {
                            return (
                              current && current.isAfter(dayjs().endOf('day'))
                            );
                          }}
                          format="DD/MM/YYYY"
                          placeholder="Selecione a data"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Campo de alojamento - exibido apenas quando há vagas disponíveis */}
              {showHostingOption && (
                <FormField
                  control={form.control}
                  name="observation"
                  render={({ field }) => {
                    const selectedOption =
                      field.value === 'Participante solicitou hospedagem'
                        ? 'yes'
                        : 'no';

                    return (
                      <FormItem>
                        <FormLabel>Precisa de alojamento?</FormLabel>
                        <FormControl>
                          <Radio.Group
                            onChange={(event) => {
                              const value = event.target.value as string;
                              field.onChange(
                                value === 'yes'
                                  ? 'Participante solicitou hospedagem'
                                  : '',
                              );
                            }}
                            value={selectedOption}
                            optionType="button"
                            buttonStyle="solid"
                            className="grid gap-2 sm:grid-cols-2"
                          >
                            <Radio value="yes">Sim</Radio>
                            <Radio value="no">Não</Radio>
                          </Radio.Group>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}

              <FormField
                control={form.control}
                name="typeInscriptionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de inscrição</FormLabel>
                    <FormControl>
                      <InscriptionTypeSelector
                        types={availableTypes}
                        selectedTypeId={field.value}
                        onSelect={field.onChange}
                        hasBirthDate={!!form.watch('birthDate')}
                        calculateMaxAge={calculateMaxAge}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem>
                    <div className="border-border/60 bg-muted/20 space-y-4 rounded-xl border p-4">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-semibold">
                          Termos da inscrição
                        </FormLabel>

                        <p className="text-muted-foreground text-sm">
                          Leia atentamente as condições da inscrição antes de
                          continuar.
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <ExclusiveInscriptionTerms
                          event={event}
                          typeInscription={
                            exclusiveInscriptionLink.typeInscriptions[0]
                          }
                          hostingVacanciesLeft={hostingVacanciesLeft}
                          primaryColor={primaryColor}
                        />

                        <FormControl>
                          <Radio.Group
                            onChange={(event) => {
                              field.onChange(event.target.value === 'accepted');
                            }}
                            value={field.value ? 'accepted' : ''}
                            className="flex"
                          >
                            <Radio value="accepted">
                              Confirmo que li e concordo com os termos
                            </Radio>
                          </Radio.Group>
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!termsAccepted}
              >
                Confirmar inscrição
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {successModalOpen && (
        <InscriptionSuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          onViewInscription={onViewInscription}
          successData={successData}
          paymentCountdownSeconds={paymentCountdownSeconds}
          primaryColor={palette[0]}
        />
      )}
    </div>
  );
}
