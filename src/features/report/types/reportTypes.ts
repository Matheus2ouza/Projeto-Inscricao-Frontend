export type GenaratePdfReportInput = {
  eventId: string;
};

export type GenaratePdfReportOutput = {
  pdfBase64: string;
  filename: string;
};

export type ReportGeneralInput = {
  eventId: string;
};

export type ReportGeneralResponse = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  image: string;
  totalInscriptions: number;
  countTypeInscription: number;
  countParticipants: number;
  totalValue: number;
  totalDebt: number;
  typeInscription: TypeInscription;
};

export type TypeInscription = {
  id: string;
  description: string;
  amount: number;
  countParticipants: number;
  totalValue: number;
}[];

export type UseReportGeneralResult = {
  data: ReportGeneralResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isFetching: boolean;
};
