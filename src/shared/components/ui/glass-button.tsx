'use client';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const glassButtonVariants = cva(
  cn(
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl cursor-pointer',
    'text-sm font-medium transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    'disabled:pointer-events-none disabled:opacity-50',
    'hover:scale-105 active:scale-95',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-[var(--glass-surface)] backdrop-blur-xl border border-[color:var(--glass-border)] text-[var(--foreground)] dark:text-white',
          'shadow-[var(--glass-shadow)]',
          'hover:bg-[var(--glass-surface-strong)] hover:border-[color:var(--glass-border-strong)]',
          'before:absolute before:inset-0 before:rounded-xl',
          'before:bg-linear-to-b before:from-white/16 before:to-transparent before:pointer-events-none',
        ),
        primary: cn(
          'bg-linear-to-r from-cyan-500/80 via-blue-500/80 to-purple-500/80',
          'backdrop-blur-xl border border-white/30 text-white',
          'shadow-[0_4px_20px_rgba(59,130,246,0.4)]',
          'hover:shadow-[0_4px_30px_rgba(59,130,246,0.6)]',
          'before:absolute before:inset-0 before:rounded-xl',
          'before:bg-linear-to-b before:from-white/30 before:to-transparent before:pointer-events-none',
        ),
        outline: cn(
          'bg-transparent backdrop-blur-sm border-2 border-[color:var(--glass-border)] text-[var(--foreground)] dark:text-white',
          'hover:bg-[var(--glass-surface)] hover:border-[color:var(--glass-border-strong)]',
        ),
        ghost: cn(
          'bg-transparent text-[var(--foreground)]/72 dark:text-white/70',
          'hover:bg-[var(--glass-surface)] hover:text-[var(--foreground)] dark:hover:text-white',
        ),
        destructive: cn(
          'bg-red-500/30 backdrop-blur-xl border border-red-400/40 text-red-100',
          'shadow-[0_4px_16px_rgba(239,68,68,0.3)]',
          'hover:bg-red-500/40 hover:border-red-400/60',
          'before:absolute before:inset-0 before:rounded-xl',
          'before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none',
        ),
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface GlassButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  glowEffect?: boolean;
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant,
      asChild = false,
      size,
      glowEffect = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <div className="relative inline-block">
        {glowEffect && (
          <div className="absolute -inset-1 rounded-xl bg-linear-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 opacity-70 blur-lg transition-opacity group-hover:opacity-100" />
        )}
        <Comp
          className={cn(glassButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        </Comp>
      </div>
    );
  },
);
GlassButton.displayName = 'GlassButton';

export { GlassButton, glassButtonVariants };
