import { Swiper, SwiperSlide, Pagination } from '@/core/atoms/ui/slider';
import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import { Banner } from '@/types';

interface BannerProps {
  banners: Banner[] | undefined;
  layout?: string;
  slug?: string;
}

const BannerWithPagination: React.FC<BannerProps> = ({ banners, slug }) => {
  return (
    <div className="compact relative">
      <div className="-z-1 overflow-hidden">
        <div className="relative">
          <Swiper
            id="banner"
            loop={true}
            modules={[Pagination]}
            resizeObserver={true}
            allowTouchMove={false}
            slidesPerView={1}
            // pagination={true}
            pagination={{
              currentClass: 'relative',
              modifierClass:
                '!w-auto swiper-horizontal swiper-pagination-horizontal swiper-pagination cursor-pointer swiper-pagination-bullets !right-20 !justify-end ',
              bulletClass: '!w-9 !h-9 !p-1 !rounded-full bg-gray-200 !border-0',
              bulletActiveClass: '!w-10 !h-10 !bg-gray-500',
              clickableClass: 'cursor-pointer',
              clickable: true,
            }}
          >
            {banners?.map((banner, idx) => (
              <SwiperSlide key={idx}>
                <Link href={`${slug}${ROUTES.SEARCH}`}>
                  <div className="relative h-full max-h-[240px] w-full md:max-h-[790px]">
                    <img className="w-full" src={banner.image?.original}></img>
                    {/* <Image
                      className="w-full"
                      src={banner.image?.original ?? productPlaceholder}
                      alt={banner.title ?? ''}
                      layout="responsive"
                      width={960}
                      height={540}
                    /> */}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default BannerWithPagination;
