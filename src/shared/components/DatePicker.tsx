'use client';

import { cn } from '@/lib/utils';
import {
  Button,
  Calendar,
  Field,
  FieldLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import { format, isValid, parseISO } from 'date-fns';
import { Locale, ptBR } from 'date-fns/locale';
import * as React from 'react';

interface DatePickerProps {
  value?: Date | string; // aceita string 'yyyy-MM-dd' também
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  formatDate?: (date: Date) => string;
  locale?: Locale;
  monthFormat?: 'short' | 'long';
  showOutsideDays?: boolean;
}

// Converte string ou Date para Date local, sem shift de fuso
function toLocalDate(value?: Date | string): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;

  // string 'yyyy-MM-dd' -> parseISO trata como data local
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Selecione uma data',
  className = '',
  buttonClassName = '',
  disabled = false,
  required = false,
  minDate,
  maxDate,
  fromDate,
  toDate,
  captionLayout = 'dropdown',
  formatDate,
  locale = ptBR,
  monthFormat = 'short',
  showOutsideDays = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    toLocalDate(value),
  );

  // Sincroniza com o value externo
  React.useEffect(() => {
    setSelectedDate(toLocalDate(value));
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setOpen(false);
    onChange?.(date);
  };

  const formatDisplayDate = (date: Date): string => {
    if (formatDate) {
      return formatDate(date);
    }
    return format(date, 'dd/MMMM/yyyy', { locale });
  };

  return (
    <Field className={cn('w-full', className)}>
      {label && (
        <FieldLabel className="text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start font-normal',
              !selectedDate && 'text-muted-foreground',
              buttonClassName,
            )}
            disabled={disabled}
          >
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate || fromDate}
            captionLayout={captionLayout}
            onSelect={handleSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              if (fromDate && date < fromDate) return true;
              if (toDate && date > toDate) return true;
              return false;
            }}
            showOutsideDays={showOutsideDays}
            locale={locale}
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString(locale?.code, { month: monthFormat }),
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
