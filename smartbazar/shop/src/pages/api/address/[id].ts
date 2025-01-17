// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';

type ApiRequest = NextApiRequest & {
  query: {
    id: string;
  };
};
const handler = async (req: ApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE': {
      const data = await serverClient.users.deleteAddress(req.query);
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
