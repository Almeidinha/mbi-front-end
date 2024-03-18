import { UserGroup } from "./Group";

export type User = {
  id?: number;
  firstName: string;  
  lastName: string;  
  email: string;
  userGroup: UserGroup
}

export interface BIUserDTO {
  id?: number;
  userGroupId: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  defaultPanel: boolean;
  userGroup: BIUserGroupDTO; 
  userInterface: BIUserInterfaceDTO[];
  accessRestrictionInterface: BIAccessRestrictionInterfaceDTO[];
}

export interface BIUserInterfaceDTO {
  userId: number;
  interfaceId: number;
  permissionLevel: number;
  biInterfaceDTO: BIInterfaceDTO;

}

export interface BIUserGroupDTO {
  id: number;
  name: string;
  description: string;
  roleCode: string;
  biUserGroupInterfaceDTOS: BIUserGroupInterfaceDTO[] 
}

export type BIUserIndDTO = {
  userId: number,
  indicatorId: number,
  canChange: boolean,
  favorite: boolean,
}

export type BIUserGroupIndDTO = {
  userGroupId: number,
  indicatorId: number,
  canEdit: boolean,
}

export interface BIUserGroupInterfaceDTO {
  userGroupId: number;
  interfaceId: number;
  permissionLevel: number;
  biInterfaceDTO: BIInterfaceDTO;
}

export interface BIInterfaceDTO {
  id: number;
  name: string;
  biInterfaceActions: BIInterfaceActionDTO[];
}

export interface BIInterfaceActionDTO {
  id: number;
  interfaceIdd: number;
  actionWeight: number;
  description: string;
  biAccessRestrictionInterfaces: BIAccessRestrictionInterfaceDTO[]
}

export interface BIAccessRestrictionInterfaceDTO {
  userGroupId: number;
  interfaceId: number;
  userId: number;
}