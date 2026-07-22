export enum RoleType {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER = 'SUPER',
}

export type CreateAccountInput = {
  username: string;
  password: string;
  role: RoleType;
  regionId?: string;
  localityIds: string[];
};

export type CreateAccountResponse = {
  id: string;
};
