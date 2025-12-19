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
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Cancelar",
  variant = "default",
  isLoading = false,
}: ConfirmationModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: <X className="h-6 w-6 text-red-600" />,
          iconBg: "bg-red-100",
          confirmButton: "bg-red-600 hover:bg-red-700",
        };
      case "success":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          iconBg: "bg-green-100",
          confirmButton: "bg-green-600 hover:bg-green-700",
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
          iconBg: "bg-orange-100",
          confirmButton: "bg-orange-600 hover:bg-orange-700",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${styles.iconBg}`}>
              {styles.icon}
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-initial text-white ${styles.confirmButton}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
