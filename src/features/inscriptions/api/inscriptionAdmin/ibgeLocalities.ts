const IBGE_LOCALITIES_BASE_URL =
  'https://servicodados.ibge.gov.br/api/v1/localidades';

export type IbgeState = {
  id: number;
  nome: string;
  sigla: string;
};

export type IbgeCity = {
  id: number;
  nome: string;
};

export async function getIbgeStates(): Promise<IbgeState[]> {
  const response = await fetch(
    `${IBGE_LOCALITIES_BASE_URL}/estados?orderBy=nome`,
  );

  if (!response.ok) {
    throw new Error('Falha ao carregar estados do IBGE');
  }

  return response.json();
}

export async function getIbgeCitiesByState(
  stateAbbreviation: string,
): Promise<IbgeCity[]> {
  const response = await fetch(
    `${IBGE_LOCALITIES_BASE_URL}/estados/${stateAbbreviation}/municipios?orderBy=nome`,
  );

  if (!response.ok) {
    throw new Error('Falha ao carregar cidades do IBGE');
  }

  return response.json();
}
