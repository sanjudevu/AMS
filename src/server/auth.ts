import { type NextAuthOptions, getServerSession, type User } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { type GetServerSidePropsContext } from "next/types";
import dbActions from "~/server/dbActions";

export const authOptions: NextAuthOptions = {
    callbacks: {
        session: async (_opts) =>{ 
            const user = await dbActions.getUserByEmail(_opts.session.user?.email ?? "")
            return ({
          ..._opts.session,
            user: {
                id: user?.email,
                ...user
            }
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
            async authorize(credentials) {
                
                const { username, password } = credentials as { username: string, password: string }
                const isValidUser = await dbActions.validateUserWithPassword(username, password);
                if (!isValidUser) {
                    throw new Error("User not found or Invalid credentails")
                }

                const user: User = {
                    id: isValidUser.email ,
                    ...isValidUser
                }
                return user;
            }
        })
    ],
    pages:{
        signIn: "/auth/signin",
        signOut: "/auth/signout"
    }
}

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
  }) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
  };
  