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
import { AlertCircle, Check, CheckCircle2, Copy } from 'lucide-react';
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
  const [appliedRegions, setAppliedRegions] = useState<string[]>([]); // Filtro aplicado
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

  // Transformar as regiões do hook no formato de Option
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

  // Criar um mapa de id para nome da região para facilitar o filtro
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

  // Aplicar o filtro quando clicar em buscar
  const handleSearch = () => {
    setAppliedRegions([...selectedRegions]);
    onPageChange(1); // Reset para primeira página ao aplicar filtro
  };

  // Limpar filtros
  const clearFilters = () => {
    setSelectedRegions([]);
    setAppliedRegions([]);
    onPageChange(1); // Reset para primeira página ao limpar filtro
  };

  // Filtrar usuários baseado nas regiões aplicadas
  const filteredUsers = useMemo(() => {
    if (appliedRegions.length === 0) {
      return users;
    }

    // Obter os nomes das regiões aplicadas
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

  // Verificar se há filtros não aplicados
  const hasUnsavedFilters =
    selectedRegions.length !== appliedRegions.length ||
    !selectedRegions.every((region, index) => region === appliedRegions[index]);

  // Função para lidar com o submit e fechar o dialog se sucesso
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

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`mb-6 flex flex-wrap items-center gap-2 ${
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
              >
                Buscar {appliedRegions.length > 0 && `(${filteredTotal})`}
              </Button>
              <Button
                variant="destructive"
                onClick={clearFilters}
                disabled={appliedRegions.length === 0}
              >
                Limpar
              </Button>
            </div>
          )}
          <Button
            variant="default"
            className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
            onClick={() => setOpen(true)}
          >
            Criar Usuário
          </Button>
        </div>

        {/* Indicador de filtro aplicado */}
        {appliedRegions.length > 0 && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Filtro aplicado: {appliedRegions.length} região(ões)
              selecionada(s)
            </p>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="w-1/4 px-2 py-2 text-left font-semibold">
                  Username
                </th>
                <th className="w-1/6 px-4 py-2 text-center font-semibold">
                  Região
                </th>
                <th className="w-1/6 px-4 py-2 text-center font-semibold">
                  Role
                </th>
                <th className="w-1/4 px-4 py-2 text-center font-semibold">
                  Criado em
                </th>
                <th className="w-1/4 px-4 py-2 text-center font-semibold">
                  Atualizado em
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => {
                const roleObj = ROLES.find((r) => r.value === user.role);
                return (
                  <tr key={user.username + idx} className="border-t">
                    <td className="w-1/4 px-2 py-2">{user.username}</td>
                    <td className="w-1/6 px-4 py-2 text-center">
                      {user.regionName?.toUpperCase() || '- -'}
                    </td>
                    <td className="w-1/6 px-4 py-2 text-center">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${roleObj?.color}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="w-1/4 px-4 py-2 text-center">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="w-1/4 px-4 py-2 text-center">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredUsers.length === 0 && (
          <div className="text-muted-foreground py-8 text-center">
            {appliedRegions.length > 0
              ? 'Nenhum usuário encontrado para as regiões selecionadas.'
              : 'Nenhum usuário encontrado.'}
          </div>
        )}

        {/* Paginação para dados filtrados */}
        <div className="mt-4 flex justify-end">
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

        {/* Informações de paginação */}
        <div className="text-muted-foreground mt-2 text-center text-sm">
          Página {page} de {filteredPageCount} - {filteredTotal} usuário(s)
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">Criar Usuário</DialogTitle>
            </DialogHeader>
            {/* Formulário */}
            <FormProvider {...form}>
              <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                {/* username */}
                <div>
                  <FormField
                    control={form.control}
                    name={'username'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="username"
                          className="text-transform: flex items-center text-sm font-medium text-gray-700 uppercase dark:text-gray-300"
                        >
                          <i className="bi bi-geo-alt text-indigo-500 dark:text-blue-500"></i>
                          Usuário
                        </FormLabel>
                        <FormControl className="relative">
                          <Input
                            id="username"
                            type="text"
                            autoComplete="new-username"
                            placeholder="Digite sua localidade"
                            className="focus:ring-opacity-60 w-full rounded-xl border-gray-300 bg-white/50 py-3 pr-4 pl-4 shadow-sm backdrop-blur-sm transition-all duration-300 focus:border-indigo-400 focus:shadow-md focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* password */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={'password'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="password"
                          className="text-transform: flex items-center text-sm font-medium text-gray-700 uppercase dark:text-gray-300"
                        >
                          <i className="bi bi-lock text-indigo-500 dark:text-blue-500"></i>
                          Senha
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="Digite sua senha"
                              className="focus:ring-opacity-60 w-full rounded-xl border-gray-300 bg-white/50 py-3 pr-12 pl-4 shadow-sm backdrop-blur-sm transition-all duration-300 focus:border-indigo-400 focus:shadow-md focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 transition-colors duration-200 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                            onClick={togglePasswordVisibility}
                          >
                            <i
                              className={`bi ${
                                showPassword ? 'bi-eye-slash' : 'bi-eye'
                              } text-lg`}
                            ></i>
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Permissão (role) */}
                <div>
                  <FormField
                    control={form.control}
                    name={'role'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="role" className="mb-2">
                          PERMISSÃO
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
                </div>
                {/* Switch para adicionar região - apenas super pode alterar */}
                {isSuperUser && (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <label
                        htmlFor="hasRegion"
                        className="cursor-pointer text-sm text-gray-700 select-none dark:text-gray-300"
                      >
                        Adicionar região
                      </label>
                      <Switch
                        id="hasRegion"
                        checked={hasRegion}
                        onCheckedChange={setHasRegion}
                      />
                    </div>
                    {hasRegion && (
                      <FormField
                        control={form.control}
                        name={'region'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="region" className="mb-2">
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
                <DialogFooter>
                  <Button
                    type="submit"
                    className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                  >
                    Criar
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-primary text-xl font-bold dark:text-white">
                  Usuário Criado com Sucesso!
                </DialogTitle>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Salve estas credenciais em um local seguro. Elas não serão
                exibidas novamente.
              </p>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Campo Usuário */}
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Usuário
                </label>
                <div className="bg-muted/50 dark:bg-muted/30 border-border flex items-center gap-2 rounded-lg border p-3">
                  <code className="text-foreground flex-1 font-mono text-sm font-semibold break-all">
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
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : ''
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
                  <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Check className="h-3 w-3" />
                    Usuário copiado para a área de transferência!
                  </p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm font-medium">
                  Senha
                </label>
                <div className="bg-muted/50 dark:bg-muted/30 border-border flex items-center gap-2 rounded-lg border p-3">
                  <code className="text-foreground flex-1 font-mono text-sm font-semibold break-all">
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
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : ''
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
                  <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Check className="h-3 w-3" />
                    Senha copiada para a área de transferência!
                  </p>
                )}
              </div>

              {/* Aviso */}
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
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
                  variant="default"
                  className="w-full sm:w-auto dark:text-white"
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
