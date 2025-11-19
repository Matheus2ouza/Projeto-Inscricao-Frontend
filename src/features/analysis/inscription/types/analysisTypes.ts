export type InscriptionAnalysisRequest = {
  page: number;
  pageSize: number;
};

export type InscriptionData = {
  id: string;
  responsible: string;
  phone: string;
  totalValue: number;
  status: string;
};

export type AccountData = {
  id: string;
  username: string;
  inscriptions: InscriptionData[];
};

export type InscriptionAnalysisResponse = {
  account: AccountData[];
};

export type UseAnalysisParams = {
  eventId: string;
  initialPage?: number;
  pageSize?: number;
};

export type UseAnalysisResult = {
  analysisData: InscriptionAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

// Tipos para detalhes da inscrição
export type InscriptionDetailRequest = {
  page: number;
  pageSize: number;
};

export type AnalysisInscriptionResponse = {
  id: string;
  responsible: string;
  email?: string;
  phone: string;
  status: string;
  participants: Participants;
  total: number;
  page: number;
  pageCount: number;
};

export type Participants = {
  id: string;
  name: string;
  birthDate: Date;
  typeInscription?: string;
  gender: string;
}[];

// Manter compatibilidade com nome antigo
export type InscriptionDetailResponse = AnalysisInscriptionResponse;

export type UseInscriptionDetailParams = {
  inscriptionId: string;
  initialPage?: number;
  pageSize?: number;
  enabled?: boolean;
};

export type UseInscriptionDetailResult = {
  inscriptionData: InscriptionDetailResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};
