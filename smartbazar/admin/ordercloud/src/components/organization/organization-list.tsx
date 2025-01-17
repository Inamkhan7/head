import Pagination from '@components/ui/pagination';
import { Table } from '@components/ui/table';
import ActionButtons from '@components/common/action-buttons';
import { UserPaginator, SortOrder } from '@ts-types/generated';
import { useMeQuery } from '@data/user/use-me.query';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@utils/locals';
import { useState } from 'react';
import TitleWithSort from '@components/ui/title-with-sort';
import React from 'react';
import { useRouter } from 'next/router';

type IProps = {
  buyers: UserPaginator | null | undefined;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onBuyerCreate: (current: string) => void;
};
const ActionButton = React.memo(
  ({
    id,
    isActive,
    editUrl,
  }: {
    id: string;
    isActive: boolean;
    editUrl: string;
  }) => {
    const { data } = useMeQuery();
    return (
      <>
        {data?.id != id && (
          <ActionButtons
            id={id}
            userStatus
            editUrl={editUrl}
            isUserActive={isActive}
            showAddWalletPoints={true}
            showMakeAdminButton={true}
          />
        )}
      </>
    );
  }
);

ActionButton.displayName = 'ActionButton';

const OrganizationList = ({ buyers, onPagination, onSort, onBuyerCreate }: IProps) => {
  const { data, paginatorInfo } = buyers!;
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  const router = useRouter();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: any | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });
  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );

      onBuyerCreate(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
    },
    {
      title: t('table:table-item-company'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
    },
    {
      title: t('table:table-item-title'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center',
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (is_active ? 'Active' : 'Inactive'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 80,
      render: (id: string, record: any, { is_active }: any) => (
        <ActionButtons
          id={record?.id}
          editUrl={`${router.asPath}/${id}/edit`}
          isUserActive={is_active}
          item={record}
          deleteModalView="DELETE_USER"
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={data}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrganizationList;
