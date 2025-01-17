import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { UserPaginator, SortOrder } from "@ts-types/generated";
import { useMeQuery } from "@data/user/use-me.query";
import { useTranslation } from "next-i18next";
import { useIsRTL } from "@utils/locals";
import { useState } from "react";
import TitleWithSort from "@components/ui/title-with-sort";
import React from "react";
import { useRouter } from "next/router";

type IProps = {
  customers: UserPaginator | null | undefined;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
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

ActionButton.displayName = "ActionButton";

const CustomerList = ({ customers, onPagination, onSort, onOrder }: IProps) => {
  const { data, paginatorInfo } = customers!;
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

      onOrder(column);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t("table:table-item-avatar"),
      dataIndex: "profile",
      key: "profile",
      align: "center",
      width: 74,
      render: (profile: any, record: any) => (
        <Image
          src={profile?.avatar?.thumbnail ?? siteSettings.avatar.placeholder}
          alt={record?.name}
          layout="fixed"
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: t("table:table-item-title"),
      dataIndex: "name",
      key: "name",
      align: alignLeft,
    },
    {
      title: t("table:table-item-email"),
      dataIndex: "email",
      key: "email",
      align: alignLeft,
    },
    {
      title: t("table:table-item-permissions"),
      dataIndex: "permissions",
      key: "permissions",
      align: "center",
      render: (permissions: any, record: any) => {
        return (
          <div>
            {permissions?.map(({ name }: { name: string }) => name).join(", ")}
          </div>
        );
      },
    },
    {
      title: t("table:table-item-available_wallet_points"),
      dataIndex: ["wallet", "available_points"],
      key: "available_wallet_points",
      align: "center",
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-status")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "is_active"
          }
          isActive={sortingObj.column === "is_active"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      onHeaderCell: () => onHeaderClick("is_active"),
      render: (is_active: boolean) => (is_active ? "Active" : "Inactive"),
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "id",
      key: "actions",
      align: "center",
      width: 80,
      render: (id: string, record: any, { is_active }: any) => (
        <ActionButtons
          id={record?.id}
          editUrl={`${router.asPath}/${id}/edit`}
          isUserActive={is_active}
          showAddWalletPoints={true}
          showMakeAdminButton={true}
          item={record}
          approveButton={true}
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
          emptyText={t("table:empty-table-data")}
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

export default CustomerList;
