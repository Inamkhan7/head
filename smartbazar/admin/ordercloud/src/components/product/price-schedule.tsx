import { usePriceScheduleQuery } from "@data/product/price-schedule.query";
import { useEffect, useState } from "react";
import { Table } from '@components/ui/table';
import { useTranslation } from "next-i18next";
import Pagination from "@components/ui/pagination";

const PriceSchedule = () => {
  const [priceScheduleData , setPriceScheduleData] = useState([]);
  const [pagination, setPagination] = useState<any>();
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = usePriceScheduleQuery({ page, pageSize });

  function handlePagination(current: any) {
    setPage(current);
  }
  useEffect(() => {
    if (data) {
      setPriceScheduleData(data.priceSchedule.PriceScheduleData);
      setPagination(data.priceSchedule.paginatorInfo);
    }
  }, [data]);

  const columns = [
    {
      title: "Owner ID",
      dataIndex: "OwnerID",
      key: "OwnerID",
      align: "left",
      width: 150,
      ellipsis: true,
      render: (ownerID: string) => (
        <span className="truncate whitespace-nowrap">{ownerID}</span>
      ),
    },
    {
      title: "Price Schedule ID",
      dataIndex: "ID",
      key: "ID",
      align: "left",
      width: 250,
      ellipsis: true,
      render: (id: string) => (
        <span className="truncate whitespace-nowrap">{id}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      align: "left",
      width: 150,
      ellipsis: true,
      render: (name: string) => (
        <span className="truncate whitespace-nowrap">{name}</span>
      ),
    },
    {
      title: "Apply Tax",
      dataIndex: "ApplyTax",
      key: "ApplyTax",
      align: "center",
      width: 120,
      render: (applyTax: boolean) => (
        <span>{applyTax ? "Yes" : "No"}</span>
      ),
    },
    // {
    //   title: "Apply Shipping",
    //   dataIndex: "ApplyShipping",
    //   key: "ApplyShipping",
    //   align: "center",
    //   width: 120,
    //   render: (applyShipping: boolean) => (
    //     <span>{applyShipping ? "Yes" : "No"}</span>
    //   ),
    // },
    {
      title: "Min Quantity",
      dataIndex: "MinQuantity",
      key: "MinQuantity",
      align: "center",
      width: 100,
      render: (minQuantity: number) => <span>{minQuantity}</span>,
    },
    {
      title: "Max Quantity",
      dataIndex: "MaxQuantity",
      key: "MaxQuantity",
      align: "center",
      width: 110,
      render: (maxQuantity: number | null) => (
        <span>{maxQuantity ?? "No Limit"}</span>
      ),
    },
    {
      title: "Price Breaks",
      dataIndex: "PriceBreaks",
      key: "PriceBreaks",
      align: "left",
      width: 100,
      render: (priceBreaks: any[]) => (
        <div>
          {priceBreaks.map((price, index) => (
            <div key={index} className="mb-2">
              <p>Quantity: {price.Quantity}</p>
              <p>Price: ${price.Price}</p>
              {price.SalePrice && <p>Sale Price: ${price.SalePrice}</p>}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Is On Sale",
      dataIndex: "IsOnSale",
      key: "IsOnSale",
      align: "center",
      width: 100,
      render: (isOnSale: boolean) => (
        <span className={isOnSale ? "text-green-500" : "text-gray-500"}>
          {isOnSale ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error && error instanceof Error) return <div>Error: {error.message}</div>;
  return (
    <>
       {priceScheduleData && (
        <Table
        columns={columns}
        emptyText={'hello'}
        data={priceScheduleData}
        rowKey="ID"
        scroll={{ x: 900 }}
      />
      )} 
        <div className="flex items-center justify-end">
            <Pagination
            total={pagination?.priceSchedulePagination?.TotalPages}
            onShowSizeChange={(current, size) => {
              console.log('Page size changed to:', size);
              setPageSize(size);
            }}
            current={pagination?.priceSchedulePagination?.Page}
            pageSize={pagination?.priceSchedulePagination?.PageSize || 0}
            onChange={handlePagination}
            showLessItems
          />
        </div>
    </>
  );
};

export default PriceSchedule;