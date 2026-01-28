export type CreatePaymentInscriptiInput = {
  eventId: string;
  totalValue: number;
  client: Client;
  inscriptions: Inscription[];
  accountId?: string;
};

type Client = {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  address: string;
  addressNumber: string;
  complement?: string;
  postalCode: string;
  province: string;
  city: string;
};

export type Inscription = {
  id: string;
};

export type CreatePaymenInscriptionResponse = {
  id: string;
  link: string;
  status: string;
};
