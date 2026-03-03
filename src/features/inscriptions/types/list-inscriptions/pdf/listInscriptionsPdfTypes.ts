export type ListInscriptionsPdfResponse = {
  pdfBase64: string;
  filename: string;
};

export type ProcessListInscriptionsPdfDownloadOptions = {
  successMessage?: string;
  defaultFilename?: string;
};

export type DownloadListInscriptionsPdfInput = {
  eventId: string;
  isGuest?: boolean;
  details: boolean;
  participants: boolean;
};
