'use client';

import { Button, Input, InputNumber, Modal, Switch, Typography } from 'antd';
import React, { useEffect } from 'react';
import { TypeInscription } from '../types/typesInscriptionsTypes';

interface TypeInscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  typeInscription?: TypeInscription | null;
  eventId: string;
  eventStartDate?: string | Date;
  onSubmit: (data: {
    description: string;
    value: number;
    specialType: boolean;
    rule: Date | null;
    participantLimit: number;
    limitIsStrict: boolean;
  }) => Promise<void>;
  loading: boolean;
}

export default function TypeInscriptionDialog({
  open,
  onOpenChange,
  typeInscription,
  eventStartDate,
  onSubmit,
  loading,
}: TypeInscriptionDialogProps) {
  const [description, setDescription] = React.useState('');
  const [value, setValue] = React.useState<number | null>(null);
  const [specialType, setSpecialType] = React.useState(false);
  const [maxAge, setMaxAge] = React.useState<number | null>(null);
  const [participantLimit, setParticipantLimit] = React.useState<number>(0);
  const [limitIsStrict, setLimitIsStrict] = React.useState<boolean>(false);

  const baseDate = React.useMemo(() => {
    if (!eventStartDate) return new Date();
    const parsed =
      eventStartDate instanceof Date
        ? new Date(eventStartDate)
        : new Date(eventStartDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [eventStartDate]);

  const getAgeFromRuleDate = React.useCallback(
    (ruleDate: Date | string | null) => {
      if (!ruleDate) return null;
      const rule = ruleDate instanceof Date ? ruleDate : new Date(ruleDate);
      if (isNaN(rule.getTime())) return null;
      let age = baseDate.getFullYear() - rule.getFullYear();
      const monthDiff = baseDate.getMonth() - rule.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && baseDate.getDate() < rule.getDate())
      ) {
        age--;
      }
      return age >= 0 ? age : null;
    },
    [baseDate],
  );

  useEffect(() => {
    if (typeInscription) {
      setDescription(typeInscription.description);
      setValue(typeInscription.value);
      setSpecialType(Boolean(typeInscription.specialType));
      setMaxAge(getAgeFromRuleDate(typeInscription.rule));
      setParticipantLimit(typeInscription.participantLimit);
      setLimitIsStrict(Boolean(typeInscription.limitIsStrict));
    } else {
      setDescription('');
      setValue(null);
      setSpecialType(false);
      setMaxAge(null);
      setParticipantLimit(0);
      setLimitIsStrict(false);
    }
  }, [typeInscription, open, getAgeFromRuleDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    if (value === null || Number.isNaN(value)) return;

    const rule =
      maxAge === null || Number.isNaN(maxAge)
        ? null
        : (() => {
            const rule = new Date(baseDate);
            rule.setFullYear(rule.getFullYear() - maxAge);
            return rule;
          })();

    await onSubmit({
      description: description.trim(),
      value,
      specialType,
      rule,
      participantLimit,
      limitIsStrict,
    });
    onOpenChange(false);
  };

  return (
    <Modal
      title={
        typeInscription ? 'Editar Tipo de Inscrição' : 'Novo Tipo de Inscrição'
      }
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={null}
      centered
      destroyOnHidden
      mask={{ closable: !loading }}
      closable={!loading}
      keyboard={!loading}
    >
      <div className="space-y-1">
        <Typography.Text type="secondary">
          {typeInscription
            ? 'Altere os dados do tipo de inscrição abaixo.'
            : 'Preencha os dados para criar um novo tipo de inscrição.'}
        </Typography.Text>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="descriptions" className="text-sm font-medium">
            Descrição
          </label>
          <Input
            id="descriptions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ingresso Inteiro, Meia Entrada, etc."
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="value" className="text-sm font-medium">
            Valor (R$)
          </label>
          <InputNumber
            id="value"
            min={0}
            step={0.01}
            value={value}
            onChange={(v) => setValue(typeof v === 'number' ? v : null)}
            placeholder="0,00"
            required
            disabled={loading}
            style={{ width: '100%' }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxAge" className="text-sm font-medium">
            Idade Máxima (anos) - Opcional
          </label>
          <InputNumber
            id="maxAge"
            min={0}
            step={1}
            value={maxAge}
            onChange={(v) => setMaxAge(typeof v === 'number' ? v : null)}
            placeholder="Ex: 12"
            disabled={loading}
            style={{ width: '100%' }}
          />
          <div className="text-muted-foreground text-xs">
            Deixe em branco para permitir qualquer idade.
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="participantLimit" className="text-sm font-medium">
            Quantidade de vagas
          </label>
          <InputNumber
            id="participantLimit"
            min={0}
            step={1}
            value={participantLimit}
            onChange={(v) => setParticipantLimit(typeof v === 'number' ? v : 0)}
            placeholder="Ex: 100"
            disabled={loading}
            style={{ width: '100%' }}
          />
          <div className="text-muted-foreground text-xs">
            Acrecente a quantidade de vagas disponiveis para essa inscrição
          </div>
        </div>

        <div className="border-muted-foreground/20 bg-muted/30 flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1 pr-4">
            <div className="text-sm font-medium">Controle rígido de vagas</div>
            <div className="text-muted-foreground text-xs">
              Define se este tipo de inscrição deve respeitar estritamente o
              limite de vagas.
            </div>
          </div>

          <Switch
            checked={limitIsStrict}
            onChange={(checked) => setLimitIsStrict(checked)}
            disabled={loading}
          />
        </div>

        <div className="border-muted-foreground/20 bg-muted/30 flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1 pr-4">
            <div className="text-sm font-medium">
              Tipo de inscrição especial
            </div>
            <div className="text-muted-foreground text-xs">
              Define se este tipo possui validações adicionais na inscrição.
            </div>
          </div>

          <Switch
            checked={specialType}
            onChange={(checked) => setSpecialType(checked)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="default"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {typeInscription ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
