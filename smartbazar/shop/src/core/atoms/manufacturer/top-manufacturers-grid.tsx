import NotFound from '@/core/atoms/ui/not-found';
import Carousel from '@/core/atoms/ui/carousel';
import ManufacturerCard from '@/core/atoms/manufacturer/card';
import SectionBlock from '@/core/atoms/ui/section-block';
import { ROUTES } from '@/lib/routes';
import ErrorMessage from '@/core/atoms/ui/error-message';
import { useTopManufacturers } from '@/framework/manufacturer';
import ManufacturerLoader from '@/core/atoms/ui/loaders/manufacturer-loader';
import rangeMap from '@/lib/range-map';

const breakpoints = {
  320: {
    slidesPerView: 1,
  },

  600: {
    slidesPerView: 2,
  },

  960: {
    slidesPerView: 3,
  },

  1280: {
    slidesPerView: 4,
  },

  1600: {
    slidesPerView: 5,
  },
  2600: {
    slidesPerView: 7,
  },
};

const TopManufacturersGrid: React.FC = () => {
  const { manufacturers, isLoading, error } = useTopManufacturers({
    limit: 10,
  });

  if (error) return <ErrorMessage message={error.message} />;

  if (isLoading && manufacturers.length) {
    return (
      <SectionBlock title="text-top-manufacturer" href={ROUTES.MANUFACTURERS}>
        <div className="">
          <div className="grid w-full grid-flow-col gap-6">
            {rangeMap(4, (i) => (
              <ManufacturerLoader key={i} uniqueKey={`manufacturer-${i}`} />
            ))}
          </div>
        </div>
      </SectionBlock>
    );
  }
  return (
    <SectionBlock title="text-top-manufacturer" href={ROUTES.MANUFACTURERS}>
      {!isLoading && !manufacturers.length ? (
        <div className="min-h-full px-9 pt-6 pb-8 lg:p-8">
          <NotFound text="text-no-category" className="h-96" />
        </div>
      ) : (
        <div>
          <Carousel
            items={manufacturers}
            breakpoints={breakpoints}
            spaceBetween={30}
          >
            {(item) => <ManufacturerCard item={item} />}
          </Carousel>
        </div>
      )}
    </SectionBlock>
  );
};

export default TopManufacturersGrid;
