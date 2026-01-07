import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    // eslint-disable-line no-unused-vars
    user: {
      id: string
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    // eslint-disable-line no-unused-vars
    role: "USER" | "ADMIN"
  }
}
