'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/utils/formatDate';
import { getListCashRegistersStatusInfo } from '@/shared/utils/getCashRegisterStatusInfo';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { getInitial } from '@/shared/utils/getInitials';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Calendar, DollarSign, Plus, Wallet } from 'lucide-react';
import { useState } from 'react';
import type {
  CreateCashInput,
  CreateCashResponse,
} from '../types/createCashRegister/createCashRegisterTypes';
import { CashRegister, CashRegisterStatus } from '../types/listCashRegisters';
import CashRegisterStatusFilter from './CashRegisterStatusFilter';
import CreateCashRegisterDialog from './createCashRegister/CreateCashRegisterDialog';

interface LisCashRegistersPros {
  cashRegisters: CashRegister[] | null;
  onCreateCashRegister: (input: CreateCashInput) => Promise<CreateCashResponse>;
  isCreatingCashRegister?: boolean;
  onSelectCashRegister: (cashRegister: string) => void;
  statusFilter: CashRegisterStatus[];
  onStatusFilterChange: (value: CashRegisterStatus[]) => void;
  onApplyStatusFilter: () => void;
}

export function LisCashRegisters({
  cashRegisters,
  onCreateCashRegister,
  isCreatingCashRegister = false,
  onSelectCashRegister,
  statusFilter,
  onStatusFilterChange,
  onApplyStatusFilter,
}: LisCashRegistersPros) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CashRegisterStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full sm:w-[220px]"
          />
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={onApplyStatusFilter}
          >
            Aplicar
          </Button>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          disabled={isCreatingCashRegister}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {isCreatingCashRegister ? 'Criando...' : 'Criar caixa'}
        </Button>
      </div>

      {!cashRegisters || cashRegisters.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
          <Wallet className="h-10 w-10" />
          <p>Nenhum caixa encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cashRegisters.map((cashRegister) => {
            const statusInfo = getListCashRegistersStatusInfo(
              cashRegister.status,
            );
            const gradientClass = getGradientClass(cashRegister.name);

            return (
              <Card
                key={cashRegister.id}
                className="w-full overflow-hidden rounded-xl border border-transparent bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-zinc-900"
              >
                <CardBody className="relative overflow-visible p-0">
                  <AspectRatio ratio={16 / 9} className="w-full">
                    <div
                      className={`h-full w-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                    >
                      <h3 className="px-4 text-center text-5xl font-semibold tracking-wide text-white sm:text-6xl md:text-7xl">
                        {getInitial(cashRegister.name)}
                      </h3>
                    </div>
                  </AspectRatio>
                  <div className="absolute top-2 right-2 select-none">
                    <Badge className={`${statusInfo.badgeClass} border-0`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardBody>

                <CardFooter className="flex flex-col items-start gap-3 rounded-b-xl border-t border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="w-full space-y-1">
                    <h3 className="line-clamp-2 text-base font-bold text-gray-900 uppercase dark:text-white">
                      {cashRegister.name}
                    </h3>
                  </div>

                  <div className="w-full space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-muted-foreground">Saldo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getFormatCurrency(cashRegister.balance)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-muted-foreground">Aberto em:</span>
                      <span className="font-medium">
                        {formatDate(cashRegister.openedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-muted-foreground">Fechado em:</span>
                      <span className="font-medium">
                        {cashRegister.closedAt
                          ? formatDate(cashRegister.closedAt)
                          : 'ainda está aberto'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full pt-2">
                    <Button
                      size="sm"
                      className="w-full rounded-lg dark:text-white"
                      onClick={() => onSelectCashRegister(cashRegister.id)}
                    >
                      Visualizar caixa
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <CreateCashRegisterDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateCashRegister={onCreateCashRegister}
        isSubmitting={isCreatingCashRegister}
      />
    </div>
  );
}
