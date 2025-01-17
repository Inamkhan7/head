import Seo from '@/core/atoms/seo/seo';
import { useTranslation } from 'next-i18next';
import ContactForm from '@/core/atoms/settings/contact-form';
import { Image } from '@/core/atoms/ui/image';
import contactIllustration from '@/assets/contact-illustration.svg';
import { getLayout } from '@/core/atoms/layouts/layout';
import { formatAddress } from '@/lib/format-address';
import { getIcon } from '@/lib/get-icon';
import isEmpty from 'lodash/isEmpty';
import * as socialIcons from '@/core/atoms/icons/social';
import { useSettings } from '@/framework/settings';
export { getStaticProps } from '@/framework/general.ssr';
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

export const ContactPage = () => {
  const { t } = useTranslation('common');
  const { settings } = useSettings();

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload(filename, 'Contact Us Form', 'Lead Form', 'HSE', 'AHSTY');
  }, []);

  return (
    <>
      <Seo title={'Contact'} url={'contact'} />
      <div className="w-full bg-gray-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col py-10 px-5 md:flex-row xl:py-14 xl:px-8 2xl:px-14">
          {/* sidebar */}
          <div className="order-2 w-full shrink-0 bg-light p-5 md:order-1 md:w-72 lg:w-96">
            <div className="mb-8 flex w-full items-center justify-center overflow-hidden">
              <Image
                src={contactIllustration}
                alt={t('nav-menu-contact')}
                className="h-auto w-full"
              />
            </div>

            <div className="mb-8 flex flex-col">
              <span className="mb-3 font-semibold text-heading">
                {t('text-address')}
              </span>
              <span className="text-sm text-body">
                {!isEmpty(formatAddress(settings?.contactDetails?.location))
                  ? formatAddress(settings?.contactDetails?.location)
                  : t('common:text-no-address')}
              </span>
            </div>

            <div className="mb-8 flex flex-col">
              <span className="mb-3 font-semibold text-heading">
                {t('text-phone')}
              </span>
              <span className="text-sm text-body">
                {settings?.contactDetails?.contact
                  ? settings?.contactDetails?.contact
                  : t('text-no-contact')}
              </span>
            </div>
            {settings?.contactDetails?.website && (
              <div className="mb-8 flex flex-col">
                <span className="mb-3 font-semibold text-heading">
                  {t('text-website')}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body">
                    {settings?.contactDetails?.website}
                  </span>
                  <a
                    href={settings?.contactDetails?.website ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-accent hover:text-accent-hover focus:text-blue-500 focus:outline-none"
                  >
                    {t('text-visit-site')}
                  </a>
                </div>
              </div>
            )}

            <div className="mb-8 flex flex-col">
              <span className="mb-4 font-semibold text-heading">
                {t('text-follow-us')}
              </span>
              <div className="flex items-center justify-start">
                {settings?.contactDetails?.socials?.map(
                  (item: any, index: number) => (
                    <a
                      key={index}
                      href={item?.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-muted transition-colors duration-300 focus:outline-none ltr:mr-8 ltr:last:mr-0 rtl:ml-8 rtl:last:ml-0 hover:${item.hoverClass}`}
                    >
                      {getIcon({
                        iconList: socialIcons,
                        iconName: item?.icon,
                        className: 'w-4 h-4',
                      })}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="order-1 mb-8 w-full bg-light p-5 md:order-2 md:mb-0 md:p-8 ltr:md:ml-7 rtl:md:mr-7 ltr:lg:ml-9 rtl:lg:mr-9">
            <h1 className="mb-7 font-body text-xl font-bold text-heading md:text-2xl">
              {t('text-questions-comments')}
            </h1>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};
ContactPage.getLayout = getLayout;
export default ContactPage;
