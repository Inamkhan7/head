import Image from 'next/image';
import sortBy from 'lodash/sortBy';
import type { NextPageWithLayout } from '@/types';
import { getLayout } from '@/core/atoms/layouts/layout';
import Link from '@/core/atoms/ui/link';
import ShopCard from '@/core/atoms/ui/cards/shop-mocked';
import { Type } from '@/types';
import { useEffect, useMemo } from 'react';
export { getStaticProps } from '@/framework/shops-page.ssr';
import { ComponentPropsCollection, DictionaryPhrases, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import shops from '../api/shops';
import shop from '../[catalog]/shop';



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


const handlePageOnload = (
  
  dl_pageItem: string | number | undefined,
  
  dl_pageSection: string | number | undefined,

  dl_pageType: string | number | undefined,
  
  dl_memberId: string | number | undefined,

  dl_visitor: string | number | undefined,

) => {

  const eventpageView: DataLayerEvent = {

    event: 'PageView',

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

interface DataLayerClickEvent {
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

const handlePageOnClick = (dlc_clickType: string) => {
  const eventData: DataLayerClickEvent = {
    event: "click",
    loginStatus: "out",
    pageArea: "pub",
    pageItem: "Shops",
    pageSection: "Hub Page",
    pageType: "Shops",
    clickType: dlc_clickType,
    memberId: "XXX",
    visitor: "XXX"
  };
  window.dataLayer.push(eventData);
};



type ShopGroup = {
  groupId: string;
  groupName: string;
  shops: {
    description: string;
    url: string;
    name: string;
    logo: {
      thumbnail: string;
    };
  }[];
};

// const shopGroupsMock = [
//   {
//     groupId: 'bigcommerce',
//     groupName: 'Ametek',
//     shops: [
//       {
//         description: 'Qualified military connectors',
//         url: 'https://manufacturing-smart-bazar.vercel.app',
//         name: 'Ageis',
//         logo: {
//           thumbnail: '/ageis.png',
//         },
//       },
//       {
//         description: 'Expert in glass-to-metal-sealing',
//         url: '/',
//         name: 'Hermetic Seal',
//         logo: {
//           thumbnail: '/hermetic_seal.png',
//         },
//       },
//       {
//         description: 'High reliability hermetic glass',
//         url: '/',
//         name: 'Sealtron',
//         logo: {
//           thumbnail: '/sealtron.png',
//         },
//       },
//     ],
//   },
//   {
//     groupId: 'mock',
//     groupName: 'General motors',
//     shops: [
//       {
//         description: 'Powering the future',
//         url: '/',
//         name: 'Chevrolet',
//         logo: {
//           thumbnail: '/chevrolet.png',
//         },
//       },
//       {
//         description: 'Crafted with emotion',
//         url: '/',
//         name: 'Buick',
//         logo: {
//           thumbnail: '/buick.png',
//         },
//       },
//       {
//         description: 'Your guide to all things',
//         url: '/',
//         name: 'GMC',
//         logo: {
//           thumbnail: '/gmc.png',
//         },
//       },
//     ],
//   },
// ];

const ShopsPage: NextPageWithLayout<{ catalogs: Type[] }> = (props) => {
  console.log(props);
  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/')+1);
    handlePageOnload(
      "Shops","Hub page",filename,"ABC","XYZ"
    );
  },[]);

  // useEffect(() => {
  //   // Check if 'utag' is defined
  //   if (typeof window.utag !== 'undefined') {
  //     window.utag.view({
  //       event_name: 'Page Viewed',
  //       page_name: 'Smart Bazaar',
  //       // Add any additional data you want to send with the event
  //     });
  //   }
  //   console.log("Hey");
  // }, []);


  const shopGrpups = useMemo(() => {
    const groups: ShopGroup[] = [];

    props.catalogs?.forEach((catalog) => {
      let catalogGrpupName = catalog.settings.group || 'Ametek';

      const groupIndex = groups.findIndex(
        (group) => group.groupName === catalogGrpupName
      );
      const shop = {
        description: catalog.banners[0].description,
        url: `${catalog.id}`,
        name: catalog.name,
        logo: {
          thumbnail: catalog.logo
            ? catalog.logo.thumbnail
            : `/${catalog.id}.png`,
        },
      };

      if (groupIndex !== -1) {
        groups[groupIndex].shops.push(shop);
        groups[groupIndex].shops = sortBy(groups[groupIndex].shops, ['name']);
      } else {
        groups.push({
          groupId: catalogGrpupName,
          groupName: catalogGrpupName,
          shops: [shop],
        });
      }
    });

    return sortBy(groups, ['groupName']);
  }, [props.catalogs]);

  return (
    <>
      <div className="min-h-screen bg-light ">
        <div className="mx-auto flex w-full max-w-6xl flex-col p-8 pt-14">
          {shopGrpups.map((group) => (
            <div key={group.groupName}>
              <h3 className="mb-8 text-2xl font-bold text-heading">
                {group.groupName}

                <Link
                  href={`marketplace/${group.groupName}`}
                  className="float-right text-sm font-semibold text-accent hover:text-accent-hover focus:text-blue-500 focus:outline-none"
                >
                  View marketplace
                </Link>
              </h3>
              <div className="grid grid-cols-1 gap-4 pb-14 sm:grid-cols-2 lg:grid-cols-3">
              {group.shops.map((shop) => (
                <div key={shop.name + "_parent"} onClick={() =>
                  handlePageOnClick(
                    shop.name
                  )
                }>
                <ShopCard key={shop.name} {...shop} />
                </div>                 
                ))}
              </div> 
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
        <div className="container mx-auto my-32 max-w-7xl px-12">
          <article className="relative flex flex-row">
            <div className="prose">
              <h2 className="text-6xl">The Acronym</h2>
              <h3 className="mb-8 text-5xl">What is MACH?</h3>
              <div className="text-xl">
                <p>
                  <strong className="font-bold">M</strong>:&nbsp;Individual
                  pieces of business functionality that are independently
                  developed, deployed, and managed.
                </p>

                <p>
                  <strong className="font-bold">A</strong>:&nbsp;All
                  functionality is exposed through an API.
                </p>
                <p>
                  <strong className="font-bold">C</strong>:&nbsp;SaaS that
                  leverages the cloud, beyond storage and hosting, including
                  elastic scaling and&nbsp;automatically&nbsp;updating.&nbsp;
                </p>
                <p>
                  <strong className="font-bold">H</strong>:&nbsp;Front-end
                  presentation is decoupled from back-end logic and channel,
                  programming language, and is framework agnostic.
                </p>
                <p></p>
              </div>
            </div>

            <div className="my-8 bg-black p-12 text-5xl md:ml-auto">
              <div className="mt-9 text-white">
                <p className="mb-6">Micro Services</p>
                <p className="mb-6">API First </p>
                <p className="mb-6"> Cloud Native SaaS</p>
                <p>Headless</p>
              </div>
            </div>
          </article>

          <div className="my-14 w-full" />
        </div>
      </div>
      <div className="flex min-h-screen flex-col bg-white pt-24">
        <div className="container mx-auto my-32 max-w-7xl px-12">
          <article className="relative flex flex-col text-gray-900">
            <h3 className="mb-8 text-5xl font-semibold">MACH Technology</h3>
            <div className="text-xl">
              <p className="mb-8">
                To ensure that enterprises can innovate swiftly and have an
                agile experience roadmap, they must own a modular “swappable”
                architecture. This is the only way to deploy new features
                rapidly and retain control of their destiny.
              </p>
              <p className="mb-8">
                By default, MACH, is not necessarily an all or nothing game. It
                isn’t a suite and allows for modular introduction. Going with a
                headless front-end frees commercial and marketing teams and
                de-risks any future changes to the “back-end”.
              </p>
              <p className="mb-8">
                Below the composable elements that go into a typical commerce
                environment.{' '}
              </p>
              <p className="text-center">
                <Image
                  alt="Mach architecture"
                  src="https://images.contentstack.io/v3/assets/bltb9eff0ec0532965e/blt9ea7e0d21aca1d8d/62e3e19b022e5e700e65b8f6/Architecture.png"
                  width="729"
                  height="546"
                />
              </p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

ShopsPage.getLayout = getLayout;

export default ShopsPage;
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