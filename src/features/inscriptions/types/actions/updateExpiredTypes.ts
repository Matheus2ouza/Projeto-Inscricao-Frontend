export type UpdateExpiredResponse = {
  id: string;
  expiresAt: Date;
};

export type UpdateExpiredInput = {
  inscriptionId: string;
  expiresAt: Date;
};

export type UpdateExpiredParams = {
  inscriptionId: string;
  expiresAt: Date;
};
