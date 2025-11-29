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
import { cn } from "@/shared/lib/utils";

type TicketPurchaseItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type TicketPurchaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: TicketPurchaseItem[];
  totalAmount: number;
  onConfirm: () => void;
  isProcessing?: boolean;
  confirmLabel?: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TicketPurchaseModal({
  open,
  onOpenChange,
  items,
  totalAmount,
  onConfirm,
  isProcessing = false,
  confirmLabel,
}: TicketPurchaseModalProps) {
  const confirmButtonLabel = confirmLabel ?? "Finalizar compra";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Resumo da compra</DialogTitle>
          <DialogDescription>
            Verifique os detalhes antes de finalizar a compra dos tickets.
          </DialogDescription>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Nenhum ticket selecionado.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y rounded-lg border">
              {items.map((item) => {
                const itemTotal = item.quantity * item.price;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {currencyFormatter.format(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {currencyFormatter.format(itemTotal)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <p className="text-sm font-medium">Total a pagar</p>
              <p className="text-lg font-semibold">
                {currencyFormatter.format(totalAmount)}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(isProcessing && "pointer-events-none opacity-70")}
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={items.length === 0 || isProcessing}
            className="dark:text-white"
          >
            {isProcessing ? "Processando..." : confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
