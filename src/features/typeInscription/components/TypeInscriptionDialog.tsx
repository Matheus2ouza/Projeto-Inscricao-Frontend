"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import React, { useEffect } from "react";
import { TypeInscriptions } from "../types/typesInscriptionsTypes";

interface TypeInscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  typeInscription?: TypeInscriptions | null;
  eventId: string;
  eventStartDate?: string | Date;
  onSubmit: (data: {
    description: string;
    value: number;
    specialType: boolean;
    rule: Date | null;
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
  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState<number | string>("");
  const [specialType, setSpecialType] = React.useState(false);
  const [maxAge, setMaxAge] = React.useState<number | string>("");

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
      if (!ruleDate) return "";
      const rule = ruleDate instanceof Date ? ruleDate : new Date(ruleDate);
      if (isNaN(rule.getTime())) return "";
      let age = baseDate.getFullYear() - rule.getFullYear();
      const monthDiff = baseDate.getMonth() - rule.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && baseDate.getDate() < rule.getDate())
      ) {
        age--;
      }
      return age >= 0 ? age : "";
    },
    [baseDate],
  );

  useEffect(() => {
    if (typeInscription) {
      setDescription(typeInscription.description);
      setValue(typeInscription.value);
      setSpecialType(Boolean(typeInscription.specialType));
      setMaxAge(getAgeFromRuleDate(typeInscription.rule));
    } else {
      setDescription("");
      setValue("");
      setSpecialType(false);
      setMaxAge("");
    }
  }, [typeInscription, open, getAgeFromRuleDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMaxAge =
      typeof maxAge === "string" ? maxAge.trim() : String(maxAge);
    const parsedMaxAge =
      trimmedMaxAge.length > 0 ? Number(trimmedMaxAge) : null;
    const rule =
      parsedMaxAge === null || Number.isNaN(parsedMaxAge)
        ? null
        : (() => {
            const rule = new Date(baseDate);
            rule.setFullYear(rule.getFullYear() - parsedMaxAge);
            return rule;
          })();
    await onSubmit({
      description,
      value: Number(value),
      specialType,
      rule,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {typeInscription
                ? "Editar Tipo de Inscrição"
                : "Novo Tipo de Inscrição"}
            </DialogTitle>
            <DialogDescription>
              {typeInscription
                ? "Altere os dados do tipo de inscrição abaixo."
                : "Preencha os dados para criar um novo tipo de inscrição."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="descriptions">Descrição</Label>
              <Input
                id="descriptions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Ingresso Inteiro, Meia Entrada, etc."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxAge">Idade Máxima (anos) - Opcional</Label>
              <Input
                id="maxAge"
                type="number"
                min="0"
                step="1"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="Ex: 12"
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para permitir qualquer idade.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="specialType" className="font-medium">
                  Tipo de inscrição especial
                </Label>
                <p className="text-xs text-muted-foreground">
                  Define se este tipo possui validação especial para inscrição.
                </p>
              </div>
              <Switch
                id="specialType"
                checked={specialType}
                onCheckedChange={setSpecialType}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : typeInscription ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
