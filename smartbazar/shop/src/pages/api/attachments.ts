import type { NextApiRequest, NextApiResponse } from 'next';
import serverClient from '@/framework/server';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST': {
      const data = await serverClient.settings.upload(req.body);
      res.status(200).json(data);
      break;
    }
    default:
      res.send(404);
      break;
  }
};

export default handler;
