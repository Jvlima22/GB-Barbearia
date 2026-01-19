import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import { db } from "./prisma"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
        role: (user as any).role,
      } as any
      return session
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}

// Configuração automática da URL base do NextAuth
if (process.env.NODE_ENV === "development") {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL_LOCAL
} else {
  process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL_PRODUCTION
}
