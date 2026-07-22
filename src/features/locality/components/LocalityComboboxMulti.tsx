'use client';

import { useListLocalities } from '@/features/locality/hooks/listLocalities/useListLocalities';
import { cn } from '@/lib/utils';
import { FormField, FormItem, FormMessage } from '@/shared/components/ui/form';
import type { AutoCompleteProps } from 'antd';
import { AutoComplete } from 'antd';
import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type Locality = {
  id: string;
  fullName: string;
};

interface LocalityComboboxMultiProps {
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export function LocalityComboboxMulti({
  form,
  name,
  placeholder = 'Selecione localidades...',
  disabled = false,
}: LocalityComboboxMultiProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { localities, loading } = useListLocalities();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredLocalities = localities.filter((locality: Locality) =>
    locality.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues = (field.value as string[]) || [];

        const selectedLocalities = localities.filter((loc: Locality) =>
          selectedValues.includes(loc.id),
        );

        const handleSelect = (value: string) => {
          const locality = localities.find((l) => l.fullName === value);
          if (!locality) return;

          const currentValues = (field.value as string[]) || [];
          const newValues = currentValues.includes(locality.id)
            ? currentValues.filter((id) => id !== locality.id)
            : [...currentValues, locality.id];
          field.onChange(newValues);
          setSearchQuery('');
        };

        const handleRemove = (localityId: string) => {
          const currentValues = (field.value as string[]) || [];
          field.onChange(currentValues.filter((id) => id !== localityId));
        };

        // Converte para o formato do AutoComplete com indicador visual
        const options: AutoCompleteProps['options'] = filteredLocalities.map(
          (locality) => {
            const isSelected = selectedValues.includes(locality.id);
            return {
              value: locality.fullName,
              label: (
                <div className="flex items-center justify-between">
                  <span>{locality.fullName}</span>
                  {isSelected && (
                    <span className="text-primary text-xs font-medium">
                      ✓ Selecionado
                    </span>
                  )}
                </div>
              ),
              id: locality.id,
              // Propriedade para estilizar o item selecionado
              className: isSelected ? 'bg-primary/10' : '',
            };
          },
        );

        return (
          <FormItem>
            <div ref={containerRef} className="relative">
              <AutoComplete
                style={{ width: '100%' }}
                options={options}
                placeholder={loading ? 'Carregando...' : placeholder}
                value={searchQuery}
                onSearch={setSearchQuery}
                onSelect={handleSelect}
                onChange={setSearchQuery}
                disabled={loading || disabled}
                allowClear
                getPopupContainer={() => containerRef.current ?? document.body}
                popupMatchSelectWidth
                listHeight={200}
                className={cn(
                  'bg-input/50! h-8! w-full! min-w-0! rounded-2xl! border! border-transparent! px-2.5! py-1! text-base! transition-[color,box-shadow]! duration-200! outline-none!',
                  'file:text-foreground! file:inline-flex! file:h-6! file:border-0! file:bg-transparent! file:text-sm! file:font-medium!',
                  'placeholder:text-muted-foreground!',
                  'focus-visible:border-ring! focus-visible:ring-ring/30! focus-visible:ring-3!',
                  'disabled:pointer-events-none! disabled:cursor-not-allowed! disabled:opacity-50!',
                  'aria-invalid:border-destructive! aria-invalid:ring-destructive/20! aria-invalid:ring-3!',
                  'md:text-sm!',
                  'dark:aria-invalid:border-destructive/50! dark:aria-invalid:ring-destructive/40!',
                )}
              />
            </div>

            {/* Lista de localidades selecionadas abaixo do campo */}
            {selectedLocalities.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-muted-foreground text-xs font-medium">
                  Localidades selecionadas ({selectedLocalities.length}):
                </p>
                <div className="border-border/50 flex max-h-[120px] flex-wrap gap-1.5 overflow-y-auto rounded-md border p-2">
                  {selectedLocalities.map((locality: Locality) => (
                    <span
                      key={locality.id}
                      className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                    >
                      {locality.fullName}
                      <button
                        type="button"
                        className="hover:text-destructive ml-1 text-gray-400"
                        onClick={() => handleRemove(locality.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
