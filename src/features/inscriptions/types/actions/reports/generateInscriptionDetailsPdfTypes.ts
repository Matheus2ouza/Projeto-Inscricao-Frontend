export type ListInscriptionsPdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: "application/pdf";
};

export type ListDownloadInscriptionDetailsPdfInput = {
  inscriptionId: string;
};
