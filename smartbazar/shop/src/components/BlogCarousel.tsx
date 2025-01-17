import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  Text,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useMemo, useState } from 'react';
import { Product } from '@/types';
import { ArrowPrevIcon } from '@/core/atoms/icons/arrow-prev';
import { ArrowNextIcon } from '@/core/atoms/icons/arrow-next';
import SimpleCard from '@/core/atoms/ui/simple-card';
import Carousel from '@/core/atoms/ui/carousel';
import Button from '@/core/atoms/ui/button';

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

const mapFeatureCards = (cardItems?: any): Product[] =>
  cardItems?.map(
    (item: {
      url: string;
      displayName: string;
      fields: {
        Image: { value: { src: string; width: string; height: string } };
      };
    }) => ({
      id: item.url,
      description: item.displayName,
      image: {
        original: item.fields?.Image.value?.src,
        thumbnail: item.fields?.Image.value?.src,
        width: parseFloat(item.fields?.Image?.value?.width),
        height: parseFloat(item.fields?.Image?.value?.height),
      },
    })
  );
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
};
const BlogCarousel = (props: RelatedCardsProps): JSX.Element => {
  const products = useMemo(
    () => mapFeatureCards(props?.fields?.CardItems),
    [props?.fields?.CardItems]
  );

  let [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  let [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl p-8 pb-10 pt-24">
      <div className="block">
        <div className="float-left block w-1/3">
          <div className="flex-col">
            <div className="flex-1 py-5">
              <h1 className="text py-5 pb-6 font-serif text-5xl text-heading">
                Get Inspired
              </h1>
              <p className="py-2 text-sm">
                Stay informed with our latest articles. Explore a diverse range
                of topics. Discover fresh insights and stay up-to-date with our
                expertly curated content.
              </p>
            </div>
            <div className="flex-1 flex-row py-10 pt-24">
              <div className="pagination-container flex pt-10">
                <div className="flex-1">
                  <Button
                    className="text font-arial rounded-none border-gray-600 bg-white py-2 text-xl font-normal"
                    variant="outline"
                  >
                    Explore more
                  </Button>
                </div>
                <div className="relative -right-20 top-2 flex-1 text-center">
                  <div
                    ref={(node) => setPrevEl(node)}
                    className="relative right-5 float-left block"
                  >
                    <ArrowPrevIcon className="customNavPrev cursor-pointer" />
                  </div>
                  <div
                    ref={(node) => setNextEl(node)}
                    className="relative float-left block"
                  >
                    <ArrowNextIcon className="customNavNext cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float-left block w-2/3">
          <Carousel
            items={products}
            breakpoints={breakpoints}
            spaceBetween={30}
            allowSlideNext={true}
            loop={true}
            isCustomNav={true}
            prevNav={prevEl}
            nextNav={nextEl}
          >
            {(item) => <SimpleCard item={item} />}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default withDatasourceCheck()<RelatedCardsProps>(BlogCarousel);
