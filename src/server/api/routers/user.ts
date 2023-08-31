import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";


export const userRouter = createTRPCRouter({
    createUser : adminProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string(), type: z.optional(z.string()) }))
        .meta({ openapi: { method: 'POST', path: '/user', tags: ["user"], protect: true} })
        .output(z.promise(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()})))
        .mutation(({ input, ctx }) => {
            const data =  ctx.dbActions.creteUser(input.email, input.name, input.password, input.type ?? "user");
            console.log("creating user");
            console.log(data);
            return data;
        }
    ),

    validateUserWithPassword: adminProcedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .meta({ openapi: { method: 'POST', path: '/user/validate', tags: ["user"], protect: true } })
        .output(z.promise(z.union([z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()}), z.null()])))
        .query(({ input, ctx }) => {
            return ctx.dbActions.validateUserWithPassword(input.email, input.password);
        }
    ),

    getAll: adminProcedure
        .input(z.void())
        .meta({ openapi: { method: 'GET', path: '/user', tags: ["user"], protect: true } })
        .output(z.promise(z.array(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()}))))
        .query(({ ctx }) => {
            return ctx.dbActions.getAllFromUsers();
        }
    ),

    deleteByEmail: adminProcedure
        .input(z.object({ email: z.string() }))
        .meta({ openapi: { method: 'DELETE', path: '/user/{email}', tags: ["user"], protect: true } })
        .output(z.promise(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()})))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.deleteUserByEmail(input.email);
        }
    ),
});