import { getLayout } from '@/core/atoms/layouts/layout';
import { AttributesProvider } from '@/core/atoms/products/details/attributes.context';
import Seo from '@/core/atoms/seo/seo';
import { useWindowSize } from '@/lib/use-window-size';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

export { getStaticPaths, getStaticProps } from '@/framework/product.ssr';
//FIXME: typescript and layout
const Details = dynamic(() => import('@/core/atoms/products/details/details'));
const BookDetails = dynamic(
  () => import('@/core/atoms/products/details/book-details')
);
const RelatedProducts = dynamic(
  () => import('@/core/atoms/products/details/related-products')
);
// const CartCounterButton = dynamic(
//   () => import('@/core/atoms/cart/cart-counter-button'),
//   { ssr: false }
// );

export default function ProductPage({ product, priceSchedule, variables }: any) {
  // const { width } = useWindowSize();

  return (
    <>
      <Seo
        title={product?.name}
        url={product?.slug!}
        images={!isEmpty(product?.image) ? [product.image] : []}
      />
      <AttributesProvider>
        <div className="min-h-screen bg-light">
          {product?.type?.slug === 'books' ? (
            <BookDetails product={product} />
          ) : (
            <>
              <Details product={product} priceSchedule={priceSchedule} />
              {product?.related_products?.length > 1 && (
                <div className="p-5 lg:p-14 xl:p-16">
                  <RelatedProducts
                    products={product?.related_products}
                    currentProductId={product?.id}
                    gridClassName="lg:grid-cols-4 2xl:grid-cols-5 !gap-3"
                  />
                </div>
              )}
            </>
          )}
        </div>
        {/* {width > 1023 && <CartCounterButton />} */}
      </AttributesProvider>
    </>
  );
}
ProductPage.getLayout = getLayout;
