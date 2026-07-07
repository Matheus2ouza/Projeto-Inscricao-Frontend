'use client';

import { TooltipProvider as ShadcnTooltipProvider } from '@/shared/components/ui/tooltip';

type Props = {
  children: React.ReactNode;
};

export function TooltipProvider({ children }: Props) {
  return <ShadcnTooltipProvider>{children}</ShadcnTooltipProvider>;
}
