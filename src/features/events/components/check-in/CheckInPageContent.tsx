"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import {
  Check,
  ChevronsUpDown,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckInAccount, CheckInEventInfo } from "../../types/check-in/checkInTypes";

interface CheckInPageContentProps {
  event: CheckInEventInfo;
  accounts: CheckInAccount[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  tableLoading?: boolean;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onlyWithDebt: boolean;
  onOnlyWithDebtChange: (value: boolean) => void;
  onAccountClick?: (accountId: string) => void;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const getStatusClasses = (status: string) => {
  const normalized = status.toUpperCase();
  if (normalized.includes("PENDENTE")) {
    return "border-destructive text-destructive";
  }
  if (normalized.includes("PAGO") || normalized.includes("OK")) {
    return "border-emerald-200 text-emerald-700";
  }
  return "border-foreground/20";
};

export default function CheckInPageContent({
  event,
  accounts,
  page,
  pageCount,
  onPageChange,
  tableLoading = false,
  pageSize,
  onPageSizeChange,
  onlyWithDebt,
  onOnlyWithDebtChange,
  onAccountClick,
}: CheckInPageContentProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = useMemo(
    () => [
      { value: "10", label: "10" },
      { value: "15", label: "15" },
      { value: "25", label: "25" },
    ],
    []
  );

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      ),
    [options, query]
  );
  return (
    <>
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="w-full lg:w-1/3">
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border/40 bg-muted">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="h-full w-full bg-muted flex items-center justify-center text-3xl font-semibold text-muted-foreground">
                    {event.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Evento</p>
                  <p className="text-2xl font-semibold">{event.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contas</p>
                    <p className="text-xl font-semibold">
                      {event.countAccounts}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Faturamento total
                    </p>
                    <p className="text-xl font-semibold">
                      {currencyFormatter.format(event.amountCollected)}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border bg-card flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-100">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Débitos</p>
                    <p className="text-xl font-semibold text-destructive">
                      {currencyFormatter.format(event.totalDebt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="px-6 pt-6">
          <CardTitle>Contas do Evento</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <p className="font-semibold uppercase tracking-[0.2em]">Contas</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                    Apenas com débitos
                  </p>
                  <Switch
                    checked={onlyWithDebt}
                    onCheckedChange={(checked) =>
                      onOnlyWithDebtChange(Boolean(checked))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em]">
                  Itens por página
                </p>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[120px] justify-between px-3 text-sm"
                    >
                      {options.find(
                        (option) => option.value === String(pageSize)
                      )?.label ?? "10"}
                      <ChevronsUpDown className="text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>Nenhuma opção.</CommandEmpty>
                        <CommandGroup>
                          {filteredOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={(currentValue) => {
                                onPageSizeChange(Number(currentValue));
                                setOpen(false);
                                setQuery("");
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  pageSize === Number(option.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          {tableLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-1/3" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-11 rounded-lg border border-border/50 bg-muted/60"
                />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Inscrições</TableHead>
                  <TableHead className="text-center">Pagamentos</TableHead>
                  <TableHead className="text-center">Débitos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow
                    key={account.id}
                    className={
                      onAccountClick ? "cursor-pointer hover:bg-muted/60" : ""
                    }
                    onClick={
                      onAccountClick
                        ? () => onAccountClick(account.id)
                        : undefined
                    }
                  >
                    <TableCell className="font-medium">
                      {account.username}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.2em] ${getStatusClasses(
                          account.status
                        )}`}
                      >
                        {account.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {account.countInscriptions}
                    </TableCell>
                    <TableCell className="text-center">
                      {account.countPay}
                    </TableCell>
                    <TableCell
                      className={`text-center ${account.countDebt > 0 ? "text-red-600" : ""}`}
                    >
                      {account.countDebt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {pageCount > 1 && (
        <div className="mt-8 flex flex-col gap-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {(() => {
                const windowSize = 3;
                const half = Math.floor(windowSize / 2);
                const maxStart = Math.max(pageCount - windowSize + 1, 1);
                const start = Math.min(Math.max(page - half, 1), maxStart);
                const end = Math.min(pageCount, start + windowSize - 1);
                return Array.from({ length: end - start + 1 }, (_, index) => {
                  const pageNumber = start + index;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        href="#"
                        onClick={() => onPageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  href={page < pageCount ? "#" : undefined}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
