

export type BIInterface = {
  id: number,
  name: string,
  biInterfaceActions: BIInterfaceAction[],
  biUserGroupInterfaces?: BIUserGroupInterface[],
  biAccessRestrictionInterfaces?: BIAccessRestrictionInterface[],
  biUserInterfaces?: BIUserInterface[]
}

export type BIInterfaceAction = {
  id: number,
  interfaceId: number,
  actionWeight: number,
  description: string
}

export type BIUserGroupInterface = {
  userGroupId: number,
  interfaceId: number,
  permissionLevel: number,
}

export type BIAccessRestrictionInterface = {
  userGroupId: number,
  interfaceId: number,
  userId: number,
}

export type BIUserInterface = {
  userId: number,
  interfaceId: number,
  permissionLevel: number,
}