'use client';

import { useGlobalLoading } from '@/components/GlobalLoading';
import { loginService } from '@/features/auth/web-api/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const loginSchema = z.object({
  username: z
    .string()
    .nonempty({ message: 'Localidade é obrigatória' })
    .min(2, { error: 'Localidade deve ter pelo menos 2 caracteres' }),
  password: z
    .string()
    .nonempty({ message: 'Senha é obrigatória' })
    .min(6, { error: 'Senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormType = z.infer<typeof loginSchema>;

export type UseFormLoginType = {
  form: ReturnType<typeof useForm<LoginFormType>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export default function useFormLogin(): UseFormLoginType {
  const router = useRouter();
  const { setLoading } = useGlobalLoading();
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onLoginForm(input: LoginFormType) {
    setLoading(true);
    try {
      const result = await loginService({
        username: input.username,
        password: input.password,
      });

      if (result.ok) {
        const redirectUrl = `/${result.user.role.toLowerCase()}/home`;
        router.push(redirectUrl);
        toast.success('Login feito com sucesso', {
          description: 'Login feito com sucesso',
          icon: <ThumbsUp />,
        });
        return;
      }

      toast.error('Erro no Login', {
        description: result.errorMessage,
      });
    } catch (error) {
      toast.error('Erro no Login', {
        description: 'Verifique os dados e tente novamente',
      });
      return;
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (event?: React.BaseSyntheticEvent) =>
    form.handleSubmit(onLoginForm)(event);

  const output = {
    form,
    onSubmit,
  };

  return output;
}
