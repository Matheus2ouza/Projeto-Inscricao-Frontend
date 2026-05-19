'use client';

import { useAccount } from '@/features/accounts/hooks/useAccount';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Plus } from 'lucide-react';

interface ResponsiblesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedResponsibleIds: string[];
  onAddResponsible: (responsibleId: string) => void;
}

export default function ResponsiblesDialog({
  open,
  onOpenChange,
  selectedResponsibleIds,
  onAddResponsible,
}: ResponsiblesDialogProps) {
  const { accounts, loading } = useAccount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-[80vw] flex-col overflow-hidden sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Gerenciar Responsáveis</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Carregando responsáveis...
              </p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhum responsável disponível
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] px-4">ID</TableHead>
                    <TableHead className="px-4">Nome</TableHead>
                    <TableHead className="px-4">Role</TableHead>
                    <TableHead className="w-[150px] px-4">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => {
                    const isAlreadyAdded = selectedResponsibleIds.includes(
                      account.id,
                    );

                    return (
                      <TableRow key={account.id}>
                        <TableCell className="px-4 py-3 font-mono text-sm">
                          {account.id}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-medium">
                          {account.username.toUpperCase()}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-medium">
                          {account.role.toUpperCase()}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAddResponsible(account.id)}
                            disabled={isAlreadyAdded}
                            className="flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            {isAlreadyAdded ? 'Adicionado' : 'Adicionar'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
