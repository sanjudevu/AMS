import { NextApiRequest, NextApiResponse } from "next"
import { createOpenApiNextHandler } from "trpc-openapi"
import { appRouter } from "~/server/api/root"
import { createTRPCContext } from "~/server/api/trpc"

const handler = (req: NextApiRequest, res: NextApiResponse) =>{
    console.log('Reached openapi hander')
    return createOpenApiNextHandler({
        router: appRouter,
        createContext: createTRPCContext
    })(req, res)
}

export default handler;