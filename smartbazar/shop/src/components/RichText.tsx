import React from 'react';
import {
  Field,
  RichText as JssRichText,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from '@/lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

const RichText = (props: RichTextProps): JSX.Element => {
  const text = props.fields ? (
    <JssRichText field={props.fields?.Text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const id = props.params?.RenderingIdentifier;

  return (
    <div
      className={`component rich-text ${props.params?.styles?.trimEnd()}`}
      id={id ? id : undefined}
      tabIndex={1}
    >
      <div className="component-content">{text}</div>
    </div>
  );
};

export default withDatasourceCheck()<RichTextProps>(RichText);
