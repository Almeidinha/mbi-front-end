import { randomBytes, randomUUID } from 'crypto';
import { Account, AuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { isDefined, isNil } from './helpers/safe-navigation';
import axios from 'axios';
import { JwtAuthenticationResponse } from './types/responses';

interface TUser extends User {
  authToken?: string | null
}

export const authOptions: AuthOptions = {
    secret: "tJ+PgnZDfZK+m2LhPrSI7eIRgaFs2x7tgqpeeaqToRo=",
    jwt: {
      secret: process.env.NEXT_PUBLIC_JWT_SECRET,
      maxAge: 60 * 60, // 1 hour
    },
    session: {
      strategy: "jwt",
      //maxAge: 24 * 60 * 60, // 24 hours
      maxAge: 60 * 60, // 1 hour
      updateAge: 24 * 60 * 60, // 24 hours
      generateSessionToken: () => {
        return randomUUID() ?? randomBytes(32).toString("hex");
      },
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username (email)", type: "text", placeholder: "Nome" },
          password: { label: "Password", type: "password", placeholder: "Senha" }
        },
        async authorize(credentials, req) {
          
          if(isNil(credentials)) {
            return null  
          }
          
          const authResponse = await autenticateUserFn(credentials.username!, credentials.password!)
          
          // If no error and we have user data, return it
          if (authResponse && authResponse.authToken) {
            const user: TUser = {
              authToken: authResponse.authToken,
              email: authResponse.email,
              name: '',
              id: '0'
            }
            return user
          }
          // Return null if user data could not be retrieved
          return null
        }
      })
    ],
    callbacks: {
      async signIn({ user, account }: { user: TUser, account: Account | null }): Promise<boolean> {        
        return Promise.resolve(true)
      },
      async session({ session, token }) {
        return { ...session,  authToken: token.authToken}
      },
      async jwt({ token, user }: { token: any | null, user: TUser | null }) {
        if(isDefined(user) && isDefined(user.authToken)) {
          token.authToken = user.authToken
        }
        return token
      }
    }
  }

  const autenticateUserFn = async (username: string, password: string) => {
    const response = await axios.post<JwtAuthenticationResponse>(`${process.env.BACKEND_URL}/auth/signin`, {email: username, password})
    return response.data;
  }