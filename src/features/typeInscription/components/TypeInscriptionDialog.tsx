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
  onSubmit: (data: {
    description: string;
    value: number;
    specialType: boolean;
  }) => Promise<void>;
  loading: boolean;
}

export default function TypeInscriptionDialog({
  open,
  onOpenChange,
  typeInscription,
  eventId,
  onSubmit,
  loading,
}: TypeInscriptionDialogProps) {
  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState<number | string>("");
  const [specialType, setSpecialType] = React.useState(false);

  useEffect(() => {
    if (typeInscription) {
      setDescription(typeInscription.description);
      setValue(typeInscription.value);
      setSpecialType(Boolean(typeInscription.specialType));
    } else {
      setDescription("");
      setValue("");
      setSpecialType(false);
    }
  }, [typeInscription, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      description,
      value: Number(value),
      specialType,
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
