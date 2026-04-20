'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import Logo from '@/shared/components/ui/logo';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import CookieConsent from '../../../components/cookie/CookieConsent';
import useFormLogin from './hooks/useFormLogin';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const { form, onSubmit } = useFormLogin();

  // Verificar se os cookies já foram aceitos ao carregar a página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('cookieAccepted');
      if (accepted === 'true') {
        setCookieAccepted(true);
      }
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para redirecionar para o WhatsApp
  const redirectToWhatsApp = () => {
    const phoneNumber = '91992587483';
    const message = 'Olá! Gostaria de obter uma conta no sistema de inscrição.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <CookieConsent onAccept={() => setCookieAccepted(true)} />
      {/* Pop-up de sessão expirada */}
      <div className="flex min-h-screen flex-col">
        {/* Main content */}
        <div className="mb-16 flex flex-1 flex-col items-center justify-center p-0">
          <Logo className="mx-auto mb-3 h-48 w-48 object-contain" />{' '}
          <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-gray-700/30 dark:bg-gray-900/90">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Bem-vindo
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Faça login para acessar o sistema
              </p>
            </div>

            {/* Formulário */}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Campo Usuário */}
                <div className="space-y-2">
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
                            placeholder="Digite sua localidade"
                            className="focus:ring-opacity-50 w-full rounded-xl border-gray-300 bg-white/50 py-3 pr-4 pl-4 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campo Senha */}
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
                              placeholder="Digite sua senha"
                              autoComplete="off"
                              className="focus:ring-opacity-50 w-full rounded-xl border-gray-300 bg-white/50 py-3 pr-12 pl-4 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
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

                {/* Botão de Login */}
                <div className="pt-4">
                  {!cookieAccepted && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                      <p className="text-center text-sm text-amber-800 dark:text-amber-200">
                        <i className="bi bi-exclamation-triangle mr-2"></i>É
                        necessário aceitar os cookies para continuar
                      </p>
                    </div>
                  )}
                  <Button
                    className="w-full transform rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600"
                    type="submit"
                    disabled={!cookieAccepted}
                  >
                    <i className="bi bi-box-arrow-in-right mr-2 text-base"></i>
                    {cookieAccepted
                      ? 'Entrar no Sistema'
                      : 'Aceite os cookies para continuar'}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Alert de Ajuda */}
            <div className="mt-8">
              <Alert
                className="cursor-pointer !grid-cols-1 rounded-xl border-blue-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm transition-all duration-200 hover:from-blue-100/80 hover:to-indigo-100/80 dark:border-blue-700/30 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-800/20 dark:hover:to-indigo-800/20"
                onClick={redirectToWhatsApp}
              >
                <div className="flex w-full items-start">
                  <div className="min-w-0 flex-1">
                    <AlertTitle className="!col-start-1 flex items-center font-semibold text-blue-800 dark:text-blue-200">
                      <i className="bi bi-whatsapp mr-2 text-green-500"></i>
                      Ainda não tem uma conta?
                    </AlertTitle>
                    <AlertDescription className="!col-start-1 mt-1 text-blue-700 dark:text-blue-300">
                      Clique aqui para entrar em contato com o suporte via
                      WhatsApp e obter assistência.
                    </AlertDescription>
                  </div>
                  <i className="bi bi-arrow-up-right mt-1 ml-2 text-blue-500"></i>
                </div>
              </Alert>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto flex-shrink-0 border-t border-white/20 bg-white/80 px-6 py-6 backdrop-blur-md dark:border-gray-700/20 dark:bg-gray-900/80">
          {' '}
          {/* Adicionei mt-auto */}
          <div className="mx-auto flex max-w-7xl flex-col items-center space-y-3">
            {/* Primeira linha: Sistema de Inscrição */}
            <p className="text-[17px] font-medium text-gray-700 dark:text-gray-300">
              Sistema de Inscrição - R2 &copy; 2025
            </p>

            {/* Segunda linha: Documentação e Contato */}
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
              <a
                className="flex items-center text-[15px] font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                target="_blank"
                rel="noopener noreferrer"
                href="/documentation"
              >
                <i className="bi bi-book mt-0.5 mr-1"></i>
                Documentação
              </a>
              <p className="flex items-center space-x-1 text-[15px] font-medium text-gray-700 dark:text-gray-300">
                <i className="bi bi-whatsapp text-green-500"></i>
                <span>Contato: (91) 99258 - 7483</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
