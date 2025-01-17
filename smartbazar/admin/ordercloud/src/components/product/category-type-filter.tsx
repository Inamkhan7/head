import Select from '@components/ui/select/select';

import React from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@components/ui/label';
import cn from 'classnames';
import { useTypesQuery } from '@data/type/use-types.query';
import { useCategoriesQuery } from '@data/category/use-categories.query';
import { useBuyersQuery } from '@data/buyers/use-buyers.query';

type Props = {
  onCategoryFilter: Function;
  onBuyerFilter: Function;
  onTypeFilter: Function;
  className?: string;
};

export default function CategoryTypeFilter({
  onTypeFilter,
  onCategoryFilter,
  onBuyerFilter,
  className,
}: Props) {
  const { t } = useTranslation();

  const { data: buyersData } = useBuyersQuery();
  const { data, isLoading: loading } = useTypesQuery();
  const { data: categoryData, isLoading: categoryLoading } = useCategoriesQuery(
    {
      limit: 100,
    }
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className
      )}
    >
      <div className="w-full">
        <Label>{t('common:filter-by-group')}</Label>
        <Select
          options={data?.types}
          isLoading={loading}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-group-placeholder')}
          onChange={onTypeFilter}
          defaultValue={data?.types[0]}
        />
      </div>
      <div className="w-full">
        <Label>{t('common:filter-by-customer')}</Label>
        <Select
          options={buyersData?.buyers?.data}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.id}
          placeholder={t('common:filter-by-customer')}
          onChange={onBuyerFilter}
          defaultValue={buyersData?.buyers?.data?.[0]}
        />
      </div>
      <div className="w-full">
        <Label>{t('common:filter-by-category')}</Label>
        <Select
          options={categoryData?.categories?.data}
          getOptionLabel={(option: any) => option.name}
          getOptionValue={(option: any) => option.slug}
          placeholder={t('common:filter-by-category-placeholder')}
          isLoading={categoryLoading}
          onChange={onCategoryFilter}
        />
      </div>
    </div>
  );
}
