/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { type User } from "@prisma/client";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { type OpenApiMeta } from "trpc-openapi";
import { ZodError, any } from "zod";

import { prisma } from "~/server/db";
import dbActions from "~/server/dbActions";
import { getServerAuthSession } from "../auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

// type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */



const createInnerTRPCContext = async (_opts: CreateNextContextOptions) => {



  let user: User|null = null;

  const { req, res } = _opts;
  const session = await getServerAuthSession({ req, res });


  try {

    const auth = _opts.req.headers.authorization! ;

    let username = null;
    let password = null;

    const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');

    [username, password] = decode(auth.split(" ")[1] ?? "").split(':');

    

    console.log(`username: ${username}, password: ${password} auth: ${auth}`);

    // check if username or password is undefined or empty
    if (!username || !password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Username or password is empty",
      });
    }

    user =  await dbActions.validateUserWithPassword(username, password);

  } catch (error) {}

  if (!user && session?.user) {
    const sessionUser = session.user.email ?? "";
    user = await dbActions.getUserByEmail(sessionUser);
  }

  return {
    prisma,
    dbActions,
    user
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext(_opts);
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC.context<typeof createTRPCContext>().meta<OpenApiMeta>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

export const useAuth = t.middleware(({ctx, next}) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }
  return next({ctx});
});

// role based access
export const useRole = (roles: string[]) => (t.middleware(({ctx, next}) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  if (!roles.includes(ctx.user.type)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Permission denied",
    });
  }

  return next({ctx});
}));



/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */

// eslint-disable-next-line react-hooks/rules-of-hooks
const ADMIN_ROLE = useRole(["ADMIN"]);
// eslint-disable-next-line react-hooks/rules-of-hooks
const STAFF_ROLE = useRole(["ADMIN", "STAFF"]);

export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(useAuth);
export const adminProcedure = t.procedure.use(useAuth).use(ADMIN_ROLE)
export const staffProcedure = t.procedure.use(useAuth).use(STAFF_ROLE);


