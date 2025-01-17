import { IfFeatureEnabled } from '@growthbook/growthbook-react';

const IsSitecore = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <IfFeatureEnabled feature="sitecore">{children}</IfFeatureEnabled>
      <IfFeatureEnabled feature="xmcloud">{children}</IfFeatureEnabled>
    </>
  );
};

export default IsSitecore;
