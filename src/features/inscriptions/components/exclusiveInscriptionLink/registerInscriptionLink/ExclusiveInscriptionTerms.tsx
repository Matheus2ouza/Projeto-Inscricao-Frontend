'use client';

import {
  Event,
  TypeInscriptionAllowed,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveInscriptionLinkTypes';
import { Button } from '@/shared/components/ui/button';
import { Modal } from 'antd';
import { useState } from 'react';

interface ExclusiveInscriptionTermsProps {
  event: Event | null;
  typeInscription: TypeInscriptionAllowed;
  hostingVacanciesLeft: number;
  primaryColor?: string;
}

function getTransparentHex(hex: string, opacity: number) {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
    return hex;
  }

  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

  return `${normalized}${alpha}`;
}

export function ExclusiveInscriptionTerms({
  event,
  typeInscription,
  hostingVacanciesLeft,
  primaryColor,
}: ExclusiveInscriptionTermsProps) {
  const [open, setOpen] = useState(false);
  const accentColor = primaryColor ?? '#f97316';
  const accentBackground = getTransparentHex(accentColor, 0.15);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        style={{
          color: accentColor,
          borderColor: accentColor,
          backgroundColor: accentBackground,
        }}
        className="inline-flex shadow-sm transition-all hover:brightness-95"
      >
        Ver termos da inscrição
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="close" onClick={() => setOpen(false)}>
            Fechar
          </Button>,
        ]}
        title="Termo de condição"
        centered
      >
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Leia atentamente o termo e confirme que você leu os termos antes de
            continuar.
          </p>

          <div
            className="rounded-2xl border p-4 text-sm"
            style={{
              borderColor: accentColor,
              backgroundColor: accentBackground,
              color: accentColor,
            }}
          >
            <p className="font-semibold">Inscrição exclusiva</p>

            <p className="mt-4 leading-6 text-slate-700 dark:text-slate-200">
              Esta inscrição garante participação no{' '}
              <strong>{event?.name.toUpperCase()}</strong> que acontecerá entre
              os dias 29 e 31 de maio, incluindo alimentação completa de
              sexta-feira até domingo.
              <br />
              <br />
              As vagas com hospedagem no{' '}
              <strong>local de reunião de Castanhal</strong> são limitadas a 30
              <strong> participantes</strong>. Após o preenchimento dessas
              vagas, novas inscrições ainda poderão ser realizadas normalmente,
              porém sem direito à hospedagem.
            </p>

            {hostingVacanciesLeft > 0 ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Ainda temos {hostingVacanciesLeft} vagas disponíveis com
                  hospedagem.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  As vagas de hospedagem foram preenchidas. Novas inscrições
                  ainda são permitidas, mas sem hospedagem.
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
