import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    // eslint-disable-next-line no-unused-vars
    interface Session extends DefaultSession {
      user: User;
      authToken: string;
      error?: string
    }

    // eslint-disable-next-line no-unused-vars
    interface JWT extends Record<string, unknown>, DefaultJWT {
      authToken?: string;
    }
  }

  export type User = {
    authToken: string;
    name: string;
    email: string;
    image: string;
  };
