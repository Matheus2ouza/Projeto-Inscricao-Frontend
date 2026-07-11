'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginSchema, LoginType } from '../../schemas/login/loginSchema';

type UseLoginType = {
  form: ReturnType<typeof useForm<LoginType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

export function useLogin(): UseLoginType {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onLoginSubmit(input: LoginType) {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        username: input.username,
        password: input.password,
        redirect: false,
      });

      if (result?.ok) {
        const session = await getSession();
        const role = session?.user.role.toLocaleLowerCase();
        const redirectUrl = `/${role}/home`;
        router.push(redirectUrl);
        return;
      }

      toast.error('Erro ao fazer login', {
        description: result?.error ?? 'Erro inesperado ao efetuar login',
        richColors: true,
      });
    } catch (error) {
      const err = error as Error;
      toast.error('Erro ao fazer login', {
        description: err.message,
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(onLoginSubmit)(event);

  const output: UseLoginType = {
    form,
    onSubmit,
    isLoading,
  };

  return output;
}
