import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { authOptions } from "~/server/auth";
import dbActions from "~/server/dbActions";

export default NextAuth(authOptions);