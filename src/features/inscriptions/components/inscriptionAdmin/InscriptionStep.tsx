'use client';

import { ComboboxAccountSingle } from '@/features/accounts/components/ComboboxAccount';
import { ComboboxEvent } from '@/features/events/components/combobox/ComboBoxEvent';
import type {
  IbgeCity,
  IbgeState,
} from '@/features/inscriptions/api/inscriptionAdmin/ibgeLocalities';
import { useIbgeLocalities } from '@/features/inscriptions/hooks/inscriptionAdmin/useIbgeLocalities';
import {
  inscriptionStatusEnum,
  type CreateInscriptionAdminForm,
} from '@/features/inscriptions/schema/inscriptionAdmin/createInscriptionAdminSchema';
import { Input } from '@/shared/components/ui/input';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import type { AutoCompleteProps, SelectProps } from 'antd';
import { AutoComplete, Form, Radio, Spin } from 'antd';
import { useMemo, useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

const statusOptions: SelectProps['options'] = inscriptionStatusEnum.options.map(
  (value) => ({
    label: getConvertStatusInscription(value),
    value,
  }),
);

type InscriptionStepProps = {
  form: UseFormReturn<CreateInscriptionAdminForm>;
  isGuest: boolean;
};

export function InscriptionStep({ form, isGuest }: InscriptionStepProps) {
  const { control, setValue } = form;
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const {
    states,
    cities,
    selectedState,
    setSelectedState,
    statesLoading,
    citiesLoading,
    error: localityError,
  } = useIbgeLocalities();

  const stateOptions = useMemo<AutoCompleteProps['options']>(() => {
    return states.map((state) => ({
      value: state.nome,
      label: `${state.nome} (${state.sigla})`,
      state,
    }));
  }, [states]);

  const cityOptions = useMemo<AutoCompleteProps['options']>(() => {
    return cities.map((city) => ({
      value: city.nome,
      label: city.nome,
      city,
    }));
  }, [cities]);

  const handleStateSelect = (_value: string, option: unknown) => {
    const state = (option as { state?: IbgeState }).state;
    if (!state) return;

    setSelectedState(state);
    setStateSearch(state.nome);
    setCitySearch('');
    setValue('locality', '');
  };

  const handleStateChange = (value: string) => {
    setStateSearch(value);

    if (selectedState && value !== selectedState.nome) {
      setSelectedState(null);
      setCitySearch('');
      setValue('locality', '');
    }
  };

  const handleCitySelect = (_value: string, option: unknown) => {
    const city = (option as { city?: IbgeCity }).city;
    if (!city || !selectedState) return;

    setCitySearch(city.nome);
    setValue('locality', `${city.nome} - ${selectedState.nome}`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCityChange = (value: string) => {
    setCitySearch(value);

    if (!value) {
      setValue('locality', '');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="eventId"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Evento"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
              required
            >
              <ComboboxEvent
                value={field.value}
                onChange={field.onChange}
                statuses={[]}
              />
            </Form.Item>
          )}
        />
      </div>

      <Controller
        control={control}
        name="isGuest"
        render={({ field }) => (
          <Form.Item label="Tipo de inscrição">
            <Radio.Group
              {...field}
              onChange={(event) => field.onChange(event.target.value)}
              value={field.value}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio value={false}>Normal (com conta)</Radio>
              <Radio value={true}>Sem Conta vinculada</Radio>
            </Radio.Group>
          </Form.Item>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          control={control}
          name="responsible"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Responsável"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
              required
            >
              <Input
                {...field}
                placeholder="Nome do responsável"
                className="w-full"
              />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Email"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input
                {...field}
                type="email"
                placeholder="email@exemplo.com"
                className="w-full"
              />
            </Form.Item>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Telefone"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input
                {...field}
                placeholder="(00) 00000-0000"
                className="w-full"
              />
            </Form.Item>
          )}
        />
      </div>

      {isGuest ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="locality"
            render={({ fieldState }) => (
              <Form.Item
                label="Estado"
                validateStatus={fieldState.error ? 'error' : ''}
                help={localityError || undefined}
              >
                <AutoComplete
                  value={stateSearch}
                  options={stateOptions}
                  onSelect={handleStateSelect}
                  onChange={handleStateChange}
                  placeholder={
                    statesLoading
                      ? 'Carregando estados...'
                      : 'Selecione o estado'
                  }
                  disabled={statesLoading}
                  allowClear
                  filterOption={(inputValue, option) =>
                    String(option?.value ?? '')
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  notFoundContent={
                    statesLoading ? <Spin size="small" /> : 'Nenhum estado'
                  }
                  className="w-full"
                />
              </Form.Item>
            )}
          />

          <Controller
            control={control}
            name="locality"
            render={({ fieldState }) => (
              <Form.Item
                label="Cidade"
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <AutoComplete
                  value={citySearch}
                  options={cityOptions}
                  onSelect={handleCitySelect}
                  onChange={handleCityChange}
                  placeholder={
                    selectedState
                      ? citiesLoading
                        ? 'Carregando cidades...'
                        : 'Selecione a cidade'
                      : 'Selecione o estado primeiro'
                  }
                  disabled={!selectedState || citiesLoading}
                  allowClear
                  filterOption={(inputValue, option) =>
                    String(option?.value ?? '')
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  notFoundContent={
                    citiesLoading ? <Spin size="small" /> : 'Nenhuma cidade'
                  }
                  className="w-full"
                />
              </Form.Item>
            )}
          />
        </div>
      ) : (
        <Controller
          control={control}
          name="accountId"
          render={({ field, fieldState }) => (
            <Form.Item
              label="Conta"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <ComboboxAccountSingle
                value={field.value}
                onChange={field.onChange}
                placeholder="Selecione uma conta..."
                showRole
              />
            </Form.Item>
          )}
        />
      )}
    </div>
  );
}
