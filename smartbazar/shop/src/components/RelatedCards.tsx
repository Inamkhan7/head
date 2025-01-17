import { Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';


type CardItem = ComponentProps & {
  displayName: string;
  url: string;
  fields: {
    Abstract: Field<string>;
    BreadcrumbTitle: Field<string>;
    ContentType: Field<string>;
    HideInBreadcrumb: Field<string>;
    Image: Field<string>;
    MetaDescription: Field<string>;
    MetaKeywords: Field<string>;
    MetaTitle: Field<string>;
    PageTitle: Field<string>;
    Title: Field<string>;
  };
};

type RelatedCardsProps = ComponentProps & {
  fields: {
    CardItems: CardItem[];
    HideDescription: Field<boolean>;
    IsCarousel: Field<boolean>;
    Title: Field<string>;
  };
};

const RelatedCards = (props: RelatedCardsProps): JSX.Element => {
  return (
      <div />
  );
};

export default withDatasourceCheck()<RelatedCardsProps>(RelatedCards);
