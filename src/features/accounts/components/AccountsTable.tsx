'use client';

import type { UserDto } from '@/features/accounts/api/getUsers';
import { ComboboxRole } from '@/features/accounts/components/ComboboxRole';
import useFormCreateAccount, {
  ROLES,
} from '@/features/accounts/hooks/useFormCreateAccount';
import type { RegionDto } from '@/features/regions/api/getRegions';
import { ComboboxRegion } from '@/features/regions/components/ComboboxRegion';
import { MultiSelectRegion } from '@/features/regions/components/MultiSelectRegion';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Switch } from '@/shared/components/ui/switch';
import { useCurrentUser } from '@/shared/context/user-context';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Search,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider } from 'react-hook-form';

const ROLE_RANK: Record<string, number> = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2,
  SUPER: 3,
};

type AccountsTableProps = {
  users: UserDto[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  regions: RegionDto[];
};

export default function AccountsTable({
  users,
  total,
  page,
  pageCount,
  onPageChange,
  regions,
}: AccountsTableProps) {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [openCreds, setOpenCreds] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [appliedRegions, setAppliedRegions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [hasRegion, setHasRegion] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const { form, onSubmit, createdCredentials, clearCreatedCredentials } =
    useFormCreateAccount();

  const currentRoleValue = user?.role?.toUpperCase() ?? 'USER';
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

  const defaultRoleValue =
    allowedRoleOptions[allowedRoleOptions.length - 1]?.value ??
    ROLES[ROLES.length - 1].value;
  const isSuperUser = currentRoleValue === 'SUPER';

  const regionMap = useMemo(() => {
    const map = new Map();
    regions.forEach((region) => {
      map.set(region.id, region.name.toUpperCase());
    });
    return map;
  }, [regions]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      return users;
    }

    const appliedRegionNames = appliedRegions
      .map((regionId) => regionMap.get(regionId))
      .filter(Boolean);

    return users.filter((user) =>
      appliedRegionNames.includes(user.regionName?.toUpperCase()),
    );
  }, [users, appliedRegions, regionMap]);

  const filteredTotal =
    appliedRegions.length > 0 ? filteredUsers.length : total;
  const filteredPageCount =
    appliedRegions.length > 0
      ? Math.ceil(filteredUsers.length / 20)
      : pageCount;

  const hasUnsavedFilters =
    selectedRegions.length !== appliedRegions.length ||
    !selectedRegions.every((region, index) => region === appliedRegions[index]);

  const handleSubmit = async (event: React.FormEvent) => {
    const success = await onSubmit(event);
    if (success) {
      setOpen(false);
      setOpenCreds(true);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        username: '',
        password: '',
        role: defaultRoleValue,
        region: isSuperUser ? '' : (user?.region?.id ?? ''),
      });
      setHasRegion(isSuperUser);
    }
  }, [form, open, defaultRoleValue, isSuperUser, user?.region?.id]);

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
            user.role.toLowerCase() === 'super'
              ? 'justify-between'
              : 'justify-end'
          }`}
        >
          {user.role.toLowerCase() === 'super' && (
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
            onClick={() => setOpen(true)}
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
                {filteredUsers.map((user, idx) => {
                  const roleObj = ROLES.find((r) => r.value === user.role);
                  return (
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
                  );
                })}
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

        {/* Dialog de Criação */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                Criar Usuário
              </DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                <FormField
                  control={form.control}
                  name={'username'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Usuário <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          type="text"
                          autoComplete="new-username"
                          placeholder="Digite o nome de usuário"
                          className="focus:border-riodavida focus:ring-riodavida/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={'password'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Senha <span className="text-destructive">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Digite a senha"
                            className="focus:border-riodavida focus:ring-riodavida/20 pr-10"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="hover:text-riodavida absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 transition-colors dark:text-gray-400"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={'role'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Permissão
                      </FormLabel>
                      <FormControl>
                        <ComboboxRole
                          value={field.value as string}
                          onChange={field.onChange}
                          options={allowedRoleOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSuperUser && (
                  <>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="hasRegion"
                        checked={hasRegion}
                        onCheckedChange={setHasRegion}
                      />
                      <label
                        htmlFor="hasRegion"
                        className="text-riodavida-gray-dark dark:text-riodavida-gray cursor-pointer text-sm select-none"
                      >
                        Adicionar região
                      </label>
                    </div>
                    {hasRegion && (
                      <FormField
                        control={form.control}
                        name={'region'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                              Região
                            </FormLabel>
                            <FormControl>
                              <ComboboxRegion
                                value={field.value as string}
                                onChange={field.onChange}
                                options={regionOptions}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-riodavida hover:bg-riodavida-dark w-full text-white sm:w-auto"
                  >
                    Criar
                  </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>

        {/* Modal de credenciais criadas */}
        <Dialog
          open={openCreds}
          onOpenChange={(v) => {
            setOpenCreds(v);
            if (!v) {
              clearCreatedCredentials();
              setCopiedUsername(false);
              setCopiedPassword(false);
            }
          }}
        >
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
                Salve estas credenciais em um local seguro. Elas não serão
                exibidas novamente.
              </p>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Usuário
                </label>
                <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex items-center gap-2 rounded-lg border p-3">
                  <code className="text-riodavida-gray-dark dark:text-riodavida-gray flex-1 font-mono text-sm font-semibold break-all">
                    {createdCredentials?.username ?? '-'}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (createdCredentials?.username) {
                        await navigator.clipboard.writeText(
                          createdCredentials.username,
                        );
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
                    {createdCredentials?.password ?? '-'}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (createdCredentials?.password) {
                        await navigator.clipboard.writeText(
                          createdCredentials.password,
                        );
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
                  <strong>Atenção:</strong> Estas credenciais são exibidas
                  apenas uma vez. Certifique-se de salvá-las antes de fechar
                  este diálogo.
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
      </div>
    </div>
  );
}
