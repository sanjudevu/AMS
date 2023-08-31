

import type { NextApiRequest, NextApiResponse } from 'next'
import dbActions from '~/server/dbActions';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;


  if (req.method === 'DELETE' && slug !== undefined) {
    const slugString = slug[0];
    if (typeof slugString === 'string') {
      await dbActions.deleteEmployeeById(slugString);
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  } 

  // get by id
  else if (req.method === 'GET' && slug !== undefined) {
    const slugString = slug[0];
    if (typeof slugString === 'string') {
      const data = await dbActions.getEmployeeById(slugString);
      res.status(200).json(data);
    } else {
      res.status(400).end();
    }
  }
  

}