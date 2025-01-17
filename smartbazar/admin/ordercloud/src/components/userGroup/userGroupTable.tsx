import React, { useState } from 'react';
import Card from '@components/common/card';
import Search from '@components/common/search';
import { useTranslation } from 'next-i18next';
import { Table } from '@components/ui/table';
import LinkButton from '@components/ui/link-button';
import { ROUTES } from '@utils/routes';

type IProps = {
  userGroups: any[];
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const UserGroupTable = ({ userGroups, onPagination, onSort, onOrder }: IProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  const columns = [
    {
      title: t('table:ID'),
      dataIndex: 'ID',
      key: 'ID',
      align:"left",
      render: (id: string) => <span className="font-semibold">{id}</span>,
    },
    {
      title: t('table:Name'),
      dataIndex: 'Name',
      key: 'Name',
      align: "center",
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: t('table:Description'),
      dataIndex: 'Description',
      key: "Description",
      align:"left",
      render: (description: string) => <span>{description}</span>,
    },
  ];

  return (
    <div>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-xl font-semibold text-heading">{t('UserGroups')}</h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
            <Search onSearch={handleSearch} />
            <LinkButton
              href={`${ROUTES.CREATE_USERGROUPS}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span className="block md:hidden xl:block">
                + {t('Add Usergroup')}
              </span>
              <span className="hidden md:block xl:hidden">
                + {t('form:button-label-add')}
              </span>
            </LinkButton>
          </div>
        </div>
      </Card>

      <Table
        columns={columns}
        data={userGroups}
        rowKey="ID"
        pagination={{
          current: page,
          onChange: (current:any) => {
            setPage(current);
            onPagination(current);
          },
        }}
        emptyText={t('table:empty-table-data')}
      />
    </div>
  );
};

export default UserGroupTable;
