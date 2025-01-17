import {
  Text,
  Field,
  withDatasourceCheck,
  LinkField,
  ImageField,
  RichTextField,
  RichText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';
import BannerWithoutSearch from '@/core/atoms/banners/banner-without-search';
import { useMemo } from 'react';
import { Banner } from '@/types';

type HeroBannerProps = ComponentProps & {
  fields: {
    Description: RichTextField;
    Image: ImageField;
    Title: Field<string>;
    Link: Field<LinkField>;
  };
};

const HeroBanner = (props: HeroBannerProps): JSX.Element => {
  const banner = useMemo(
    () => [
      {
        id: props.rendering.uid as string,
        title: <Text field={props.fields?.Title} />,
        description: <RichText tag="span" field={props.fields?.Description} />,
        image: {
          original: props.fields?.Image?.value,
          thumbnail: props.fields?.Image?.value,
        },
        link: props.fields?.Link?.value,
      },
    ],
    [props]
  );

  return <BannerWithoutSearch banners={banner as unknown as Banner[]} />;
};

export default withDatasourceCheck()<HeroBannerProps>(HeroBanner);
