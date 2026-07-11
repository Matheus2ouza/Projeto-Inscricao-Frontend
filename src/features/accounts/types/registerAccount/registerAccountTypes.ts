export type RegisterServiceInput = {
  username: string;
  password: string;
  role: string;
  region?: string | null;
};

export type RegisterServiceResponse = {
  id: string;
};
