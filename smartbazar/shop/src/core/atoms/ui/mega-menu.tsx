import React from 'react';
import Link from '@/core/atoms/ui/link';
import { useTranslation } from 'next-i18next';

interface MenuItem {
  id: number | string;
  path: string;
  label: string;
  columnItemItems?: MenuItem[];
}
type MegaMenuProps = {
  columns: {
    id: number | string;
    columnItems: MenuItem[];
  }[];
};

const MegaMenu: React.FC<MegaMenuProps> = ({ columns }) => {
  const { t } = useTranslation('menu');
  return (
    <div className="megaMenu shadow-header invisible absolute border border-gray-200 bg-white opacity-0 shadow-md group-hover:visible group-hover:opacity-100 ltr:left-0 rtl:right-0">
      <div className="grid grid-cols-5">
        {columns?.map((column) => (
          <ul
            className="pb-7 pt-6 even:bg-gray-50 2xl:pb-8 2xl:pt-7"
            key={column.id}
          >
            {column?.columnItems?.map((columnItem) => (
              <React.Fragment key={columnItem.id}>
                <li className="mb-1.5">
                  <Link
                    href={columnItem.path}
                    className="block py-1.5 px-5 text-sm font-semibold text-heading transition-colors hover:text-accent xl:px-8 2xl:px-10"
                  >
                    {t(columnItem.label)}
                  </Link>
                </li>
                {columnItem?.columnItemItems?.map((item: any) => (
                  <li
                    key={item.id}
                    className={
                      columnItem?.columnItemItems?.length === item.id
                        ? 'mb-3 border-b border-gray-200 pb-3.5'
                        : ''
                    }
                  >
                    <Link
                      href={item.path}
                      className="block py-1.5 px-5 text-sm text-body transition-colors hover:text-accent xl:px-8 2xl:px-10"
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
