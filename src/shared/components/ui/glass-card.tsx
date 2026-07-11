'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowEffect?: boolean;
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glowEffect = true, children, ...props }, ref) => {
    return (
      <div className="relative">
        {glowEffect && (
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 opacity-70 blur-xl" />
        )}
        <div
          ref={ref}
          className={cn(
            'relative rounded-2xl border border-[color:var(--glass-border)]',
            'bg-[var(--glass-surface)] backdrop-blur-xl',
            'shadow-[var(--glass-shadow)]',
            'before:absolute before:inset-0 before:rounded-2xl',
            'before:pointer-events-none before:bg-linear-to-b before:from-white/18 before:to-transparent',
            'after:absolute after:inset-px after:rounded-[calc(1rem-1px)]',
            'after:pointer-events-none after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]',
            className,
          )}
          {...props}
        >
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    );
  },
);
GlassCard.displayName = 'GlassCard';

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 p-6', className)}
    {...props}
  />
));
GlassCardHeader.displayName = 'GlassCardHeader';

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-foreground text-xl leading-none font-semibold tracking-tight',
      className,
    )}
    {...props}
  />
));
GlassCardTitle.displayName = 'GlassCardTitle';

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
GlassCardDescription.displayName = 'GlassCardDescription';

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
GlassCardContent.displayName = 'GlassCardContent';

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
GlassCardFooter.displayName = 'GlassCardFooter';

export {
  GlassCard,
  GlassCardContent,
  GlassCardDescription,
  GlassCardFooter,
  GlassCardHeader,
  GlassCardTitle,
};
