import dayjs from "dayjs";
import { Table } from "@components/ui/table";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Order, OrderStatus } from "@ts-types/generated";
import { useTranslation } from "next-i18next";
import Price from "@components/common/price";

type IProps = {
  orders: Order[];
  title?: string;
};

const RecentQuotes = ({ orders, title }: IProps) => {
  const { t } = useTranslation();

  const rowExpandable = (record: any) => record.children?.length;

  const columns = [
    {
      title: t("table:table-item-quote-number"),
      dataIndex: "tracking_number",
      key: "tracking_number",
      align: "center",
      width: 150,
    },
    {
      title: t("table:table-item-total"),
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (amount: number) => (
        <Price
          component="span"
          className="whitespace-nowrap"
          amount={[amount]}
        />
      ),
    },
    {
      title: t("table:table-item-order-date"),
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t("table:table-item-status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: OrderStatus) => (
        <span
          className="whitespace-nowrap font-semibold"
          style={{ color: status?.color! }}
        >
          {status?.name}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <h3 className="text-heading bg-light border-border-200 border-b px-4 py-3 text-center font-semibold">
          {title}
        </h3>
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t("table:empty-table-data")}
          data={orders}
          rowKey="id"
          scroll={{ x: 200 }}
          expandable={{
            expandedRowRender: () => "",
            rowExpandable,
          }}
        />
      </div>
    </>
  );
};

export default RecentQuotes;
