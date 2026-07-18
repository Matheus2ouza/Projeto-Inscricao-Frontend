'use client';

import { cn } from '@/lib/utils';
import {
  Button,
  Calendar,
  Field,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui';
import { format, isValid, parseISO } from 'date-fns';
import { Locale, ptBR } from 'date-fns/locale';
import { Clock2Icon } from 'lucide-react';
import * as React from 'react';

interface DatePickerProps {
  value?: Date | string;
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

  // Controle de horário
  withTime?: boolean; // habilita seleção de horário (mantém compatibilidade)
  timeStep?: number;
  timeMode?: 'single' | 'range'; // NOVO: define 1 ou 2 campos de horário
  timeLabel?: string; // label do campo único (timeMode='single')
  startTimeLabel?: string; // label do campo inicial (timeMode='range')
  endTimeLabel?: string; // label do campo final (timeMode='range')
  endTime?: string; // valor controlado do horário final, formato 'HH:mm:ss'
  onEndTimeChange?: (time: string) => void;
}

function toLocalDate(value?: Date | string): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
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
  withTime = false,
  timeStep = 60,
  timeMode = 'single',
  timeLabel = 'Horário',
  startTimeLabel = 'Início',
  endTimeLabel = 'Fim',
  endTime,
  onEndTimeChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    toLocalDate(value),
  );
  const [internalEndTime, setInternalEndTime] = React.useState<string>(
    endTime ?? '00:00:00',
  );

  React.useEffect(() => {
    setSelectedDate(toLocalDate(value));
  }, [value]);

  React.useEffect(() => {
    if (endTime !== undefined) setInternalEndTime(endTime);
  }, [endTime]);

  const handleSelect = (date: Date | undefined) => {
    if (date && selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      newDate.setSeconds(selectedDate.getSeconds());
      setSelectedDate(newDate);
      onChange?.(newDate);
    } else {
      setSelectedDate(date);
      onChange?.(date);
    }
    setOpen(false);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value;
    if (!selectedDate) return;
    const [hours, minutes, seconds] = timeValue.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours || 0);
    newDate.setMinutes(minutes || 0);
    newDate.setSeconds(seconds || 0);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value;
    setInternalEndTime(timeValue);
    onEndTimeChange?.(timeValue);
  };

  const formatDisplayDate = (date: Date): string => {
    if (formatDate) return formatDate(date);
    if (withTime) return format(date, 'dd/MM/yyyy HH:mm', { locale });
    return format(date, 'dd/MM/yyyy', { locale });
  };

  const getTimeValue = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
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
          <div className="p-3">
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
              className="p-0"
            />
          </div>

          {/* Seletor de Horário */}
          {withTime && selectedDate && (
            <div className="border-t border-gray-200 p-3 dark:border-gray-700">
              {timeMode === 'single' ? (
                <Field>
                  <FieldLabel htmlFor="date-picker-time">
                    {timeLabel}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="date-picker-time"
                      type="time"
                      step={timeStep}
                      value={getTimeValue(selectedDate)}
                      onChange={handleTimeChange}
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      aria-label="Selecionar horário"
                    />
                    <InputGroupAddon>
                      <Clock2Icon className="text-muted-foreground h-4 w-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              ) : (
                <FieldGroup className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="date-picker-time-start">
                      {startTimeLabel}
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="date-picker-time-start"
                        type="time"
                        step={timeStep}
                        value={getTimeValue(selectedDate)}
                        onChange={handleTimeChange}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        aria-label="Selecionar horário de início"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground h-4 w-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="date-picker-time-end">
                      {endTimeLabel}
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="date-picker-time-end"
                        type="time"
                        step={timeStep}
                        value={internalEndTime}
                        onChange={handleEndTimeChange}
                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        aria-label="Selecionar horário de fim"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground h-4 w-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </FieldGroup>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </Field>
  );
}
