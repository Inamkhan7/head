import React from 'react'
import Layout from "@components/layouts/admin";
import { adminOnly } from "@utils/auth-utils";
import Description from "@components/ui/description";
import { useTranslation } from 'next-i18next';
import Card from '@components/common/card';
import { register } from 'react-scroll/modules/mixins/scroller';
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PriceScheduleForm from '@components/priceSchedule/priceScheduleForm';

export default function createPriceSchedule() {
      const { t } = useTranslation();
  return (
    <div>
     <PriceScheduleForm/>
    </div>
  )
}

createPriceSchedule.Layout = Layout;

createPriceSchedule.authenticate = {
  permissions: adminOnly,
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "form", "common"])),
  },
});