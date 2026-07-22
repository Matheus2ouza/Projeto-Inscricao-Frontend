'use client';

import { useEventManagerMutations } from '@/features/events/hooks/manager/useEventManagerMutations';
import {
  ParticipantFieldRule,
  ParticipantFieldsConfig,
} from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ParticipantFieldsManagerProps {
  eventId: string;
  participanteConfig?: ParticipantFieldsConfig;
}

// Configuração padrão para eventos que não têm
const DEFAULT_CONFIG: ParticipantFieldsConfig = {
  cpf: 'required',
  preferredName: 'optional',
  shirtSize: 'optional',
  shirtType: 'optional',
};

// Campos padrão que sempre existem (incluindo CPF)
const DEFAULT_FIELDS = [
  { key: 'name', label: 'Nome' },
  { key: 'birthDate', label: 'Data de Nascimento' },
  { key: 'gender', label: 'Gênero' },
];

// Campos configuráveis (excluindo CPF)
const CONFIG_FIELDS: { key: keyof ParticipantFieldsConfig; label: string }[] = [
  { key: 'cpf', label: 'CPF' },
  { key: 'preferredName', label: 'Nome Preferido' },
  { key: 'shirtSize', label: 'Tamanho da Camisa' },
  { key: 'shirtType', label: 'Tipo de Camisa' },
];

// Opções de regras
const ruleOptions: {
  value: ParticipantFieldRule;
  label: string;
  color: string;
}[] = [
  {
    value: 'required',
    label: 'Obrigatório',
    color:
      'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400',
  },
  {
    value: 'optional',
    label: 'Opcional',
    color:
      'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    value: 'hidden',
    label: 'Oculto',
    color:
      'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-500/20 dark:text-gray-400',
  },
];

export default function ParticipantFieldsManager({
  eventId,
  participanteConfig,
}: ParticipantFieldsManagerProps) {
  const initialConfig = participanteConfig || DEFAULT_CONFIG;

  const [isEditing, setIsEditing] = useState(false);
  const [localConfig, setLocalConfig] =
    useState<ParticipantFieldsConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  const { handleUpdateParticipantFields, isUpdatingParticipantFields } =
    useEventManagerMutations(eventId);

  const handleChangeRule = (
    fieldKey: keyof ParticipantFieldsConfig,
    rule: ParticipantFieldRule,
  ) => {
    setLocalConfig((prev) => ({
      ...prev,
      [fieldKey]: rule,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await handleUpdateParticipantFields({
        eventId,
        participanteConfig: localConfig,
      });

      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Falha ao atualizar configurações';
      toast.error(message);
      setLocalConfig(initialConfig);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalConfig(initialConfig);
    setIsEditing(false);
  };

  const getRuleBadgeColor = (rule: ParticipantFieldRule) => {
    const option = ruleOptions.find((opt) => opt.value === rule);
    return option?.color || '';
  };

  const getRuleLabel = (rule: ParticipantFieldRule) => {
    const option = ruleOptions.find((opt) => opt.value === rule);
    return option?.label || rule;
  };

  const isLoading = isSaving || isUpdatingParticipantFields;

  return (
    <div className="liquid-card rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
            Campos do Participante
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure quais campos serão exibidos no formulário de inscrição
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Campos Padrão (sempre visíveis) */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Campos Padrão
          </h3>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_FIELDS.map((field) => (
              <Badge
                key={field.key}
                variant="outline"
                className="bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/20"
              >
                {field.label}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            * Campos padrão sempre estão disponíveis no formulário
          </p>
        </div>

        {/* Campos Configuráveis */}
        <div>
          <h3 className="text-muted-foreground mb-3 text-sm font-medium">
            Campos Configuráveis
          </h3>
          <div className="space-y-3">
            {CONFIG_FIELDS.map((field) => {
              const currentRule = localConfig?.[field.key] || 'optional';

              return (
                <div
                  key={field.key}
                  className="border-border/50 bg-background/50 flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                >
                  <span className="text-sm font-medium">{field.label}</span>

                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {ruleOptions.map((option) => {
                        const isSelected = currentRule === option.value;

                        return (
                          <Button
                            key={option.value}
                            type="button"
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            className={`h-7 px-3 text-xs ${
                              isSelected ? '' : 'hover:bg-muted'
                            }`}
                            onClick={() =>
                              handleChangeRule(field.key, option.value)
                            }
                            disabled={isLoading}
                          >
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <Badge className={getRuleBadgeColor(currentRule)}>
                      {getRuleLabel(currentRule)}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
