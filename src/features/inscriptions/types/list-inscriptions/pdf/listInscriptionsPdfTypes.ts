export type PdfFileResponse = {
  pdfBase64: string;
  filename: string;
};

export type ListInscriptionsPdfResponse = PdfFileResponse;

export type ProcessPdfDownloadOptions = {
  successMessage?: string;
  defaultFilename?: string;
};

export type DownloadListInscriptionsPdfInput = {
  eventId: string;
  isGuest?: boolean;
  details: boolean;
  participants: boolean;
};
