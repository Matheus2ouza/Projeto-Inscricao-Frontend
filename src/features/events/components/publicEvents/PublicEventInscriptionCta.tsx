'use client';

import { InscriptionMode } from '@/features/events/types/publicEvents/publicEventsTypes';
import { Button } from '@/shared/components/ui/button';
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type SubscriptionStatus = {
  status: 'loading' | 'open' | 'closed' | 'finalized';
  label: string;
  description: string;
};

type PublicEventInscriptionCtaProps = {
  eventId: string;
  allowedInscriptionModes: InscriptionMode[];
  subscriptionStatus: SubscriptionStatus;
  eventDate?: string;
  accentColor?: string;
  titleColor: string;
  bodyColor: string;
  glassSurfaceClass: string;
};

export function PublicEventInscriptionCta({
  eventId,
  allowedInscriptionModes,
  subscriptionStatus,
  eventDate,
  accentColor,
  titleColor,
  bodyColor,
  glassSurfaceClass,
}: PublicEventInscriptionCtaProps) {
  const router = useRouter();

  const handleSubscribe = (eventId: string) => {
    router.push(`/guest/${eventId}`);
  };

  const handleViewSubscription = (eventId: string) => {
    router.push(`/guest/${eventId}/inscription`);
  };

  const handleLogin = () => {
    router.push(`/login`);
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const canDirectSubscribe = allowedInscriptionModes.includes(
    InscriptionMode.GUEST,
  );
  const accent = accentColor ?? 'hsl(var(--primary))';

  useEffect(() => {
    if (!eventDate) return;

    const targetDate = new Date(eventDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  const isOpen = subscriptionStatus.status === 'open';
  const isDisabled = subscriptionStatus.status !== 'open';
  const isFinalized = subscriptionStatus.status === 'finalized';

  const statusPill = (() => {
    if (subscriptionStatus.status === 'open')
      return {
        label: 'Inscrições abertas',
        dotClass: 'bg-emerald-500',
        icon: Sparkles,
      };
    if (subscriptionStatus.status === 'closed')
      return {
        label: 'Inscrições fechadas',
        dotClass: 'bg-amber-500',
        icon: Clock,
      };
    if (subscriptionStatus.status === 'finalized')
      return {
        label: 'Evento encerrado',
        dotClass: 'bg-rose-500',
        icon: Calendar,
      };
    return { label: 'Carregando...', dotClass: 'bg-gray-400', icon: Clock };
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1 - Status e Inscrição */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md ${glassSurfaceClass}`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background: `radial-gradient(700px circle at 15% 15%, ${accent} 0%, transparent 55%), radial-gradient(900px circle at 85% 45%, ${accent} 0%, transparent 60%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

        <div className="relative">
          {/* Status Pill */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-1 backdrop-blur-sm">
              <span className={`h-2 w-2 rounded-full ${statusPill.dotClass}`} />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: bodyColor }}
              >
                {statusPill.label}
              </span>
            </div>
          </div>

          {/* Headline com contador em destaque */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="text-left">
              <h3
                className="text-2xl leading-tight font-extrabold sm:text-3xl"
                style={{ color: titleColor }}
              >
                {isOpen ? 'Garanta sua vaga agora' : subscriptionStatus.label}
              </h3>
              <p
                className="mt-1 text-sm sm:text-base"
                style={{ color: bodyColor }}
              >
                {isOpen
                  ? 'Inscreva-se agora para participar do evento'
                  : subscriptionStatus.description ||
                    'Acompanhe as atualizações'}
              </p>
            </div>

            {/* Contador regressivo em destaque - CENTRALIZADO */}
            {isOpen && eventDate && (
              <div className="mt-2 flex justify-center">
                <div
                  className="inline-flex items-center gap-6 rounded-xl border px-8 py-4 backdrop-blur-sm"
                  style={{
                    borderColor: `${accent}20`,
                    backgroundColor: `${accent}10`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold sm:text-5xl"
                        style={{ color: accent }}
                      >
                        {String(timeLeft.days).padStart(2, '0')}
                      </div>
                      <div
                        className="text-xs font-medium tracking-wider uppercase sm:text-sm"
                        style={{ color: `${accent}70` }}
                      >
                        Dias
                      </div>
                    </div>
                    <span
                      className="text-4xl font-bold sm:text-5xl"
                      style={{ color: `${accent}50` }}
                    >
                      :
                    </span>
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold sm:text-5xl"
                        style={{ color: accent }}
                      >
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <div
                        className="text-xs font-medium tracking-wider uppercase sm:text-sm"
                        style={{ color: `${accent}70` }}
                      >
                        Horas
                      </div>
                    </div>
                    <span
                      className="text-4xl font-bold sm:text-5xl"
                      style={{ color: `${accent}50` }}
                    >
                      :
                    </span>
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold sm:text-5xl"
                        style={{ color: accent }}
                      >
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div
                        className="text-xs font-medium tracking-wider uppercase sm:text-sm"
                        style={{ color: `${accent}70` }}
                      >
                        Min
                      </div>
                    </div>
                    <span
                      className="text-4xl font-bold sm:text-5xl"
                      style={{ color: `${accent}50` }}
                    >
                      :
                    </span>
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold sm:text-5xl"
                        style={{ color: accent }}
                      >
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div
                        className="text-xs font-medium tracking-wider uppercase sm:text-sm"
                        style={{ color: `${accent}70` }}
                      >
                        Seg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Card 2 - Inscrições Individuais */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md ${glassSurfaceClass}`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(600px circle at 50% 30%, ${accent} 0%, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col items-start text-left">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-3 backdrop-blur-sm">
                <Users className="h-6 w-6" style={{ color: accent }} />
              </div>

              <h4 className="text-xl font-bold" style={{ color: titleColor }}>
                Inscrição Individual
              </h4>
            </div>

            <p
              className="mt-1 text-base font-medium"
              style={{ color: bodyColor }}
            >
              Faça sua inscrição de forma rápida e simples
            </p>

            <p
              className="mt-2 text-sm leading-relaxed opacity-80"
              style={{ color: bodyColor }}
            >
              Destinado aos irmãos que irão fazer sua inscrição e pagamento de
              forma individual de sua localidade.
            </p>

            {/* Container dos botões */}
            <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="h-12 min-h-[46px] w-full flex-1 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:shadow-none sm:h-12"
                style={{
                  backgroundColor: accent,
                  color: '#FFFFFF',
                }}
                onClick={() => handleSubscribe(eventId)}
                disabled={isDisabled}
              >
                <span className="relative inline-flex items-center justify-center gap-2">
                  {isOpen ? (
                    <>
                      Inscrever-se
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  ) : isFinalized ? (
                    'Evento encerrado'
                  ) : (
                    'Acompanhar evento'
                  )}
                </span>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 min-h-[46px] w-full flex-1 px-8 text-base font-semibold backdrop-blur-sm transition-all hover:bg-white/10 active:scale-[0.99] sm:h-12"
                style={{
                  borderColor: `${accent}40`,
                  color: titleColor,
                }}
                onClick={() => handleViewSubscription(eventId)}
                disabled={subscriptionStatus.status === 'loading'}
              >
                <span className="relative inline-flex items-center justify-center gap-2">
                  Visualizar inscrição
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3 - Inscrição em Grupo */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md ${glassSurfaceClass}`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(600px circle at 50% 30%, ${accent} 0%, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col items-start text-left">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-3 backdrop-blur-sm">
                <User className="h-6 w-6" style={{ color: accent }} />
              </div>

              <h4 className="text-xl font-bold" style={{ color: titleColor }}>
                Inscrição em Grupo
              </h4>
            </div>

            <p
              className="mt-1 text-base font-medium"
              style={{ color: bodyColor }}
            >
              Inscreva um grupo de irmãos da sua localidade
            </p>

            <p
              className="mt-2 text-sm leading-relaxed opacity-80"
              style={{ color: bodyColor }}
            >
              Somente para os irmãos que estão responsáveis por inscrever um
              grupo de irmãos de uma localidade.
            </p>

            <Button
              size="lg"
              className="mt-4 h-12 w-full px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:shadow-none"
              style={{
                backgroundColor: accent,
                color: '#FFFFFF',
              }}
              onClick={() => handleLogin()}
              disabled={subscriptionStatus.status === 'loading'}
            >
              <span className="relative inline-flex items-center gap-2">
                Fazer login
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
