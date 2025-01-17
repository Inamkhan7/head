import { useState } from "react";
import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table, AlignType } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import TitleWithSort from "@components/ui/title-with-sort";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  Attachment,
  ManufacturerPaginator,
  SortOrder,
} from "@ts-types/generated";
import { useUpdateManufacturerMutation } from "@data/manufacturer/use-manufacturer-update.mutation";
import React from "react";

type IProps = {
  manufacturers: ManufacturerPaginator | null | undefined;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const ApprovalAction = React.memo(
  ({ isApproved, record }: { isApproved: boolean; record: any }) => {
    const { mutate: updateManufacturer } = useUpdateManufacturerMutation();
    function handleOnClick() {
      updateManufacturer({
        variables: {
          input: {
            id: record?.id,
            name: record?.name,
            is_approved: !isApproved,
            type_id: record?.type.id,
          },
        },
      });
    }
    return (
      <>
        <Switch
          checked={isApproved}
          onChange={handleOnClick}
          className={`${
            isApproved ? "bg-accent" : "bg-gray-300"
          } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
        >
          <span className="sr-only">Enable</span>
          <span
            className={`${
              isApproved ? "translate-x-6" : "translate-x-1"
            } bg-light inline-block h-4 w-4 transform rounded-full`}
          />
        </Switch>
      </>
    );
  }
);

ApprovalAction.displayName = "ApprovalAction";

const ManufacturerList = ({
  manufacturers,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { data, paginatorInfo } = manufacturers!;
  const { t } = useTranslation();
  const router = useRouter();

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

  let columns = [
    {
      title: t("table:table-item-id"),
      dataIndex: "id",
      key: "id",
      align: "center" as AlignType,
      width: 64,
    },
    {
      title: t("table:table-item-image"),
      dataIndex: "image",
      key: "image",
      width: 74,
      render: (image: Attachment) => (
        <Image
          src={image?.thumbnail ?? siteSettings.product.placeholder}
          alt="coupon banner"
          layout="fixed"
          width={42}
          height={42}
          className="overflow-hidden rounded"
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-title")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "name"
          }
          isActive={sortingObj.column === "name"}
        />
      ),
      dataIndex: "name",
      key: "name",
      align: "center" as AlignType,
      onHeaderCell: () => onHeaderClick("name"),
    },
    {
      title: t("table:table-item-products"),
      dataIndex: "products_count",
      key: "products_count",
      align: "center" as AlignType,
    },
    {
      title: t("table:table-item-approval-action"),
      dataIndex: "is_approved",
      key: "approve",
      align: "center" as AlignType,
      render: (is_approved: boolean, record: any) => (
        <ApprovalAction isApproved={is_approved} record={record} />
      ),
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "id",
      key: "actions",
      align: "center" as AlignType,
      render: (id: string, record: any) => (
        <ActionButtons
          id={id}
          editUrl={`${ROUTES.MANUFACTURERS}/${record.slug}/edit`}
          deleteModalView="DELETE_MANUFACTURER"
        />
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter(
      (col) => col?.key !== "approve" && col?.key !== "actions"
    );
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={t("table:empty-table-data")}
          data={data}
          rowKey="id"
          scroll={{ x: 900 }}
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

export default ManufacturerList;
