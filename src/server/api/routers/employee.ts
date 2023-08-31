import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const employeeRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.dbActions.getAllFromEmployees();
    }),

    deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
        return ctx.dbActions.deleteEmployeeById(input.id);
    }),

    createByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
        return ctx.dbActions.createEmployee(input.name);
    }),

    getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
        return ctx.dbActions.getEmployeeById(input.id);
    }
    ),
});