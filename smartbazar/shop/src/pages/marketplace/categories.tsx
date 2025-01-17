import Seo from '@/core/atoms/seo/seo';
import HomeLayout from '@/core/atoms/layouts/_home';
import CategoryGridHome from '@/core/atoms/categories/grids/home';
import { useTranslation } from 'next-i18next';
import { NextPageWithLayout } from '@/types';
import { InferGetStaticPropsType } from 'next';
import { getStaticProps } from '@/framework/marketplace-categories.ssr';
export { getStaticProps };

const CategoriesPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ variables }) => {
  const { t } = useTranslation();

  return (
    <>
      <Seo noindex={true} nofollow={true} />
      <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <header className="mb-8 text-center">
          <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
            {t('nav-menu-categories')}
          </h1>
        </header>
      </section>
      <CategoryGridHome
        className="px-4 pb-8 lg:p-8"
        variables={variables.categories}
      />
    </>
  );
};

CategoriesPage.getLayout = function getLayout(page) {
  return (
    <HomeLayout layout="classic" catalog="">
      {page}
    </HomeLayout>
  );
};

export default CategoriesPage;
