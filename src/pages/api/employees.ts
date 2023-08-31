import type { NextApiRequest, NextApiResponse } from 'next'
import dbActions from '~/server/dbActions'
 
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if (req.method === 'GET') {
        const data = await dbActions.getAllFromEmployees();
        res.status(200).json(data)
    } 

    if (req.method === 'POST') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name } = req.body;
        if (typeof name === 'string') {
          const employee = await dbActions.createEmployee(name);
          res.status(201).json(employee);
        } else {
          res.status(400).end();
        }
      }
    
}



