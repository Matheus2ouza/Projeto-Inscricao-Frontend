'use client';

import type { UpdateGuestParticipantFormInputs } from '@/features/guest/schema/actions/updateGuestParticipantSchema';
import {
  Participant,
  genderOptions,
  shirtSizeOptions,
  shirtTypeOptions,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { getCalculateAge } from '@/shared/utils/getCalculateAge';
import {
  Calendar,
  Check,
  ChevronsUpDown,
  FileText,
  Pencil,
  User,
} from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface ParticipantCardProps {
  participant: Participant;
  participantEdit?: {
    editingParticipantId: string | null;
    form: UseFormReturn<UpdateGuestParticipantFormInputs>;
    onStart: (participantId: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
  };
  loading: boolean;
}

export function ParticipantCard({
  participant,
  participantEdit,
  loading,
}: ParticipantCardProps) {
  const [openGenderParticipant, setOpenGenderParticipant] = useState(false);
  const [openShirtSizeParticipant, setOpenShirtSizeParticipant] =
    useState(false);
  const [openShirtTypeParticipant, setOpenShirtTypeParticipant] =
    useState(false);

  const isEditingCurrentParticipant =
    participantEdit?.editingParticipantId === participant.id;
  const isEditingOtherParticipant =
    !!participantEdit?.editingParticipantId &&
    participantEdit.editingParticipantId !== participant.id;

  return (
    <div className="liquid-panel overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-stretch justify-between gap-6 lg:flex-row lg:items-center">
          <div className="w-full flex-1 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {participant.preferredName || participant.name}
                </h3>
                {(() => {
                  if (!participantEdit) return null;

                  if (isEditingCurrentParticipant) {
                    return (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => participantEdit.onCancel()}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => participantEdit.onSubmit()}
                          disabled={loading}
                        >
                          Salvar
                        </Button>
                      </div>
                    );
                  }

                  if (isEditingOtherParticipant) return null;

                  return (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => participantEdit.onStart(participant.id)}
                      disabled={loading}
                    >
                      <Pencil className="h-4 w-4" />
                      Editar Participante
                    </Button>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Nome</span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Input
                    disabled={loading}
                    className="h-10"
                    {...participantEdit?.form.register('name')}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {participant.name || '-'}
                  </p>
                )}
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Nome Preferido</span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Input
                    disabled={loading}
                    className="h-10"
                    {...participantEdit?.form.register('preferredName')}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {participant.preferredName || 'N/ Definido'}
                  </p>
                )}
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Gênero</span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Popover
                    open={openGenderParticipant}
                    onOpenChange={setOpenGenderParticipant}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openGenderParticipant}
                        type="button"
                        disabled={loading}
                        className={cn(
                          'w-full justify-between',
                          !participantEdit?.form.watch('gender') &&
                            'text-muted-foreground',
                        )}
                      >
                        {participantEdit?.form.watch('gender')
                          ? genderOptions.find(
                              (gender) =>
                                gender.value ===
                                participantEdit?.form.watch('gender'),
                            )?.label
                          : 'Selecione'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command>
                        <CommandList>
                          <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
                          <CommandGroup>
                            {genderOptions.map((gender) => (
                              <CommandItem
                                value={gender.label}
                                key={gender.value}
                                onSelect={() => {
                                  participantEdit?.form.setValue(
                                    'gender',
                                    gender.value,
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    },
                                  );
                                  setOpenGenderParticipant(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    gender.value ===
                                      participantEdit?.form.watch('gender')
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
                ) : (
                  <p className="text-sm font-medium">{participant.gender}</p>
                )}
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">
                    {isEditingCurrentParticipant
                      ? 'Data de nascimento'
                      : 'Idade'}
                  </span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Input
                    type="date"
                    disabled={loading}
                    className="h-10"
                    {...participantEdit?.form.register('birthDate')}
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {getCalculateAge(participant.birthDate)} anos
                  </p>
                )}
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Inscrição</span>
                </div>
                <p className="text-sm font-medium uppercase">
                  {participant.typeInscription.description || 'N/ Definido'}
                </p>
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Tamanho da camisa</span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Popover
                    open={openShirtSizeParticipant}
                    onOpenChange={setOpenShirtSizeParticipant}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openShirtSizeParticipant}
                        type="button"
                        disabled={loading}
                        className={cn(
                          'w-full justify-between',
                          !participantEdit?.form.watch('shirtSize') &&
                            'text-muted-foreground',
                        )}
                      >
                        {participantEdit?.form.watch('shirtSize')
                          ? shirtSizeOptions.find(
                              (s) =>
                                s.value ===
                                participantEdit?.form.watch('shirtSize'),
                            )?.label
                          : 'Selecione'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command>
                        <CommandEmpty>Nenhum tamanho encontrado.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {shirtSizeOptions.map((size) => (
                              <CommandItem
                                key={size.value}
                                value={size.value}
                                onSelect={() => {
                                  participantEdit?.form.setValue(
                                    'shirtSize',
                                    size.value,
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    },
                                  );
                                  setOpenShirtSizeParticipant(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    size.value ===
                                      participantEdit?.form.watch('shirtSize')
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
                ) : (
                  <p className="text-sm font-medium">
                    {participant.shirtSize || '-'}
                  </p>
                )}
              </div>

              <div className="liquid-panel-strong rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Modelo da camisa</span>
                </div>
                {isEditingCurrentParticipant ? (
                  <Popover
                    open={openShirtTypeParticipant}
                    onOpenChange={setOpenShirtTypeParticipant}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openShirtTypeParticipant}
                        type="button"
                        disabled={loading}
                        className={cn(
                          'w-full justify-between',
                          !participantEdit?.form.watch('shirtType') &&
                            'text-muted-foreground',
                        )}
                      >
                        {participantEdit?.form.watch('shirtType')
                          ? shirtTypeOptions.find(
                              (s) =>
                                s.value ===
                                participantEdit?.form.watch('shirtType'),
                            )?.label
                          : 'Selecione'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command>
                        <CommandEmpty>Nenhum modelo encontrado.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {shirtTypeOptions.map((type) => (
                              <CommandItem
                                key={type.value}
                                value={type.value}
                                onSelect={() => {
                                  participantEdit?.form.setValue(
                                    'shirtType',
                                    type.value,
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: true,
                                    },
                                  );
                                  setOpenShirtTypeParticipant(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    type.value ===
                                      participantEdit?.form.watch('shirtType')
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
                ) : (
                  <p className="text-sm font-medium">
                    {participant.shirtType || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
