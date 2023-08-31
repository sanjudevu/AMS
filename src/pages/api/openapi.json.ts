import { NextApiRequest, NextApiResponse } from "next";
import { openApiDocument } from "~/server/api/openApiDoc";

const handler = (req: NextApiRequest, res: NextApiResponse) =>{
    res.status(200).send(openApiDocument)
}

export default handler;