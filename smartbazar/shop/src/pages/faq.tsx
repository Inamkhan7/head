import Accordion from '@/core/atoms/ui/accordion';
import { faq } from '@/framework/static/faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getLayout } from '@/core/atoms/layouts/layout';
import Seo from '@/core/atoms/seo/seo';
import {
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect } from 'react';

export type SitecorePageProps = {
  locale: string;
  layoutData: LayoutServiceData | null;
  dictionary: DictionaryPhrases;
  componentProps: ComponentPropsCollection;
  notFound: boolean;
};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    location: Location;
  }
}

interface DataLayerEvent {
  event: string;
  loginStatus: string;
  pageArea: string | number | undefined;
  pageItem: string | number | undefined;
  pageSection: string | number | undefined;
  pageType: string | number | undefined;
  memberId: string | number | undefined;
  visitor: string | number | undefined;
}

const handlePageOnload = (
  dl_pageItem: string | number | undefined,
  dl_pageSection: string | number | undefined,
  dl_pageType: string | number | undefined,
  dl_memberId: string | number | undefined,
  dl_visitor: string | number | undefined
) => {
  const eventpageView: DataLayerEvent = {
    event: 'pageView',
    loginStatus: 'out',
    pageArea: 'pub',
    pageItem: dl_pageItem,
    pageSection: dl_pageSection,
    pageType: dl_pageType,
    memberId: dl_memberId,
    visitor: dl_visitor,
  };

  window.dataLayer.push(eventpageView);
};

export default function HelpPage() {
  const { t } = useTranslation();

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload('ABC', 'XYZ', filename, 'AHS', 'HSE');
  }, []);

  return (
    <>
      <Seo title="Help" url="help" />
      <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
        <header className="mb-8 text-center">
          <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
            {t('common:nav-menu-faq')}
          </h1>
        </header>
        <div className="mx-auto w-full max-w-screen-lg">
          <Accordion items={faq} translatorNS="faq" />
        </div>
      </section>
    </>
  );
}

HelpPage.getLayout = getLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common', 'faq'])),
    },
  };
};
