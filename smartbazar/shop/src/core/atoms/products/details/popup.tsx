import Spinner from '@/core/atoms/ui/loaders/spinner/spinner';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import Details from './details';
import ShortDetails from './short-details';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAtom } from 'jotai';
import { AttributesProvider } from './attributes.context';
import { useProduct } from '@/framework/product';

const RelatedProducts = dynamic(() => import('./related-products'));
interface ProductPopupProps {
  productSlug: string;
}
const Popup: React.FC<ProductPopupProps> = ({ productSlug }) => {
  const { t } = useTranslation('common');
  const [showStickyShortDetails] = useAtom(stickyShortDetailsAtom);
  const { product, isLoading } = useProduct({ slug: productSlug });

  const { id, related_products } = product ?? {};

  if (isLoading || !product)
    return (
      <div className="relative flex h-96 w-96 items-center justify-center bg-light">
        <Spinner text={t('common:text-loading')} />
      </div>
    );

  return (
    <AttributesProvider>
      <article className="relative z-[51] w-full max-w-6xl bg-light md:rounded-xl xl:min-w-[1152px]">
        {/* Sticky bar */}
        <ShortDetails product={product} isSticky={showStickyShortDetails} />
        {/* End of sticky bar */}
        <Details product={product} backBtn={false} isModal={true} />

        {related_products?.length! > 1 && (
          <div className="p-5 md:pb-10 lg:p-14 xl:p-16">
            <RelatedProducts
              products={related_products}
              currentProductId={id}
            />
          </div>
        )}
      </article>
    </AttributesProvider>
  );
};

export default Popup;
