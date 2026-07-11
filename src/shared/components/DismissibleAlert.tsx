'use client';

import { cn } from '@/lib/utils';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface DismissibleAlertProps {
  id: string;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
  asModal?: boolean;
}

// Mapeamento de cores sólidas da paleta Riodavida
const variantStyles = {
  default: {
    bg: 'bg-[#3FB5AE] dark:bg-[#2A8A85]',
    text: 'text-white dark:text-white',
    desc: 'text-white/90 dark:text-white/90',
    icon: 'text-white dark:text-white',
    border: 'border-[#2E8F8A] dark:border-[#1F6B66]',
    hover: 'hover:bg-[#2E8F8A] dark:hover:bg-[#1F6B66]',
    checkbox: 'text-white',
  },
  destructive: {
    bg: 'bg-red-600 dark:bg-red-700',
    text: 'text-white dark:text-white',
    desc: 'text-white/90 dark:text-white/90',
    icon: 'text-white dark:text-white',
    border: 'border-red-700 dark:border-red-800',
    hover: 'hover:bg-red-700 dark:hover:bg-red-800',
    checkbox: 'text-white',
  },
  warning: {
    bg: 'bg-amber-500 dark:bg-amber-600',
    text: 'text-white dark:text-white',
    desc: 'text-white/90 dark:text-white/90',
    icon: 'text-white dark:text-white',
    border: 'border-amber-600 dark:border-amber-700',
    hover: 'hover:bg-amber-600 dark:hover:bg-amber-700',
    checkbox: 'text-white',
  },
  success: {
    bg: 'bg-[#A8BE3C] dark:bg-[#8A9E2E]',
    text: 'text-white dark:text-white',
    desc: 'text-white/90 dark:text-white/90',
    icon: 'text-white dark:text-white',
    border: 'border-[#8AA02E] dark:border-[#6E821E]',
    hover: 'hover:bg-[#8AA02E] dark:hover:bg-[#6E821E]',
    checkbox: 'text-white',
  },
};

// Ícones padrão
const defaultIcons = {
  default: <Info className="h-5 w-5" />,
  destructive: <AlertCircle className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
};

export default function DismissibleAlert({
  id,
  title,
  children,
  variant = 'default',
  className,
  icon,
  onClose,
  dismissible = true,
  asModal = false,
}: DismissibleAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `dismissible-alert-${id}`;
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) {
        setIsVisible(true);
        setOpen(true);
      }
    }
  }, [id]);

  const handleClose = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      const storageKey = `dismissible-alert-${id}`;
      localStorage.setItem(storageKey, 'true');
    }
    setIsVisible(false);
    setOpen(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const styles = variantStyles[variant];
  const IconComponent = icon || defaultIcons[variant];

  // Conteúdo comum (usado inline e modal)
  const renderContent = () => (
    <>
      <div className="flex items-start gap-3">
        <div className={cn('mt-0.5 flex-shrink-0', styles.icon)}>
          {IconComponent}
        </div>
        <div className="min-w-0 flex-1">
          <div className={cn('mb-2 text-lg font-semibold', styles.text)}>
            {title}
          </div>
          <div className={cn('mb-4 text-sm leading-relaxed', styles.desc)}>
            {children}
          </div>
          {dismissible && (
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`dont-show-${id}`}
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(!!checked)}
                  className="border-white/30 bg-white/10 text-white data-[state=checked]:bg-white data-[state=checked]:text-[#3FB5AE] dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-[#2A8A85]"
                />
                <Label
                  htmlFor={`dont-show-${id}`}
                  className={cn(
                    'cursor-pointer text-sm transition-colors hover:opacity-80',
                    styles.desc,
                  )}
                >
                  Não mostrar novamente
                </Label>
              </div>
              <Button
                onClick={handleClose}
                className={cn(
                  'w-full border-white/20 bg-white/20 text-white transition-colors hover:bg-white/30 sm:w-auto',
                  styles.hover,
                )}
                variant="ghost"
              >
                Entendi
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Modal
  if (asModal) {
    const handleDialogClose = (newOpen: boolean) => {
      if (!newOpen) handleClose();
    };

    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent
          className={cn(
            'border-l-4 sm:max-w-md',
            styles.bg,
            styles.border,
            className,
          )}
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">{title}</DialogTitle>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  // Inline
  return (
    <Alert
      variant="default"
      className={cn(
        'relative border-l-4 shadow-lg',
        styles.bg,
        styles.border,
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3 sm:gap-4">
          <div className={cn('mt-0.5 flex-shrink-0', styles.icon)}>
            {IconComponent}
          </div>
          <div className="min-w-0 flex-1">
            <AlertTitle className={cn('mb-1 font-semibold', styles.text)}>
              {title}
            </AlertTitle>
            <AlertDescription className={cn('mb-3 text-sm', styles.desc)}>
              {children}
            </AlertDescription>
            {dismissible && (
              <div className="mt-4 flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`dont-show-${id}`}
                    checked={dontShowAgain}
                    onCheckedChange={(checked) => setDontShowAgain(!!checked)}
                    className="border-white/30 bg-white/10 text-white data-[state=checked]:bg-white data-[state=checked]:text-[#3FB5AE] dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-[#2A8A85]"
                  />
                  <Label
                    htmlFor={`dont-show-${id}`}
                    className={cn(
                      'cursor-pointer text-sm transition-colors hover:opacity-80',
                      styles.desc,
                    )}
                  >
                    Não mostrar novamente
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className={cn(
                    'w-full border-white/20 bg-white/20 text-white transition-colors hover:bg-white/30 sm:w-auto',
                    styles.hover,
                  )}
                >
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="self-start rounded-md p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Fechar aviso"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  );
}

export function resetDismissibleAlert(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`dismissible-alert-${id}`);
  }
}
