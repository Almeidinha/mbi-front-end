import { randomBytes, randomUUID } from 'crypto';
import { Account, AuthOptions, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

interface TUser extends User {
  authToken?: string | null
}

export const authOptions: AuthOptions = {
    secret: "tJ+PgnZDfZK+m2LhPrSI7eIRgaFs2x7tgqpeeaqToRo=",
    jwt: {
      secret: process.env.NEXT_PUBLIC_JWT_SECRET,
      maxAge: 1800
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      updateAge: 24 * 60 * 60, // 24 hours
      generateSessionToken: () => {
        return randomUUID() ?? randomBytes(32).toString("hex");
      },
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "Nome" },
          password: { label: "Password", type: "password", placeholder: "Senha" }
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const res = await fetch("https://jsonplaceholder.typicode.com/users/1")
    
          const user = await res.json()

          // If no error and we have user data, return it
          if (res.ok && user) {
            console.log('returning user...')
            return user
          }
          // Return null if user data could not be retrieved
          return null
        }
      })
    ],
    callbacks: {
      async signIn({ user, account }: { user: TUser, account: Account | null }): Promise<boolean> {
        /*if (isDefined(user) && user.email?.includes('@edvisor.io')) {
          return Promise.resolve(true)
        }
        return Promise.resolve(false)*/
        return Promise.resolve(true)
      },
      async session({ session, token }) {
        return { ...session,  authToken: token.authToken}
      },
      async jwt({ token, account }) {
        /*if (isDefined(account)) {
          const client = getClient();

          const { data } = await client.query({
            query: gql`
              query ($googleTokenId: String!){
                getAuthToken(googleTokenId: $googleTokenId)
              }
            `,
            variables: {
              googleTokenId: account.id_token // account.access_token
            }
          })

          return {...token, authToken: data.getAuthToken}
        }
        return token
        }*/
        return token
      }
    }
  }