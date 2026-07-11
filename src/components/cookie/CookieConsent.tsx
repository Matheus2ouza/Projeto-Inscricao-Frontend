import { Button } from '@/shared/components/ui/button';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { Check, Cookie } from 'lucide-react';
import React from 'react';

export default function CookieConsent({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('cookieAccepted');
      if (!accepted) setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setVisible(false);
    onAccept();
  };

  if (!visible) return null;

  return (
    <div className="fixed right-0 bottom-4 left-0 z-50 flex justify-center px-4">
      <div className="liquid-panel-solid w-full max-w-4xl rounded-2xl px-6 py-5 sm:flex-row">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3FB5AE]/10">
                <Cookie className="h-5 w-5 text-[#3FB5AE]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                Cookies Necessários
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Este site utiliza cookies essenciais para garantir seu
                funcionamento e segurança. Ao continuar, você concorda com o uso
                de cookies. Fique tranquilo — seus dados são protegidos e
                armazenados com segurança.
              </p>
            </div>
          </div>
          <Button
            className={`flex-shrink-0 cursor-pointer rounded-xl bg-gradient-to-r px-6 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:brightness-95 active:scale-95 ${generateGradientClass()}`}
            onClick={handleAccept}
          >
            <Check className="mr-2 h-4 w-4" />
            Aceitar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
