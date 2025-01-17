import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';
import { setToken } from '@/framework/server/http-client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      setToken(req.headers.authorization);
      const data = await serverClient.users.me();
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
