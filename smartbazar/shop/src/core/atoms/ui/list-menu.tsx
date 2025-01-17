import { ArrowNextIcon } from '@/core/atoms/icons/arrow-next';
import { useTranslation } from 'next-i18next';

import Link from './link';

const ListMenu = ({ dept, data, hasSubMenu, menuIndex }: any) => {
  const { t } = useTranslation('menu');
  return (
    <li className="relative">
      <Link
        href={data.path}
        className="flex items-center justify-between py-2 transition-colors hover:text-accent ltr:pl-5 ltr:pr-3 rtl:pr-5 rtl:pl-3 ltr:xl:pl-7 ltr:xl:pr-3.5 rtl:xl:pr-7 rtl:xl:pl-3.5"
      >
        {t(data.label)}
        {data.subMenu && (
          <span className="mt-0.5 shrink-0 text-sm">
            <ArrowNextIcon className="w-3.5 ltr:ml-1.5 rtl:mr-1.5" />
          </span>
        )}
      </Link>
      {hasSubMenu && (
        <SubMenu dept={dept} data={data.subMenu} menuIndex={menuIndex} />
      )}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  return (
    <ul className="subMenuChild invisible absolute top-4 z-0 w-56 border border-gray-200 bg-white py-3 opacity-0 shadow-md ltr:right-full rtl:left-full ltr:2xl:right-auto ltr:2xl:left-full rtl:2xl:left-auto rtl:2xl:right-full">
      {data?.map((menu: any, index: number) => {
        const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.subMenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
