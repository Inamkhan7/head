import {
  Field,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useMemo } from 'react';
import { Product } from '@/types';
import BannerWithPagination from '@/core/atoms/banners/banner-with-pagination';

type CardItem = ComponentProps & {
  displayName: string;
  url: string;
  fields: {
    Abstract: Field<string>;
    BreadcrumbTitle: Field<string>;
    ContentType: Field<string>;
    HideInBreadcrumb: Field<string>;
    Image: Field<string>;
    MetaDescription: Field<string>;
    MetaKeywords: Field<string>;
    MetaTitle: Field<string>;
    PageTitle: Field<string>;
    Title: Field<string>;
  };
};

type RelatedCardsProps = ComponentProps & {
  fields: {
    CardItems: CardItem[];
    HideDescription: Field<boolean>;
    IsCarousel: Field<boolean>;
    Title: Field<string>;
  };
};

const mapBanners = (cardItems?: any): Product[] =>
  cardItems?.map(
    (item: {
      url: string;
      displayName: string;
      fields: { Image: { value: { src: string } } };
    }) => ({
      id: item.url,
      image: {
        original: item.fields?.Image?.value?.src,
        thumbnail: item.fields?.Image?.value?.src,
      },
    })
  );

const HeroCarousel = (props: RelatedCardsProps): JSX.Element => {
  const banners = useMemo(
    () => mapBanners(props?.fields?.CardItems),
    [props?.fields?.CardItems]
  );
  return (
    <div className="mx-auto flex w-full flex-col pt-10">
      <section className="px-4 pb-12">
        <header className="text-center">
          <h1 className="font-sans text-xl md:text-2xl xl:text-6xl">
            <Text field={props.fields?.Title} />
          </h1>
        </header>
      </section>
      <BannerWithPagination banners={banners} />
    </div>
  );
};

export default withDatasourceCheck()<RelatedCardsProps>(HeroCarousel);
