'use client';

import { useCreateAccount } from '@/features/accounts/hooks/createAccount/useCreateAccount';
import { RoleType } from '@/features/accounts/types/createAccount/createAccountTypes';
import { LocalityComboboxMulti } from '@/features/locality/components/LocalityComboboxMulti';
import { ComboboxRegion } from '@/features/regions/components/ComboboxRegion';
import { cn } from '@/lib/utils';
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
import { Switch } from '@/shared/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { ComboboxRole } from './ComboboxRole';

type RoleOption = {
  label: string;
  value: string;
  color: string;
};

type CreateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSuperUser: boolean;
  allowedRoleOptions: RoleOption[];
  regionOptions: { label: string; value: string }[];
  defaultRoleValue: RoleType;
  userRegionId?: string;
  onSuccess: (username: string, password: string) => void;
  createAccount: ReturnType<typeof useCreateAccount>;
};

export function CreateUserDialog({
  open,
  onOpenChange,
  isSuperUser,
  allowedRoleOptions,
  regionOptions,
  defaultRoleValue,
  userRegionId,
  onSuccess,
  createAccount,
}: CreateUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [hasRegion, setHasRegion] = useState(false);

  const { form, onSubmit, isLoading, createdCredentials } = createAccount;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Reset do formulário quando o dialog abre
  useEffect(() => {
    if (open) {
      form.reset({
        username: '',
        password: '',
        role: defaultRoleValue,
        localityIds: [],
        regionId: isSuperUser ? undefined : userRegionId,
      });

      // Configura o estado do switch baseado no tipo de usuário
      setHasRegion(isSuperUser);
    }
  }, [open, isSuperUser, userRegionId, form, defaultRoleValue]);

  useEffect(() => {
    if (createdCredentials) {
      onOpenChange(false); // fecha o dialog de criação
      onSuccess(createdCredentials.username, createdCredentials.password);
    }
  }, [createdCredentials, onOpenChange, onSuccess]);

  const handleSubmit = async (event: React.FormEvent) => {
    await onSubmit(event);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-h-[95vh] overflow-y-auto',
          // Responsividade: diferentes tamanhos para diferentes telas
          'w-[95vw] max-w-[95vw]',
          'sm:w-[90vw] sm:max-w-[600px]',
          'md:w-[85vw] md:max-w-[700px]',
          'lg:w-[80vw] lg:max-w-[800px]',
          'xl:max-w-[900px]',
          'p-4 sm:p-6',
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
            Criar Usuário
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Coluna 1 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
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
                  name="password"
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
                  name="role"
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
              </div>

              {/* Coluna 2 */}
              <div className="space-y-4">
                {/* Campo de Localidade - Múltipla Seleção com pesquisa */}
                <div className="space-y-2">
                  <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                    Localidades <span className="text-destructive">*</span>
                  </FormLabel>
                  <LocalityComboboxMulti
                    form={form}
                    name="localityIds"
                    placeholder="Pesquisar e selecionar localidades..."
                  />
                </div>

                {isSuperUser && (
                  <>
                    <div className="flex items-center gap-2 pt-2">
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
                        name="regionId"
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
              </div>
            </div>

            <DialogFooter className="border-riodavida/10 flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-riodavida hover:bg-riodavida-dark w-full text-white sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Criando...' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
