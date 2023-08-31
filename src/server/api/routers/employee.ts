import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const employeeRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(z.undefined())
        .meta({ openapi: { method: 'GET', path: '/employee' } })
        .output(z.promise(z.array(z.object({ id: z.string(), name: z.string() }))))
        .query(({ ctx }) => {
            return ctx.dbActions.getAllFromEmployees();
        }),

    deleteById: publicProcedure
        .input(z.object({ id: z.string() }))
        .meta({ openapi: { method: 'DELETE', path: '/employee/{id}' } })
        .output(z.promise(z.object({ id: z.string(), name: z.string() })))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.deleteEmployeeById(input.id);
        }),

    createByName: publicProcedure
        .input(z.object({ name: z.string() }))
        .meta({ openapi: { method: 'POST', path: '/employee' } })
        .output(z.promise(z.object({ id: z.string(), name: z.string() })))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.createEmployee(input.name);
        }),

    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .meta({ openapi: { method: 'GET', path: '/employee/{id}' } })
        .output(z.promise(z.union([z.object({ id: z.string(), name: z.string() }), z.null()])))
        .query(({ input, ctx }) => {
            return ctx.dbActions.getEmployeeById(input.id);
        }
        ),
});