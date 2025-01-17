import {
  Placeholder,
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { componentFactory } from '@/temp/componentFactory';
import Seo from '@/core/atoms/seo/seo';
import { useEffect } from 'react';
import IsSitecore from './IsSitecore';

const Sitecore = ({ props }: any) => {
  const { route } = props.layoutData.sitecore;
  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh EE chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  return (
    <>
      <IsSitecore>
        <ComponentPropsContext value={props.componentProps}>
          <SitecoreContext
            componentFactory={componentFactory}
            layoutData={props.layoutData}
          >
            <Seo title="Help" url="help" />
            {route && <Placeholder name="jss-main" rendering={route} />}
          </SitecoreContext>
        </ComponentPropsContext>
      </IsSitecore>
    </>
  );
};

export default Sitecore;
