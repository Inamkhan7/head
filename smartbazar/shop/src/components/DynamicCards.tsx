import {
  Text,
  Field,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useExactProducts } from '@/framework/product';
import ProductCard from '@/core/atoms/products/cards/card';
import SectionBlock from '@/core/atoms/ui/section-block';
import { AddToCart } from '@/core/atoms/products/add-to-cart/add-to-cart-multiple';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

const productIds = (isArticles: boolean, buyerId?: string) =>
  buyerId === 'tyson'
    ? [
        {
          catalog: 'sara-lee',
          catalogName: 'Sara lee',
          product: 'classic-pound-cake',
        },
        {
          catalog: 'aidells',
          catalogName: 'Aidells',
          product: 'chicken-apple',
        },
        {
          catalog: 'hillshire-farm',
          catalogName: 'Hillshire farm',
          product: 'carved-oven-roasted-turkey-breast-lunch-meat',
        },
        {
          catalog: 'hillshire-farm',
          catalogName: 'Hillshire farm',
          product: 'thin-sliced-oven-roasted-turkey-breast',
        },
      ]
    : isArticles
    ? [
        {
          catalog: 'joyce-meyer-ministries',
          catalogName: 'Joyce Meyer Ministries',
          product: '5-habits-you-cant-live-without',
        },
        {
          catalog: 'joyce-meyer-ministries',
          catalogName: 'Joyce Meyer Ministries',
          product: 'authentically-uniquely-you',
        },
        {
          catalog: 'joyce-meyer-ministries',
          catalogName: 'Joyce Meyer Ministries',
          product: 'battlefield-of-the-mind-psalms-and-proverbs-amp',
        },
        {
          catalog: 'joyce-meyer-ministries',
          catalogName: 'Joyce Meyer Ministries',
          product: 'an-out-of-control-soul-digital-audio-teaching',
        },
      ]
    : [
        {
          catalog: 'grocery',
          catalogName: 'Grocery',
          product: 'chicken-breast',
        },
        {
          catalog: 'schwartz',
          catalogName: 'Schwartz',
          product: 'moulin-poivre-steak',
        },
        {
          catalog: 'schwartz',
          catalogName: 'Schwartz',
          product: 'baies-roses-entieres',
        },
        {
          catalog: 'hillshire-farm',
          catalogName: 'Hillshire farm',
          product: 'carved-oven-roasted-turkey-breast-lunch-meat',
        },
      ];

type DynamicCardsProps = ComponentProps & {
  fields: {
    ApiEndpoint: Field<string>;
    Title: Field<string>;
    PageSize: Field<string>;
  };
};

const DynamicCards = (props: DynamicCardsProps): JSX.Element => {
  const router = useRouter();

  const selectedProducts = useMemo(
    () =>
      productIds(
        router.pathname.startsWith('/articles'),
        process?.env?.NEXT_PUBLIC_BUYER_ID
      ),
    [router.pathname]
  );

  const { products } = useExactProducts({
    slugs: selectedProducts.map(({ product }) => product),
  });

  return (
    <div className="mt-6">
      <SectionBlock title="Related products">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 gap-y-10 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] xl:gap-8 xl:gap-y-12 2xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] 3xl:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]">
          {products?.map((product, index) => (
            <ProductCard
              productUrlPrefix={`${selectedProducts[index].catalog}/products`}
              product={product}
              key={product.id}
              catalog={selectedProducts[index].catalogName}
            />
          ))}
        </div>
        <div className="mt-6">
          <AddToCart variant="big" data={products || []} disabled={!products} />
        </div>
      </SectionBlock>
    </div>
  );
};

export default withDatasourceCheck()<DynamicCardsProps>(DynamicCards);
