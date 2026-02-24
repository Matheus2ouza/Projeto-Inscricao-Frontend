export type CreatePaymentLinkInput = {
  inscriptionId: string;
};

export type CreatePaymentLinkParams = {
  inscriptionId: string;
};

export type CreatePaymentLinkResponse = {
  url: string;
  active: boolean;
};
