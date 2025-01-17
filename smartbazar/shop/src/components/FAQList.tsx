import {
  Text,
  Field,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';
import Accordion from '@/core/atoms/ui/accordion-core';
import { useMemo } from 'react';

type FAQList = ComponentProps & {
  id: string;
  fields: {
    Answer: Field<string>;
    Question: Field<string>;
  };
};

type FAQListProps = ComponentProps & {
  fields: {
    FAQList: FAQList[];
    Title: Field<string>;
  };
};

const FAQList = (props: FAQListProps): JSX.Element => {
  const items = useMemo(
    () =>
      props.fields?.FAQList.map((item) => ({
        id: item.id,
        title: <Text field={item.fields?.Question} />,
        content: <Text field={item.fields?.Answer} />,
      })) || [],
    [props.fields?.FAQList]
  );

  return (
    <section className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
      <header className="mb-8 text-center">
        <h1 className="text-xl font-bold md:text-2xl xl:text-3xl">
          <Text field={props.fields?.Title} />
        </h1>
      </header>
      <div className="mx-auto w-full max-w-screen-lg">
        <Accordion items={items} />
      </div>
    </section>
  );
};

export default withDatasourceCheck()<FAQListProps>(FAQList);
