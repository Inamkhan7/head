import cn from 'classnames';
import { Swiper, SwiperSlide, Navigation } from '@/core/atoms/ui/slider';
import { Image } from '@/core/atoms/ui/image';
import { Banner } from '@/types';
import { productPlaceholder } from '@/lib/placeholders';
import Link from 'next/link';
import useCartEnabled from '@/lib/use-cart';

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
  userName?: string;
}

interface DataLayerEvent {
  event: string;
  loginStatus: string;
  pageArea: string;
  pageItem: string;
  pageSection: string;
  pageType: string;
  clickType: string;
  memberId: string;
  visitor: string;
}

const handlePageOnClick = () => {
  const eventData: DataLayerEvent = {
    event: 'click',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: 'Home Screen',
    pageSection: 'Homepage',
    pageType: 'Home page',
    clickType: 'Shop Now',
    memberId: 'ABC',
    visitor: 'XYZ',
  };
  window.dataLayer.push(eventData);
};

const BannerWithoutSearch: React.FC<BannerProps> = ({ banners, layout }) => {
  const style = {
    margin: '30px auto',
  };
  const { isCartEnabled } = useCartEnabled();
  
  return (
    <div
      className={cn('relative hidden lg:block', {
        '!block': layout === 'minimal',
      })}
    >
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <Swiper
            id="banner"
            loop={banners && banners.length > 1}
            modules={[Navigation]}
            resizeObserver={true}
            allowTouchMove={false}
            slidesPerView={1}
          >
            {banners?.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div
                  className={cn('relative h-[600px] w-full', {
                    'max-h-140': layout === 'standard',
                    'max-h-[320px] md:max-h-[680px]': layout === 'minimal',
                  })}
                >
                  <Image
                    className="-top-[220px] h-full min-h-140 w-full"
                    src={banner.image?.original ?? productPlaceholder}
                    alt={banner.title ?? ''}
                    layout="fill"
                    objectFit="cover"
                    priority
                  />
                  <div
                    className={cn(
                      'absolute  inset-0 mt-8 flex w-full flex-col items-center justify-center p-5 text-center text-white md:px-20 lg:space-y-10',
                      {
                        'space-y-5 md:!space-y-8': layout === 'minimal',
                      }
                    )}
                  >
                    <h1
                      className={cn(
                        'text-2xl font-bold tracking-tight  lg:text-4xl xl:text-5xl',
                        {
                          '!text-accent': layout === 'minimal',
                        }
                      )}
                    >
                      {/* {userName
                        ? `Hi ${userName}, ${banner?.title}`
                         : 'Made for comfort' } */}
                      {banner?.title}
                    </h1>
                    {banner?.description && (
                      <p className="!mt-2 text-sm lg:text-base xl:text-lg">
                        {banner.description}
                      </p>
                    )}
                    <Link
                      href={(banner?.link?.href as string) || '#'}
                      style={style}
                    >
                      <a
                        onClick={handlePageOnClick}
                        className="focus:ring-accent-800 items-right inline-flex h-10 w-40 shrink-0 items-center justify-center rounded border border-border-400 bg-transparent bg-gray-700 text-right text-sm font-semibold leading-none text-white outline-none transition duration-300 ease-in-out hover:border-accent hover:bg-accent hover:text-light focus:shadow focus:outline-none focus:ring-1 md:text-base"
                      >
                        { !isCartEnabled ? 'Explore Now' : 'Shop Now' }
                      </a>
                    </Link>
                    {/* <Waypoint
                      onLeave={() => setDisplayHeaderSearch(true)}
                      onEnter={() => setDisplayHeaderSearch(false)}
                      onPositionChange={onWaypointPositionChange}
                    /> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BannerWithoutSearch;
