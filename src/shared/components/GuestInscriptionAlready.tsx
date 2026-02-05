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
import { AlertCircle, Eye } from "lucide-react";

type GuestInscriptionAlreadyProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onView: () => void;
  className?: string;
};

export function GuestInscriptionAlready({
  open,
  onOpenChange,
  onView,
  className,
}: GuestInscriptionAlreadyProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-md p-0 overflow-hidden", className)}
      >
        <DialogHeader className="p-6 pb-4 sm:p-7 sm:pb-5 text-left">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base sm:text-lg">
                Inscrição detectada
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                Detectamos que esse dispositivo já fez uma inscrição para este
                evento. Deseja visualizá-la?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="border-t p-4 sm:p-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Agora não
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto gap-2"
            onClick={onView}
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
