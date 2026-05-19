'use client';

import {
  getIbgeCitiesByState,
  getIbgeStates,
  type IbgeCity,
  type IbgeState,
} from '@/features/inscriptions/api/inscriptionAdmin/ibgeLocalities';
import { useEffect, useState } from 'react';

export function useIbgeLocalities() {
  const [states, setStates] = useState<IbgeState[]>([]);
  const [cities, setCities] = useState<IbgeCity[]>([]);
  const [selectedState, setSelectedState] = useState<IbgeState | null>(null);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadStates() {
      try {
        setStatesLoading(true);
        setError(null);
        const data = await getIbgeStates();

        if (active) {
          setStates(data);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Falha ao carregar estados do IBGE',
          );
        }
      } finally {
        if (active) {
          setStatesLoading(false);
        }
      }
    }

    loadStates();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        setCitiesLoading(true);
        setError(null);
        const data = await getIbgeCitiesByState(selectedState.sigla);

        if (active) {
          setCities(data);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Falha ao carregar cidades do IBGE',
          );
        }
      } finally {
        if (active) {
          setCitiesLoading(false);
        }
      }
    }

    loadCities();

    return () => {
      active = false;
    };
  }, [selectedState]);

  return {
    states,
    cities,
    selectedState,
    setSelectedState,
    statesLoading,
    citiesLoading,
    error,
  };
}
