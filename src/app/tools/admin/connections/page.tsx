"use client"

import React from 'react';
import { Card } from "antd"
import Connections from "./Connections"


const ConnectionsPage = () => {

  return <Card title="Manage Database Connections">
    <Connections/>
  </Card>

}

export default ConnectionsPage