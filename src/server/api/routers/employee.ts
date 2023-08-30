import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const employeeRouter = createTRPCRouter({
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.employee.findMany();
    }),

    deleteById: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
        return ctx.prisma.employee.delete({
            where: {
                id: input.id
            }
        });
    }),
});