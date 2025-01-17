import classNames from "classnames";
import Link from "@components/ui/link";
import { getIcon } from "@utils/get-icon";
import * as sidebarIcons from "@components/icons/sidebar";
import { useUI } from "@contexts/ui.context";

const SidebarItem = ({ href, icon, label, badge, isActive }: any) => {
  const { closeSidebar } = useUI();
  return (
    <Link
      href={href}
      className={classNames(
        "flex w-full items-center text-base text-start focus:text-accent",
        { "text-accent": isActive, "text-body-dark": !isActive }
      )}
    >
      {getIcon({
        iconList: sidebarIcons,
        iconName: icon,
        className: "w-5 h-5 me-4",
      })}
      <span onClick={() => closeSidebar()}>{label}</span>
      {badge && (
        <div className="ml-3 rounded bg-gray-400 px-1.5 text-xs font-semibold leading-6 text-light ltr:right-3 rtl:left-3 sm:px-2 md:top-4 md:px-2.5 md:ltr:right-4 md:rtl:left-4">
          {badge}
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
