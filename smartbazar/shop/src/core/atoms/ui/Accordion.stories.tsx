import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { faq } from '@/framework/static/faq';
import Accordion from './accordion';

export default {
  title: 'Components/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => (
  <Accordion {...args} />
);

export const FAQ = Template.bind({});

FAQ.args = {
  items: faq,
  translatorNS: 'faq',
};
