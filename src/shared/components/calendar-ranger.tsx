"use client";

import * as React from "react";

import { Calendar } from "@shared/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { type DateRange } from "react-day-picker";

interface CalendarRangerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function CalendarRanger({
  dateRange,
  onDateRangeChange,
}: CalendarRangerProps) {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  // Estado interno apenas se as props não forem fornecidas
  const [internalDateRange, setInternalDateRange] = React.useState<
    DateRange | undefined
  >({
    from: undefined,
    to: undefined,
  });

  // Use as props se fornecidas, caso contrário use estado interno
  const currentDateRange =
    dateRange !== undefined ? dateRange : internalDateRange;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[CalendarRanger] onDateRangeChange", range);
    }
    if (onDateRangeChange) {
      // Se callback externo foi fornecido, use-o
      onDateRangeChange(range);
    } else {
      // Caso contrário, use o estado interno
      setInternalDateRange(range);
    }
  };

  const currentYear = new Date().getFullYear();
  const fromYear = currentYear;
  const toYear = currentYear + 10;

  return (
    <div className="flex flex-col gap-4 w-full align-center justify-center">
      <div className="flex justify-center align-middle w-full">
        <Calendar
          mode="range"
          defaultMonth={currentDateRange?.from}
          selected={currentDateRange}
          onSelect={handleDateRangeChange}
          disabled={{
            before: new Date(),
          }}
          showOutsideDays={false}
          captionLayout={dropdown}
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 0)}
          locale={ptBR}
          className="rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
