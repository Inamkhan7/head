import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';
import { OrderQueryOptions } from '@/types';

type ApiRequest = NextApiRequest & {
  query: { digital_file_id: string };
};

const handler = async (req: ApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {
      const data = await serverClient.orders.generateDownloadLink(req.query);
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
