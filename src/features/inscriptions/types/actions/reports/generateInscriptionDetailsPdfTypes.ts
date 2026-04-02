export type GenerateInscriptionDetailsPdfResponse = {
  fileBase64: string;
  filename: string;
  contentType: "application/pdf";
};

export type GenerateInscriptionDetailsPdfInput = {
  inscriptionId: string;
};
