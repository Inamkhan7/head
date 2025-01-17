import { useType } from '@/framework/type';
import { useUser } from '@/framework/user';
import dynamic from 'next/dynamic';
const ErrorMessage = dynamic(() => import('@/core/atoms/ui/error-message'));
const BannerWithSearch = dynamic(
  () => import('@/core/atoms/banners/banner-with-search')
);
const BannerShort = dynamic(() => import('@/core/atoms/banners/banner-short'));
const BannerWithoutSlider = dynamic(
  () => import('@/core/atoms/banners/banner-without-slider')
);
const BannerWithPagination = dynamic(
  () => import('@/core/atoms/banners/banner-with-pagination')
);
const MAP_BANNER_TO_GROUP: Record<string, any> = {
  classic: BannerWithSearch,
  modern: BannerShort,
  minimal: BannerWithoutSlider,
  standard: BannerWithSearch,
  compact: BannerWithPagination,
  default: BannerWithSearch,
};

const Banner: React.FC<{ layout: string; variables: any }> = ({
  layout,
  variables,
}) => {
  const { type, error } = useType(variables.type);
  const { me } = useUser();
  if (error) return <ErrorMessage message={error.message} />;
  const Component = MAP_BANNER_TO_GROUP[layout];
  return (
    <Component
      banners={type?.banners}
      layout={layout}
      slug={type?.slug}
      userName={me?.name}
    />
  );
};

export default Banner;
