import { type User } from "@prisma/client";
import { type DefaultUser } from "next-auth";


export interface IUser extends DefaultUser, User{}

declare module 'next-auth' {

    type User = IUser
    interface Session {
        user?: IUser
    }
}