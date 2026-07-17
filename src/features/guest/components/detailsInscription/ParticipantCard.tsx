'use client';

import { useFormUpdateGuestParticipant } from '@/features/guest/hook/updateGuestParticipant/useUpdateGuestParticipant';
import {
  GenderType,
  Participant,
  ParticipantFieldsConfig,
  genderOptions,
  shirtSizeOptions,
  shirtTypeOptions,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/shared/components/DatePicker';
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
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { getCalculateAge } from '@/shared/utils/getCalculateAge';
import { format, parseISO } from 'date-fns';
import {
  Calendar,
  Check,
  ChevronsUpDown,
  FileText,
  Pencil,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface ParticipantCardProps {
  participant: Participant;
  eventId: string;
  participantFieldsConfig: ParticipantFieldsConfig;
  loading?: boolean;
}

export function ParticipantCard({
  participant,
  eventId,
  participantFieldsConfig,
  loading: externalLoading = false,
}: ParticipantCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openGenderParticipant, setOpenGenderParticipant] = useState(false);
  const [openShirtSizeParticipant, setOpenShirtSizeParticipant] =
    useState(false);
  const [openShirtTypeParticipant, setOpenShirtTypeParticipant] =
    useState(false);

  // Função para formatar data para o input
  const toDateInputValue = (value: string | Date | null | undefined) => {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return '';

    // Usa os componentes UTC, não os locais, pra não sofrer shift de fuso
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para formatar CPF (apenas exibição)
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

  const { form, onSubmit, isLoading } = useFormUpdateGuestParticipant(
    participant,
    participantFieldsConfig,
  );

  const handleStartEdit = () => {
    // Reset com os valores atuais
    form.reset({
      name: participant.name,
      cpf: participant.cpf || '',
      gender: participant.gender as GenderType,
      birthDate: participant.birthDate
        ? toDateInputValue(participant.birthDate)
        : '',
      preferredName: participant.preferredName || undefined,
      shirtSize: participant.shirtSize || undefined,
      shirtType: participant.shirtType || undefined,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset({
      name: participant.name,
      cpf: participant.cpf || '',
      gender: participant.gender as GenderType,
      birthDate: participant.birthDate
        ? toDateInputValue(participant.birthDate)
        : '',
      preferredName: participant.preferredName || undefined,
      shirtSize: participant.shirtSize || undefined,
      shirtType: participant.shirtType || undefined,
    });
  };

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    await onSubmit(event);
    setIsEditing(false);
  };

  const isEditingCurrentParticipant = isEditing;
  const isLoadingState = isLoading || externalLoading;

  return (
    <Card className="liquid-card w-full overflow-hidden border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <CardTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
            Detalhes do Participante
          </CardTitle>
          {!isEditingCurrentParticipant && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark gap-2 self-start sm:self-auto"
              onClick={handleStartEdit}
              disabled={isLoadingState}
            >
              <Pencil className="h-4 w-4" />
              Editar Participante
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEditingCurrentParticipant ? (
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Nome - SEMPRE VISÍVEL */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Nome <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoadingState}
                          className="focus:border-riodavida focus:ring-riodavida/20 h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CPF - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
                {participantFieldsConfig.cpf !== 'hidden' && (
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          CPF
                          {participantFieldsConfig.cpf === 'required' && (
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
                            disabled={isLoadingState}
                            className="focus:border-riodavida focus:ring-riodavida/20 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Gênero - SEMPRE VISÍVEL */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Gênero <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover
                        open={openGenderParticipant}
                        onOpenChange={setOpenGenderParticipant}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openGenderParticipant}
                              type="button"
                              disabled={isLoadingState}
                              className={cn(
                                'border-riodavida/20 hover:border-riodavida/30 w-full justify-between',
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
                                      setOpenGenderParticipant(false);
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

                {/* Data de Nascimento - SEMPRE VISÍVEL */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
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
                          placeholder="Selecione a data"
                          maxDate={new Date()}
                          required={true}
                          captionLayout="dropdown"
                          monthFormat="long"
                          className="w-full"
                          buttonClassName="border-riodavida/20 bg-riodavida/5 hover:border-riodavida/30 backdrop-blur-sm"
                          disabled={isLoadingState}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nome Preferido - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
                {participantFieldsConfig.preferredName !== 'hidden' && (
                  <FormField
                    control={form.control}
                    name="preferredName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Nome Preferido
                          {participantFieldsConfig.preferredName ===
                            'required' && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Como quer ser chamado"
                            {...field}
                            disabled={isLoadingState}
                            className="focus:border-riodavida focus:ring-riodavida/20 h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Tamanho da Camisa - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
                {participantFieldsConfig.shirtSize !== 'hidden' && (
                  <FormField
                    control={form.control}
                    name="shirtSize"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Tamanho da camisa
                          {participantFieldsConfig.shirtSize === 'required' && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </FormLabel>
                        <Popover
                          open={openShirtSizeParticipant}
                          onOpenChange={setOpenShirtSizeParticipant}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openShirtSizeParticipant}
                                type="button"
                                disabled={isLoadingState}
                                className={cn(
                                  'border-riodavida/20 hover:border-riodavida/30 w-full justify-between',
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
                            className="w-[var(--radix-popover-trigger-width)] p-0"
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
                                        setOpenShirtSizeParticipant(false);
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

                {/* Tipo de Camisa - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
                {participantFieldsConfig.shirtType !== 'hidden' && (
                  <FormField
                    control={form.control}
                    name="shirtType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Modelo da camisa
                          {participantFieldsConfig.shirtType === 'required' && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </FormLabel>
                        <Popover
                          open={openShirtTypeParticipant}
                          onOpenChange={setOpenShirtTypeParticipant}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openShirtTypeParticipant}
                                type="button"
                                disabled={isLoadingState}
                                className={cn(
                                  'border-riodavida/20 hover:border-riodavida/30 w-full justify-between',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value
                                  ? shirtTypeOptions.find(
                                      (s) => s.value === field.value,
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
                              <CommandEmpty>
                                Nenhum modelo encontrado.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {shirtTypeOptions.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={() => {
                                        field.onChange(type.value);
                                        setOpenShirtTypeParticipant(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          type.value === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {type.label}
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

                {/* Botões de ação */}
                <div className="border-riodavida/10 col-span-full mt-2 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isLoadingState}
                    className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-riodavida hover:bg-riodavida-dark w-full gap-2 text-white sm:w-auto"
                    disabled={isLoadingState}
                  >
                    {isLoadingState ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Nome - SEMPRE VISÍVEL */}
            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Nome</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                {participant.name || '-'}
              </p>
            </div>

            {/* CPF - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
            {participantFieldsConfig.cpf !== 'hidden' && (
              <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-riodavida h-4 w-4" />
                  <span className="text-sm font-medium">CPF</span>
                </div>
                <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                  {participant.cpf || '-'}
                </p>
              </div>
            )}

            {/* Gênero - SEMPRE VISÍVEL */}
            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Gênero</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                {participant.gender}
              </p>
            </div>

            {/* Idade - SEMPRE VISÍVEL */}
            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Idade</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                {getCalculateAge(participant.birthDate)} anos
              </p>
            </div>

            {/* Nome Preferido - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
            {participantFieldsConfig.preferredName !== 'hidden' && (
              <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-riodavida h-4 w-4" />
                  <span className="text-sm font-medium">Nome Preferido</span>
                </div>
                <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                  {participant.preferredName || 'N/ Definido'}
                </p>
              </div>
            )}

            {/* Inscrição - SEMPRE VISÍVEL */}
            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Inscrição</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium uppercase">
                {participant.typeInscription.description || 'N/ Definido'}
              </p>
            </div>

            {/* Tamanho da camisa - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
            {participantFieldsConfig.shirtSize !== 'hidden' && (
              <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-riodavida h-4 w-4" />
                  <span className="text-sm font-medium">Tamanho da camisa</span>
                </div>
                <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                  {participant.shirtSize || '-'}
                </p>
              </div>
            )}

            {/* Tipo de Camisa - VISÍVEL APENAS SE NÃO FOR HIDDEN */}
            {participantFieldsConfig.shirtType !== 'hidden' && (
              <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-riodavida h-4 w-4" />
                  <span className="text-sm font-medium">Modelo da camisa</span>
                </div>
                <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                  {participant.shirtType || '-'}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
