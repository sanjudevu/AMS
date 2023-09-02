import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
  responseMeta(opts){
    const { paths, errors, type} = opts;
    const allOk = errors.length === 0;

    const isQuery = type === 'query';

    if ( allOk && isQuery) {
      const ONE_DAY_IN_SECONDS = 60*60*24;
      console.log("Received request for TRPC ... caching", paths, isQuery, allOk);
      return {
        headers:{
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
        }
      }
    }
    console.log("Received request for TRPC ", paths, isQuery, allOk);
    return {}
  }
});
