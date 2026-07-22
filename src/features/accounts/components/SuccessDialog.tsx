'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { AlertCircle, Check, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';

type SuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createdCredentials: { username: string; password: string } | null;
  clearCreatedCredentials: () => void;
};

export function SuccessDialog({
  open,
  onOpenChange,
  createdCredentials,
  clearCreatedCredentials,
}: SuccessDialogProps) {
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const username = createdCredentials?.username;
  const password = createdCredentials?.password;

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      clearCreatedCredentials(); // Limpa as credenciais via hook
      setCopiedUsername(false);
      setCopiedPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-riodavida/10 flex h-10 w-10 items-center justify-center rounded-full">
              <CheckCircle2 className="text-riodavida h-6 w-6" />
            </div>
            <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
              Usuário Criado com Sucesso!
            </DialogTitle>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            Salve estas credenciais em um local seguro. Elas não serão exibidas
            novamente.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Usuário
            </label>
            <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex items-center gap-2 rounded-lg border p-3">
              <code className="text-riodavida-gray-dark dark:text-riodavida-gray flex-1 font-mono text-sm font-semibold break-all">
                {username ?? '-'}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  if (username) {
                    await navigator.clipboard.writeText(username);
                    setCopiedUsername(true);
                    setTimeout(() => setCopiedUsername(false), 2000);
                  }
                }}
                aria-label="Copiar usuário"
                className={`shrink-0 transition-all duration-200 ${
                  copiedUsername
                    ? 'bg-riodavida/10 text-riodavida dark:bg-riodavida/20'
                    : 'text-riodavida hover:bg-riodavida/10'
                }`}
              >
                {copiedUsername ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copiedUsername && (
              <p className="text-riodavida flex items-center gap-1 text-xs">
                <Check className="h-3 w-3" />
                Usuário copiado para a área de transferência!
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Senha
            </label>
            <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex items-center gap-2 rounded-lg border p-3">
              <code className="text-riodavida-gray-dark dark:text-riodavida-gray flex-1 font-mono text-sm font-semibold break-all">
                {password ?? '-'}
              </code>
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  if (password) {
                    await navigator.clipboard.writeText(password);
                    setCopiedPassword(true);
                    setTimeout(() => setCopiedPassword(false), 2000);
                  }
                }}
                aria-label="Copiar senha"
                className={`shrink-0 transition-all duration-200 ${
                  copiedPassword
                    ? 'bg-riodavida/10 text-riodavida dark:bg-riodavida/20'
                    : 'text-riodavida hover:bg-riodavida/10'
                }`}
              >
                {copiedPassword ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copiedPassword && (
              <p className="text-riodavida flex items-center gap-1 text-xs">
                <Check className="h-3 w-3" />
                Senha copiada para a área de transferência!
              </p>
            )}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-200/50 bg-amber-50/80 p-3 dark:border-amber-800/30 dark:bg-amber-900/20">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <strong>Atenção:</strong> Estas credenciais são exibidas apenas
              uma vez. Certifique-se de salvá-las antes de fechar este diálogo.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-riodavida hover:bg-riodavida-dark w-full text-white sm:w-auto"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
