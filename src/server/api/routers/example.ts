import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    console.log(ctx.basicAuthSecret);
    return ctx.prisma.example.findMany();
  }),

  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      console.log(ctx.basicAuthSecret);
      return ctx.prisma.example.create({
        data: {
          name: input.name,
        },
      });
    }
  ),
});
