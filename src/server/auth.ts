import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { GetServerSidePropsContext } from "next/types";
import dbActions from "~/server/dbActions";

export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) =>{ 
            console.log("Auth")
            console.log(session)
            console.log(user)
            return ({
          ...session,
        })},
      },

    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Sanjay" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                
                const { username, password } = credentials as { username: string, password: string }
                const user = await dbActions.validateUserWithPassword(username, password);
                console.log(user)
                if (!user) {
                    throw new Error("User not found or Invalid credentails")
                }
                return user;
            }
        })
    ],
    pages:{
        signIn: "/auth/signin"
    }
}

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
  }) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
  };
  