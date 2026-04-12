'use client';

import { Button } from '@/shared/components/ui/button';
import {
  CONTAINER_WIDTHS,
  PAGE_CONTAINER_CLASSES,
} from '@/shared/constants/layout';
import { cn } from '@/shared/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type ContainerWidth = keyof typeof CONTAINER_WIDTHS;

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showTitle?: boolean;
  backButtonAction?: () => void;
  titleSize?: string;
  titleClassName?: string; // Nova prop para cor/título personalizado
  descriptionClassName?: string; // Nova prop para cor/descrição personalizada
  titleColor?: string;
  descriptionColor?: string;
  className?: string;
  containerClassName?: string;
  maxWidth?: ContainerWidth;
  actions?: ReactNode;
}

/**
 * Componente wrapper para páginas com layout consistente
 *
 * @example
 * <PageContainer
 *   title="Minhas Inscrições"
 *   description="Visualize todas as suas inscrições nos eventos"
 *   showTitle={true}
 *   titleClassName="text-primary"
 *   descriptionClassName="text-muted-foreground"
 * >
 *   <MyContent />
 * </PageContainer>
 */
export default function PageContainer({
  children,
  title,
  description,
  showBackButton = true,
  showTitle = true,
  backButtonAction,
  className,
  containerClassName,
  maxWidth = '2xl',
  actions,
  titleSize,
  titleClassName,
  descriptionClassName,
  titleColor,
  descriptionColor,
}: PageContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      router.back();
    }
  };

  const maxWidthClass = CONTAINER_WIDTHS[maxWidth];

  return (
    <div className={cn(className)}>
      <div
        className={cn(
          maxWidthClass,
          'mx-auto space-y-8 px-4 py-5 sm:px-6 lg:px-8',
          containerClassName,
        )}
      >
        {(title || showBackButton || actions) && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className={PAGE_CONTAINER_CLASSES.header}>
              {showBackButton && (
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {title && showTitle && (
                <div>
                  <h1
                    className={cn(
                      PAGE_CONTAINER_CLASSES.title,
                      titleSize,
                      titleClassName,
                    )}
                    style={titleColor ? { color: titleColor } : undefined}
                  >
                    {title}
                  </h1>
                  {description && (
                    <p
                      className={cn(
                        PAGE_CONTAINER_CLASSES.description,
                        descriptionClassName,
                      )}
                      style={
                        descriptionColor
                          ? { color: descriptionColor }
                          : undefined
                      }
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
