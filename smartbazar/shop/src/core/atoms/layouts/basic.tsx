import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import Banner from '@/core/atoms/banners/banner';
import type { HomePageProps } from '@/types';

export default function BasicLayout({ variables, layoutData }: HomePageProps) {
  const { route } = layoutData.sitecore;

  return (
    <>
      <Banner layout="classic" variables={variables.types} />
      <div className="container">
        {route && <Placeholder name="jss-main" rendering={route} />}
      </div>
    </>
  );
}
