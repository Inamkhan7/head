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

const breakpoints = {
  320: {
    slidesPerView: 1,
  },

  600: {
    slidesPerView: 2,
  },

  960: {
    slidesPerView: 2,
  },

  1280: {
    slidesPerView: 2,
  },

  1600: {
    slidesPerView: 2,
  },
  2600: {
    slidesPerView: 2,
  },
};

type FeaturedCarouselProps = ComponentProps & {
  fields: {
    CardItems: CardItem[];
    ButtonText: Field<string>;
    Description: Field<string>;
    Title: Field<string>;
  };
};

const mapFeatureCards = (cardItems?: any): Product[] =>
  cardItems?.map(
    (item: {
      url: string;
      displayName: string;
      fields: { Image: { value: { src: string } } };
    }) => ({
      id: item.url,
      image: {
        original: item.fields?.Image.value?.src,
        thumbnail: item.fields?.Image.value?.src,
      },
    })
  );

const FeaturedCarousel = (props: FeaturedCarouselProps): JSX.Element => {
  const banners = useMemo(
    () => mapFeatureCards(props?.fields?.CardItems),
    [props?.fields?.CardItems]
  );
  return (
    <div className="mx-auto flex w-full flex-col">
      <section className="py-8 px-4">
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

export default withDatasourceCheck()<FeaturedCarouselProps>(FeaturedCarousel);
