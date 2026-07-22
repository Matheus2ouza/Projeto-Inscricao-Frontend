'use client';

import { RoleType } from '@/features/accounts/types/createAccount/createAccountTypes';
import { Account } from '@/features/accounts/types/listAccounts/listAccountsTypes';
import type { RegionDto } from '@/features/regions/api/getRegions';
import { MultiSelectRegion } from '@/features/regions/components/MultiSelectRegion';
import { Button } from '@/shared/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCreateAccount } from '../hooks/createAccount/useCreateAccount';
import { CreateUserDialog } from './CreateUserDialog';
import { SuccessDialog } from './SuccessDialog';

const ROLE_RANK: Record<string, number> = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2,
  SUPER: 3,
};

export const ROLES = [
  {
    label: 'SUPER',
    value: 'SUPER',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  },
  { label: 'ADMIN', value: 'ADMIN', color: 'bg-blue-500 text-white' },
  { label: 'MANAGER', value: 'MANAGER', color: 'bg-green-500 text-white' },
  { label: 'USER', value: 'USER', color: 'bg-gray-400 text-white' },
];

type AccountsTableProps = {
  userRegionId: string;
  userRole: RoleType;
  accounts: Account[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  regions: RegionDto[];
};

export default function AccountsTable({
  userRegionId,
  userRole,
  accounts,
  total,
  page,
  pageCount,
  onPageChange,
  regions,
}: AccountsTableProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [appliedRegions, setAppliedRegions] = useState<string[]>([]);

  const createAccount = useCreateAccount();

  const currentRoleValue = userRole ?? RoleType.ADMIN;
  const currentRoleRank = ROLE_RANK[currentRoleValue] ?? 0;
  const allowedRoleOptions = useMemo(() => {
    const options = ROLES.filter(
      (role) => (ROLE_RANK[role.value] ?? 0) <= currentRoleRank,
    );
    return options.length > 0 ? options : [ROLES[ROLES.length - 1]];
  }, [currentRoleRank]);

  const regionOptions = useMemo(() => {
    return regions.map((r) => ({
      label: r.name.toUpperCase(),
      value: r.id,
    }));
  }, [regions]);

  const defaultRoleValue = (allowedRoleOptions[allowedRoleOptions.length - 1]
    ?.value ?? ROLES[ROLES.length - 1].value) as RoleType;
  const isSuperUser = currentRoleValue === 'SUPER';

  const regionMap = useMemo(() => {
    const map = new Map();
    regions.forEach((region) => {
      map.set(region.id, region.name.toUpperCase());
    });
    return map;
  }, [regions]);

  const handleSearch = () => {
    setAppliedRegions([...selectedRegions]);
    onPageChange(1);
  };

  const clearFilters = () => {
    setSelectedRegions([]);
    setAppliedRegions([]);
    onPageChange(1);
  };

  const filteredUsers = useMemo(() => {
    if (appliedRegions.length === 0) {
      return accounts;
    }

    const appliedRegionNames = appliedRegions
      .map((regionId) => regionMap.get(regionId))
      .filter(Boolean);

    return accounts.filter((account) =>
      appliedRegionNames.includes(account.regionName?.toUpperCase()),
    );
  }, [accounts, appliedRegions, regionMap]);

  const filteredTotal =
    appliedRegions.length > 0 ? filteredUsers.length : total;
  const filteredPageCount =
    appliedRegions.length > 0
      ? Math.ceil(filteredUsers.length / 20)
      : pageCount;

  const hasUnsavedFilters =
    selectedRegions.length !== appliedRegions.length ||
    !selectedRegions.every((region, index) => region === appliedRegions[index]);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setOpenSuccessDialog(true);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPER:
        'bg-riodavida/20 text-riodavida dark:bg-riodavida/30 dark:text-riodavida-light',
      ADMIN:
        'bg-riodavida-secondary/20 text-riodavida-secondary dark:bg-riodavida-secondary/30 dark:text-riodavida-muted-light',
      MANAGER:
        'bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400',
      USER: 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400',
    };
    return colors[role] || colors.USER;
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header com filtros */}
        <div
          className={`mb-6 flex flex-wrap items-center gap-3 ${
            currentRoleValue.toLowerCase() === 'super'
              ? 'justify-between'
              : 'justify-end'
          }`}
        >
          {currentRoleValue.toLowerCase() === 'super' && (
            <div className="flex flex-wrap items-center gap-2">
              <MultiSelectRegion
                value={selectedRegions}
                onChange={setSelectedRegions}
                options={regionOptions}
                label="Filtrar região"
              />
              <Button
                variant="outline"
                onClick={handleSearch}
                type="button"
                disabled={!hasUnsavedFilters}
                className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark"
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar {appliedRegions.length > 0 && `(${filteredTotal})`}
              </Button>
              <Button
                variant="destructive"
                onClick={clearFilters}
                disabled={appliedRegions.length === 0}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            </div>
          )}
          <Button
            variant="default"
            className="bg-riodavida hover:bg-riodavida-dark text-white"
            onClick={() => setOpenCreateDialog(true)}
          >
            Criar Usuário
          </Button>
        </div>

        {/* Indicador de filtro aplicado */}
        {appliedRegions.length > 0 && (
          <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 mb-4 rounded-lg border p-3">
            <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm">
              Filtro aplicado: {appliedRegions.length} região(ões)
              selecionada(s)
            </p>
          </div>
        )}

        {/* Tabela */}
        <div className="liquid-card overflow-hidden rounded-lg border-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-riodavida/5 dark:bg-riodavida/10">
                <tr>
                  <th className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-2 py-3 text-left font-semibold">
                    Username
                  </th>
                  <th className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/6 px-4 py-3 text-center font-semibold">
                    Região
                  </th>
                  <th className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/6 px-4 py-3 text-center font-semibold">
                    Role
                  </th>
                  <th className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-4 py-3 text-center font-semibold">
                    Criado em
                  </th>
                  <th className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-4 py-3 text-center font-semibold">
                    Atualizado em
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.username + idx}
                    className="border-riodavida/10 hover:bg-riodavida/5 border-t transition-colors"
                  >
                    <td className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-2 py-2 font-medium">
                      {user.username}
                    </td>
                    <td className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/6 px-4 py-2 text-center">
                      {user.regionName?.toUpperCase() || '- -'}
                    </td>
                    <td className="w-1/6 px-4 py-2 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-4 py-2 text-center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-riodavida-gray-dark dark:text-riodavida-gray w-1/4 px-4 py-2 text-center">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredUsers.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            {appliedRegions.length > 0
              ? 'Nenhum usuário encontrado para as regiões selecionadas.'
              : 'Nenhum usuário encontrado.'}
          </div>
        )}

        {/* Paginação */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-muted-foreground text-sm">
            Página {page} de {filteredPageCount} - {filteredTotal} usuário(s)
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: filteredPageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                    className={
                      page === i + 1
                        ? 'bg-riodavida hover:bg-riodavida-dark text-white'
                        : 'text-riodavida-gray-dark dark:text-riodavida-gray hover:bg-riodavida/10'
                    }
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    page < filteredPageCount && onPageChange(page + 1)
                  }
                  href={page < filteredPageCount ? '#' : undefined}
                  className={
                    page === filteredPageCount
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Modais */}
        <CreateUserDialog
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          isSuperUser={isSuperUser}
          allowedRoleOptions={allowedRoleOptions}
          regionOptions={regionOptions}
          defaultRoleValue={defaultRoleValue}
          userRegionId={userRegionId}
          onSuccess={handleCreateSuccess}
          createAccount={createAccount}
        />

        <SuccessDialog
          open={openSuccessDialog}
          onOpenChange={setOpenSuccessDialog}
          createdCredentials={createAccount.createdCredentials}
          clearCreatedCredentials={createAccount.clearCreatedCredentials}
        />
      </div>
    </div>
  );
}
