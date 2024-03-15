
export type UserGroup = {
  id?: number;
  name: string;
  description: string;
  roleCode: RoleCode; 
}

export enum RoleCode {
  ADMIN = 'ADMIN',
  USER = 'USER'
}