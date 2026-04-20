export type CreatePaymentInscriptiInput = {
  eventId: string;
  accountId?: string;
  guestEmail?: string;
  isGuest?: boolean;
  totalValue: number;
  client: Client;
  inscriptions: Inscription[];
  passCustomerToAsaas?: boolean;
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
