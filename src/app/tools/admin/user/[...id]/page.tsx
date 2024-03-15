"use client"

import React from "react"
import { useParams } from "next/navigation"
import UserData from "./User"
import { getIdFromParameters } from "@/lib/helpers/safe-navigation"
import { toNumber } from "lodash"


const UserPage = () => {
  
  const params = useParams()
  const userId = getIdFromParameters(params, 'id')

  return <UserData userId={toNumber(userId)} />
}

export default UserPage