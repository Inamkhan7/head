import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const data = await serverClient.tags.all(req.query);
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
