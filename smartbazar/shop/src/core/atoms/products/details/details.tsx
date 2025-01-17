import BackButton from '@/core/atoms/ui/back-button';
import { AddToCart } from '@/core/atoms/products/add-to-cart/add-to-cart';
import usePrice from '@/lib/use-price';
import { ThumbsCarousel } from '@/core/atoms/ui/thumb-carousel';
import { useTranslation } from 'next-i18next';
import { getVariations } from '@/lib/get-variations';
import { useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Truncate from '@/core/atoms/ui/truncate';
import { scroller, Element } from 'react-scroll';
import CategoryBadges from './category-badges';
import VariationPrice from './variation-price';
import { useRouter } from 'next/router';
import { ROUTES } from '@/lib/routes';
import type { Product } from '@/types';
import { PriceSchedule } from 'ordercloud-javascript-sdk';
import { useAtom } from 'jotai';
import VariationGroups from './variation-groups';
import { isVariationSelected } from '@/lib/is-variation-selected';
import { useModalAction } from '@/core/atoms/ui/modal/modal.context';
import { Waypoint } from 'react-waypoint';
import { stickyShortDetailsAtom } from '@/store/sticky-short-details-atom';
import { useAttributes } from './attributes.context';
import classNames from 'classnames';
import { displayImage } from '@/lib/display-product-preview-images';
import useCartEnabled from '@/lib/use-cart';
import { ProfilePageJsonLd } from 'next-seo';

type Props = {
  product: Product;
  backBtn?: boolean;
  isModal?: boolean;
  priceSchedule?: PriceSchedule;
};
const Details: React.FC<Props> = ({
  product,
  priceSchedule,
  backBtn = true,
  isModal = false,
}) => {
  const {
    name,
    image, //could only had image we need to think it also
    description,
    unit,
    categories,
    gallery,
    type,
    quantity,
    shop,
    slug,
  } = product ?? {};

  const { PriceBreaks } = priceSchedule ?? {};

  const { t } = useTranslation('common');
  const [_, setShowStickyShortDetails] = useAtom(stickyShortDetailsAtom);

  const router = useRouter();
  const { closeModal } = useModalAction();

  const { attributes } = useAttributes();
  const { isCartEnabled } = useCartEnabled();

  const { price, basePrice, discount } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const navigate = (path: string) => {
    router.push(path);
    closeModal();
  };

  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations]
  );
  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const scrollDetails = () => {
    scroller.scrollTo('details', {
      smooth: true,
      offset: -80,
    });
  };

  const onWaypointPositionChange = ({
    currentPosition,
  }: Waypoint.CallbackArgs) => {
    if (!currentPosition || currentPosition === 'above') {
      setShowStickyShortDetails(true);
    }
  };
  const hasVariations = !isEmpty(variations);
  const previewImages = displayImage(selectedVariation?.image, gallery, image);

  return (
    <article className="rounded-lg bg-light">
      <div className="flex flex-col border-b border-border-200 border-opacity-70 md:flex-row">
        <div className="p-6 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <div className="mb-8 flex items-center justify-between lg:mb-10">
            {backBtn && <BackButton />}
            {discount && (
              <div className="rounded-full bg-yellow-500 px-3 text-xs font-semibold leading-6 text-light ltr:ml-auto rtl:mr-auto">
                {discount}
              </div>
            )}
          </div>

          <div className="product-gallery h-full">
            <ThumbsCarousel
              gallery={previewImages}
              hideThumbs={previewImages.length <= 1}
            />
          </div>
        </div>

        <div className="flex flex-col items-start p-5 pt-10 md:w-1/2 lg:p-14 xl:p-16">
          <Waypoint
            onLeave={() => setShowStickyShortDetails(true)}
            onEnter={() => setShowStickyShortDetails(false)}
            onPositionChange={onWaypointPositionChange}
          >
            <div className="w-full">
              <h1
                className={classNames(
                  `text-lg font-semibold tracking-tight text-heading md:text-xl xl:text-2xl`,
                  {
                    'cursor-pointer transition-colors hover:text-accent':
                      isModal,
                  }
                )}
                {...(isModal && {
                  onClick: () => navigate(`${ROUTES.PRODUCT}/${slug}`),
                })}
              >
                {name}
              </h1>

              {unit && !hasVariations && (
                <span className="mt-2 block text-sm font-normal text-body md:mt-3">
                  {unit}
                </span>
              )}

              {description && (
                <div className="mt-3 text-sm leading-7 text-body md:mt-4">
                  <Truncate
                    character={150}
                    {...(!isModal && {
                      onClick: () => scrollDetails(),
                      compressText: 'common:text-see-more',
                    })}
                  >
                    {description}
                  </Truncate>
                </div>
              )}

              {hasVariations ? (
                <>
                  <div className="my-5 flex items-center md:my-10">
                    <VariationPrice
                      selectedVariation={selectedVariation}
                      minPrice={product.min_price}
                      maxPrice={product.max_price}
                    />
                  </div>
                  <div>
                    <VariationGroups variations={variations} />
                  </div>
                </>
              ) : (
                <span className="my-5 flex items-center md:my-10">
                  <ins className="text-2xl font-semibold text-accent no-underline md:text-3xl">
                    {price}
                  </ins>
                  {basePrice && (
                    <del className="text-sm font-normal text-muted ltr:ml-2 rtl:mr-2 md:text-base">
                      {basePrice}
                    </del>
                  )}
                </span>
              )}

              {isCartEnabled && (
                <div className="mt-4 flex flex-col items-center md:mt-6 lg:flex-row">
                  <div className="mb-3 w-full lg:mb-0 lg:max-w-[400px]">
                    <AddToCart
                      data={product}
                      variant="big"
                      variation={selectedVariation}
                      disabled={selectedVariation?.is_disable || !isSelected}
                    />
                  </div>

                  {!hasVariations && (
                    <>
                      {Number(quantity) > 0 ? (
                        <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                          {quantity} {t('text-pieces-available')}
                        </span>
                      ) : (
                        <div className="whitespace-nowrap text-base text-red-500 ltr:lg:ml-7 rtl:lg:mr-7">
                          {t('text-out-stock')}
                        </div>
                      )}
                    </>
                  )}
                  {!isEmpty(selectedVariation) && (
                    <span className="whitespace-nowrap text-base text-body ltr:lg:ml-7 rtl:lg:mr-7">
                      {selectedVariation?.is_disable ||
                      selectedVariation.quantity === 0
                        ? t('text-out-stock')
                        : `${selectedVariation.quantity} ${t(
                            'text-pieces-available'
                          )}`}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-8 flex">



              <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 bg-accent">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-white">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-white">
                                Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {PriceBreaks?.map((item, index: number) => {
                  return (
                    
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                            
                            <td className="px-6 py-4">
                                {item.Quantity}
                            </td>
                            <td className="px-6 py-4">
                              {index === 0 ? item.Price : item.SalePrice }
                            </td>
                        </tr>
                  )
                  
                })}
                        
                    </tbody>
                </table>
</div>






                
              </div>
            </div>
          </Waypoint>

          {!!categories?.length && (
            <CategoryBadges
              categories={categories}
              basePath={`/${type?.slug}`}
              onClose={closeModal}
            />
          )}

          {shop?.name && (
            <div className="mt-2 flex items-center">
              <span className="py-1 text-sm font-semibold capitalize text-heading ltr:mr-6 rtl:ml-6">
                {t('common:text-sellers')}
              </span>

              <button
                onClick={() =>
                  navigate(`${ROUTES.SHOPS}/${encodeURIComponent(shop?.slug)}`)
                }
                className="text-sm tracking-wider text-accent underline transition hover:text-accent-hover hover:no-underline"
              >
                {shop?.name}
              </button>
            </div>
          )}
        </div>
      </div>

      <Element
        name="details"
        className="border-b border-border-200 border-opacity-70 px-5 py-4 lg:px-16 lg:py-14"
      >
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-heading md:mb-6">
          {t('text-details')}
        </h2>
        <div
          className="text-sm text-body"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </Element>
    </article>
  );
};

export default Details;
