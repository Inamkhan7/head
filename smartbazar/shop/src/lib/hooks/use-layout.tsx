import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { useTypes } from '@/framework/type';
import { useRouter } from 'next/router';
import useCatalog from '../use-catalog';

const useLayout = () => {
  const { savedCatalog } = useCatalog();
  const data = useTypes({
    limit: TYPES_PER_PAGE,
  });
  const router = useRouter();
  const regex = /^\/$|^\/\?(.*)/;

  const homePage =
    data?.types?.find((type) => type?.id === (savedCatalog as string)) ??
    data?.types?.find((type) => type?.settings?.isHome) ??
    data?.types?.[0];

  if (regex.test(router?.asPath)) {
    return {
      layout: homePage?.settings?.layoutType ?? 'default',
      catalog: homePage?.id ?? '',
      page: homePage,
    };
  }

  const page = data?.types?.find((type) => router.asPath.includes(type.slug));
  return {
    layout: page?.settings?.layoutType ?? 'default',
    catalog: (router.query?.catalog as string)
      ? homePage?.id || ''
      : `marketplace/${data?.types?.[0].settings.group}`,
    page,
  };
};

export default useLayout;
