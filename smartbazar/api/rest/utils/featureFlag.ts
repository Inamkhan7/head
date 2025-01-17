import { GrowthBook } from '@growthbook/growthbook';
import { HttpService } from '@nestjs/axios';

const growthbook = new GrowthBook();
const axios = new HttpService();

type Flags = {
  [key: string]: boolean;
};

export const getFeatureFlags = (): Promise<Flags> =>
  axios.axiosRef
    .get(
      `https://cdn.growthbook.io/api/features/${process?.env?.GROWTHBOOK_API_KEY}`,
    )
    .then((json) => {
      growthbook.setFeatures(json.data.features);
      return Object.keys(json.data.features).reduce(
        (ffs, ff) => ({
          ...ffs,
          [ff.toUpperCase()]: json.data.features[ff].defaultValue,
        }),
        {},
      );
    })
    .catch((err) => {
      console.error('Failed to fetch feature definitions from GrowthBook', err);
      return null;
    });
