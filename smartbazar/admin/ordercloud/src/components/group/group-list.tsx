import { Table } from '@components/ui/table';
import ActionButtons from '@components/common/action-buttons';
import { SortOrder, Type } from '@ts-types/generated';
import { getIcon } from '@utils/get-icon';
import * as typeIcons from '@components/icons/type';
import { ROUTES } from '@utils/routes';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@utils/locals';
import { useState } from 'react';
import Badge from '@components/ui/badge/badge';
import TitleWithSort from '@components/ui/title-with-sort';

export type IProps = {
  types: Type[] | undefined;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const TypeList = ({ types, onSort, onOrder }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      align: 'center',
      width: 60,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-catalog-group')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'group'
          }
          isActive={sortingObj.column === 'group'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'settings',
      key: 'group',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('group'),
      render: (settings: any) => (
        <span className="whitespace-nowrap">{settings?.group}</span>
      ),
    },
    {
      title: t('table:table-item-icon'),
      dataIndex: 'icon',
      key: 'slug',
      align: 'center',
      render: (icon: string) => {
        if (!icon) return null;
        return (
          <span className="flex items-center justify-center">
            {getIcon({
              iconList: typeIcons,
              iconName: icon,
              className: 'w-5 h-5 max-h-full max-w-full',
            })}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      width: 100,
      render: (active: string) => (
        <Badge
          text={active ? 'Active' : 'Disabled'}
          color={active ? 'bg-accent' : 'bg-yellow-400'}
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: alignRight,
      render: (id: string, record: Type) => (
        <ActionButtons
          id={record.id}
          editUrl={`${ROUTES.GROUPS}/${id}/edit`}
          deleteModalView="DELETE_TYPE"
          item={record}
        />
      ),
    },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        //@ts-ignore
        columns={columns}
        emptyText={t('table:empty-table-data')}
        data={types}
        rowKey="id"
        scroll={{ x: 380 }}
      />
    </div>
  );
};

export default TypeList;
