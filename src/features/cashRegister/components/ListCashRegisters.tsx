"use client";

import { formatDate } from "@/shared/utils/formatDate";
import { getListCashRegistersStatusInfo } from "@/shared/utils/getCashRegisterStatusInfo";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getInitial } from "@/shared/utils/getInitials";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button, Tag } from "antd";
import { Calendar, DollarSign, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import type {
  CreateCashInput,
  CreateCashResponse,
} from "../types/createCashRegister/createCashRegisterTypes";
import { CashRegisters } from "../types/listCashRegisters";
import CreateCashRegisterDialog from "./createCashRegister/CreateCashRegisterDialog";

interface LisCashRegistersPros {
  cashRegisters: CashRegisters[] | null;
  onCreateCashRegister: (input: CreateCashInput) => Promise<CreateCashResponse>;
  isCreatingCashRegister?: boolean;
  onSelectCashRegister: (cashRegister: string) => void;
}

export function LisCashRegisters({
  cashRegisters,
  onCreateCashRegister,
  isCreatingCashRegister = false,
  onSelectCashRegister,
}: LisCashRegistersPros) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => setCreateDialogOpen(true)}
          loading={isCreatingCashRegister}
          icon={<Plus className="h-4 w-4" />}
        >
          Criar caixa
        </Button>
      </div>

      {!cashRegisters || cashRegisters.length === 0 ? (
        <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
          Nenhum caixa encontrado
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cashRegisters.map((cashRegister) => {
            const statusInfo = getListCashRegistersStatusInfo(
              cashRegister.status,
            );
            const gradientClass = getGradientClass(cashRegister.name);

            return (
              <Card
                key={cashRegister.id}
                className="w-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl overflow-hidden hover:scale-[1.02] bg-white dark:bg-zinc-900 dark:border-zinc-800"
              >
                <CardBody className="p-0 relative overflow-visible">
                  <AspectRatio ratio={16 / 9} className="w-full">
                    <div
                      className={`w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                    >
                      <h3 className="text-white text-5xl sm:text-6xl md:text-7xl font-semibold tracking-wide text-center px-4">
                        {getInitial(cashRegister.name)}
                      </h3>
                    </div>
                  </AspectRatio>
                  <div className="absolute top-2 right-2 select-none">
                    <Tag
                      className={statusInfo.badgeClass}
                      style={{ border: 0 }}
                    >
                      {statusInfo.label}
                    </Tag>
                  </div>
                </CardBody>

                <CardFooter className="flex flex-col items-start p-4 gap-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl">
                  <div className="w-full space-y-1">
                    <h3 className="font-bold text-base line-clamp-2 text-gray-900 dark:text-white uppercase">
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

                    {cashRegister.closedAt && (
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-muted-foreground">
                          Fechado em:
                        </span>
                        <span className="font-medium">
                          {formatDate(cashRegister.closedAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full pt-2">
                    <Button
                      type="default"
                      className="w-full"
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
