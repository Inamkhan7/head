import { CommerceToolsResponse } from './generic';

export type Channel = {
  id: string;
  name: {
    [key: string]: string;
  };
};

export type ChannelsResponse = CommerceToolsResponse<Channel[]>;
