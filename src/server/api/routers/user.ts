import { z } from "zod";
import { adminProcedure, createTRPCRouter, staffProcedure } from "../trpc";
import { Prisma, Roles } from "@prisma/client";
import {UserFindManySchema} from "../../../../prisma/zod-schema/schemas/findManyUser.schema";



export const userRouter = createTRPCRouter({
    createUser : adminProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string(), type: z.optional(z.nativeEnum(Roles)) }))
        .meta({ openapi: { method: 'POST', path: '/user', tags: ["user"], protect: true} })
        .output(z.promise(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.nativeEnum(Roles)})))
        .mutation(({ input, ctx }) => {

            const data =  ctx.dbActions.creteUser(input.email, input.name, input.password, input.type ?? Roles.STUDENT);
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

    getAll: staffProcedure
        .input(z.void())
        .meta({ openapi: { method: 'GET', path: '/user', tags: ["user"], protect: true } })
        .output(z.promise(z.array(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()}))))
        .query(({ ctx }) => {
            return ctx.dbActions.getAllFromUsers();
        }
    ),

    getAllWithFilters: staffProcedure
        .input(z.object({
            page: z.optional(z.number()),
            count: z.optional(z.number()),
            sortDescriptor:z.optional(z.object({
                column: z.string(),
                direction: z.enum(["asc","desc"])
            }))
        }))
        .output(z.promise(z.array(z.object({ email: z.string(), name: z.string(), password: z.string() , type: z.string()}))))
        .query(({ ctx, input }) => {
            
            const {page, count, sortDescriptor} = input;
            let sortLogic = undefined;

            if (sortDescriptor?.column && sortDescriptor.direction){
                sortLogic = [Object.assign({}, { [sortDescriptor.column]: sortDescriptor.direction })]
            }

            return ctx.dbActions.getAllFromUsers(undefined, sortLogic
                ,  (count??0)*((page??1)-1), count  );
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