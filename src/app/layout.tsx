import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { App } from 'antd'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/app-layout'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import StyledComponentsRegistry from '@/lib/rootStyleRegistry'
import './globals.css'
import { isNil } from '@/lib/helpers/safe-navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions);

  if (isNil(session) || isNil(session.authToken) ) {
    redirect("/api/auth/signin")
  }
  

  return (
    <html lang="en">
      <body className={inter.className}>
          <StyledComponentsRegistry>
            <App className="App">
              <AppLayout>
                {children}
              </AppLayout>
            </App>
          </StyledComponentsRegistry>
      </body>
    </html>
  )
}
