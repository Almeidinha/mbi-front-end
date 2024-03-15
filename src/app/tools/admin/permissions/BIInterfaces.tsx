"use client"

import { Card, Tabs } from "antd";
import { BIUserInterfacesPermissions } from "./components/UserPermissions";
import { BIGroupInterfacesPermissions } from "./components/GroupPermissions";

export const BIInterfacesPermissions: React.FC  = () => {
  
  const tabList = [
    {
      label: "User Permissions",
      key: "id-1",
      children: <BIUserInterfacesPermissions/>,
    },
    {
      label: "Group Permissions",
      key: "id-2",
      children: <BIGroupInterfacesPermissions/>,
    }
  ]
  
  return <Card type="inner">
    <Tabs
      defaultActiveKey="1"
      type="card"
      size="small"
      items={tabList}
    />
  </Card>
}