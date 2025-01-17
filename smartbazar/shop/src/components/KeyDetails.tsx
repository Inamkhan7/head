import { Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';

type KeyDetailsProps = ComponentProps & {
  fields: {
    Description: Field<string>;
    KeyFeatures: Field<string>;
    Title: Field<string>;
  };
};

const KeyDetails = (props: KeyDetailsProps): JSX.Element => {
  return (
    <div className="flex w-full flex-col px-7 pb-[40px] xl:px-16 xl:pb-[54px] 3xl:pb-[60px]">
      <h4
        dangerouslySetInnerHTML={{
          __html: props.fields?.Description?.value,
        }}
      />
      <div className="flex">
        {decodeURI(props.fields?.KeyFeatures?.value)
          .split('&')
          .map((item) => {
            const [value, description] = item.split('=');
            return (
              <div
                key={item}
                className="flex flex-col border-r p-3 text-center last:border-r-0"
              >
                <div className="text-2xl font-bold">{value}</div>
                <div className="font-medium">{description}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default withDatasourceCheck()<KeyDetailsProps>(KeyDetails);
