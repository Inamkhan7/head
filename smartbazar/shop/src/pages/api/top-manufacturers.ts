import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';
import { QueryOptions } from '@/types';

type ApiRequest = NextApiRequest & {
  query: Pick<QueryOptions, 'limit'>;
};

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const data = await serverClient.manufacturers.top(req.query);
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
