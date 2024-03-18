'use client'

import React from 'react'
import { useAppSelector } from '@/app/redux/hooks'
import { toNumber } from 'lodash'
import UserData from './[...id]/User'


const CurrentUserPage = () => {

  const currentUserId = useAppSelector((state) => state.currentUser.user?.id)
  
  console.log('currentUserId', currentUserId)

  return <UserData userId={toNumber(currentUserId)} />
}

export default CurrentUserPage
