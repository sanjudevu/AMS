import { z } from "zod";
import { adminProcedure, createTRPCRouter, staffProcedure } from "~/server/api/trpc";


export const employeeRouter = createTRPCRouter({
    getAll: staffProcedure
        .input(z.void())
        .meta({ openapi: { method: 'GET', path: '/employee', tags: ["employee"], protect: true } })
        .output(z.promise(z.array(z.object({ id: z.string(), name: z.string() }))))
        .query(({ ctx }) => {
            return ctx.dbActions.getAllFromEmployees();
        }),

    deleteById: adminProcedure
        .input(z.object({ id: z.string() }))
        .meta({ openapi: { method: 'DELETE', path: '/employee/{id}', tags: ["employee"],  protect: true } })
        .output(z.promise(z.object({ id: z.string(), name: z.string() })))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.deleteEmployeeById(input.id);
        }),

    createByName: adminProcedure
        .input(z.object({ name: z.string() }))
        .meta({ openapi: { method: 'POST', path: '/employee', tags: ["employee"], protect: true } })
        .output(z.promise(z.object({ id: z.string(), name: z.string() })))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.createEmployee(input.name);
        }),

    getById: staffProcedure
        .input(z.object({ id: z.string() }))
        .meta({ openapi: { method: 'GET', path: '/employee/{id}', tags: ["employee"], protect: true } })
        .output(z.promise(z.union([z.object({ id: z.string(), name: z.string() }), z.null()])))
        .query(({ input, ctx }) => {
            return ctx.dbActions.getEmployeeById(input.id);
        }
        ),

    updateById: adminProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .meta({ openapi: { method: 'PUT', path: '/employee/{id}', tags: ["employee"], protect: true } })
        .output(z.promise(z.object({ id: z.string(), name: z.string() })))
        .mutation(({ input, ctx }) => {
            return ctx.dbActions.updateEmployeeById(input.id, input.name);
        }
        ),
});