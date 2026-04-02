export type UpdateInscriptionResponse = {
  id: string;
};

export type UpdateInscriptionParams = {
  id: string;
  responsible?: string;
  phone?: string;
  email?: string;
  observation?: string;
};

export type UpdateInscriptionInput = UpdateInscriptionParams;
