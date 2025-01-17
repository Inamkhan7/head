import { Fragment } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Navbar from "@components/layouts/navigation/top-navbar";
import MobileNavigation from "@components/layouts/navigation/mobile-navigation";
import { siteSettings } from "@settings/site.settings";
import SidebarItem from "@components/layouts/navigation/sidebar-item";

const AdminLayout: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const SidebarItemMap = () => (
    <Fragment>
      {siteSettings.sidebarLinks.admin.map(({ href, label, icon, badge }) => (
        <SidebarItem
          href={href}
          label={t(label)}
          icon={icon}
          key={href}
          badge={badge}
          isActive={pathname === href}
        />
      ))}
    </Fragment>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150">
      <Navbar />
      <MobileNavigation>
        <SidebarItemMap />
      </MobileNavigation>

      <div className="flex flex-1 pt-20">
        <aside className="xl:w-76 fixed bottom-0 hidden h-full w-72 overflow-y-auto bg-white px-4 pt-22 shadow start-0 lg:block">
          <div className="flex flex-col space-y-6 py-3">
            <SidebarItemMap />
          </div>
        </aside>
        <main className="xl:ps-76 w-full lg:ps-72">
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
