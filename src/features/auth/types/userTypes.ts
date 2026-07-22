export enum RoleType {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  SUPER = 'SUPER',
}

export type AuthUser = {
  id: string;
  username: string;
  role: RoleType;
  email?: string;
  regionId?: string;
  image?: string;
};
