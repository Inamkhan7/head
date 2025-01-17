import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { getLayout } from '@/core/atoms/layouts/layout';
import Accordion from '@/core/atoms/ui/accordion';
import { getAllfaqEnabled } from '../provider/contentful/api';
import Seo from '@/core/atoms/seo/seo';
import { useTranslation } from 'next-i18next';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import Sitecore from '@/core/atoms/Sitecore';

const HelpPage = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <IfFeatureEnabled feature="contentful">
        <Seo title="Help" url="help" />
        <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
          <header className="mb-8 text-center">
            <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
              {t('common:nav-menu-faq')}
            </h1>
          </header>
          <div className="mx-auto w-full max-w-screen-lg">
            <Accordion items={props.allFaqs} translatorNS="faq" />
          </div>
        </section>
      </IfFeatureEnabled>
      <Sitecore props={props} />
    </>
  );
};

HelpPage.getLayout = getLayout;
export default HelpPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: ['help'] },
  });
  const allFaqs = (await getAllfaqEnabled()) ?? [];
  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common', 'faq'])),
      allFaqs,
    },
    revalidate: 10,
  };
};
