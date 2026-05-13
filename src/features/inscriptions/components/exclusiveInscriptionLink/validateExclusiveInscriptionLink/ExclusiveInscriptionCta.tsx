'use client';

import { InscriptionMode } from '@/features/events/types/publicEvents/publicEventsTypes';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export type SubscriptionStatus = {
  status: 'loading' | 'open' | 'closed' | 'finalized';
  label: string;
  description: string;
};

type PublicEventInscriptionCtaProps = {
  token: string;
  eventId: string;
  allowedInscriptionModes: InscriptionMode[];
  subscriptionStatus: SubscriptionStatus;
  accentColor?: string;
  titleColor: string;
  bodyColor: string;
  glassSurfaceClass: string;
  onSubscribe: (eventId: string) => void;
  onViewSubscription: (eventId: string) => void;
};

export function ExclusiveInscriptionCta({
  token,
  eventId,
  allowedInscriptionModes,
  subscriptionStatus,
  accentColor,
  titleColor,
  bodyColor,
  glassSurfaceClass,
  onSubscribe,
  onViewSubscription,
}: PublicEventInscriptionCtaProps) {
  const accent = accentColor ?? 'hsl(var(--primary))';

  const handleMainAction = () => {
    onSubscribe(token);
    return;
  };

  const isOpen = subscriptionStatus.status === 'open';
  const isDisabled = subscriptionStatus.status !== 'open';

  const headline = isOpen ? 'Garanta sua vaga agora' : subscriptionStatus.label;
  const supporting =
    subscriptionStatus.description ||
    (isOpen ? 'Clique no botão abaixo e avance para a inscrição.' : '');

  const statusPill = (() => {
    if (subscriptionStatus.status === 'open')
      return { label: 'Inscrições abertas', dotClass: 'bg-emerald-500' };
    if (subscriptionStatus.status === 'closed')
      return { label: 'Inscrições fechadas', dotClass: 'bg-amber-500' };
    if (subscriptionStatus.status === 'finalized')
      return { label: 'Evento encerrado', dotClass: 'bg-rose-500' };
    return { label: 'Carregando...', dotClass: 'bg-gray-400' };
  })();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md sm:p-8 ${glassSurfaceClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          background: `radial-gradient(700px circle at 15% 15%, ${accent} 0%, transparent 55%), radial-gradient(900px circle at 85% 45%, ${accent} 0%, transparent 60%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
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
          <h3
            className="mt-4 text-2xl leading-tight font-extrabold sm:text-3xl"
            style={{ color: titleColor }}
          >
            {headline}
          </h3>
          <p className="mt-2 text-sm sm:text-base" style={{ color: bodyColor }}>
            {supporting}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="group relative h-12 px-8 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:shadow-none"
            style={{
              backgroundColor: accent,
            }}
            onClick={handleMainAction}
            disabled={isDisabled}
          >
            <span className="relative inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Garantir minha vaga
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 px-6 text-base font-semibold"
            onClick={() => onViewSubscription(eventId)}
            disabled={subscriptionStatus.status === 'loading'}
          >
            Visualizar minha inscrição
          </Button>
        </div>
      </div>
    </div>
  );
}
