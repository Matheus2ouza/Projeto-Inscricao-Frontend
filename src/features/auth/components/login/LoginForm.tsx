'use client';

import CookieConsent from '@/components/cookie/CookieConsent';
import { useLogin } from '@/features/auth/hooks';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Separator,
} from '@/shared/components/ui';
import Logo from '@/shared/components/ui/logo';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

export function LoginForm() {
  const { form, onSubmit, isLoading } = useLogin();
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main content */}
      <CookieConsent onAccept={() => setCookieAccepted(true)} />
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 border-white/30 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-900/90">
          <CardHeader className="text-center">
            <div className="mx-auto">
              <Logo className="h-20 w-20 object-contain" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Bem-vindo
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Faça login para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-5"
              aria-label="Formulário de login"
            >
              <Controller
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="username"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <User className="h-4 w-4 text-[#3FB5AE]" />
                      Usuário
                    </FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Digite seu usuário"
                      className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm focus:border-[#3FB5AE] focus:ring focus:ring-[#3FB5AE]/20 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="password"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <Lock className="h-4 w-4 text-[#3FB5AE]" />
                      Senha
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        className="rounded-xl border-gray-300 bg-white/50 pr-10 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        aria-label={
                          showPassword ? 'Ocultar senha' : 'Mostrar senha'
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className={`relative mt-1 w-full overflow-hidden rounded-full bg-gradient-to-r text-base font-semibold text-white ${generateGradientClass()}`}
                disabled={isLoading}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </span>
              </Button>
            </form>

            <Separator />

            {/* WhatsApp Support */}
            <div
              className="cursor-pointer rounded-xl border border-green-200/50 bg-gradient-to-r from-green-50/80 to-teal-50/80 p-4 backdrop-blur-sm transition-all duration-200 hover:from-green-100/80 hover:to-teal-100/80 dark:border-green-700/30 dark:from-green-900/20 dark:to-teal-900/20 dark:hover:from-green-800/20 dark:hover:to-teal-800/20"
              onClick={() => {
                const phoneNumber = '91992587483';
                const message =
                  'Olá! Gostaria de obter uma conta no sistema de inscrição.';
                window.open(
                  `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                  '_blank',
                );
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    Precisa de ajuda?
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Clique aqui para falar conosco no WhatsApp
                  </p>
                </div>
                <svg
                  className="mt-1 h-4 w-4 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-auto flex-shrink-0 border-t border-white/20 bg-white/20 px-6 py-6 backdrop-blur-sm dark:border-gray-700/20 dark:bg-gray-900/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center space-y-3">
          {/* Primeira linha: Sistema de Inscrição */}
          <p className="text-[17px] font-medium text-gray-700 dark:text-gray-300">
            Sistema de Inscrição - R2 &copy; 2025
          </p>

          {/* Segunda linha: Documentação e Contato */}
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
            <a
              className="flex items-center text-[15px] font-medium text-[#3FB5AE] transition-colors hover:text-[#2E8F8A] dark:text-[#4AB0A8] dark:hover:text-[#2A8A85]"
              target="_blank"
              rel="noopener noreferrer"
              href="/documentation"
            >
              <BookOpen className="mr-1 h-4 w-4" />
              Documentação
            </a>
            <p className="flex items-center space-x-1 text-[15px] font-medium text-gray-700 dark:text-gray-300">
              <Phone className="h-4 w-4 text-green-500" />
              <span>Contato: (91) 99258 - 7483</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
