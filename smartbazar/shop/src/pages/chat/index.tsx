import {
  ComponentPropsContext,
  Placeholder,
  SitecoreContext,
  handleEditorFastRefresh,
  ComponentPropsCollection,
  DictionaryPhrases,
  LayoutServiceData,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { scroller } from 'react-scroll';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '@/types';
import { sitecorePagePropsFactory } from '@/lib/page-props-factory';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { componentFactory } from '@/temp/componentFactory';
// import ChatAi from '../chat-box/chatai';
import Footer from '@/core/atoms/layouts/footer';
import { CHECKOUT } from '@/lib/constants';
import ChatBox from '../chat-box/chatbox';

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


const ChatLayout = dynamic(() => import('@/core/atoms/layouts/_home'));

type ChatpageProps = InferGetStaticPropsType<typeof getStaticProps> &
  SitecorePageProps;

const Chatpage: NextPageWithLayout<ChatpageProps> = ({
  componentProps,
  layoutData,
}) => {
  const { query } = useRouter();
  const { route } = layoutData.sitecore;

  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh EE chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  useEffect(() => {
    if (query.text || query.category) {
      scroller.scrollTo('grid', {
        smooth: true,
        offset: -80,
      });
    }
  }, [query.text, query.category]);

  useEffect(() => {
    let url = window.location.pathname;
    let filename = url.substring(url.lastIndexOf('/') + 1);
    handlePageOnload('Chat Screen', 'Chatpage', filename, 'ABC', 'XYZ');
  }, []);

  return (
    
      <div className='flex justify-center items-center bg-white w-full'>
    
     <ChatBox/>
     
     </div>
        
      
      
    
  );
};

Chatpage.getLayout = function getLayout(page) {
  return (
    <ChatLayout layout="basic" catalog="">
  
      {page}
    
     
     </ChatLayout> 
  );
};

export default Chatpage;

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create({
    ...context,
    params: { pages: ['/'] },
  });
  return {
    props: {
      ...props,
      ...(await serverSideTranslations(context.locale!, ['common'])),
    },
    revalidate: 10,
  };
};
