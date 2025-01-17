import Logo from '@components/ui/logo';
import { useUI } from '@contexts/ui.context';
import AuthorizedMenu from './authorized-menu';
import CartIcon from '@components/icons/cart';
import { Menu, Transition } from '@headlessui/react';
import LinkButton from '@components/ui/link-button';
import { NavbarIcon } from '@components/icons/navbar-icon';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { ROUTES } from '@utils/routes';
import {
  adminAndOwnerOnly,
  getAuthCredentials,
  hasAccess,
} from '@utils/auth-utils';
import Button from '@components/ui/button';
import { useCart } from '@contexts/quick-cart/cart.context';

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const { totalUniqueItems, total } = useCart();

  const { permissions } = getAuthCredentials();

  return (
    <header className="fixed z-40 w-full bg-white shadow">
      <nav className="flex items-center justify-between px-5 py-4 md:px-8">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="focus:outline-none flex h-full items-center justify-center p-2 focus:text-accent lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden ms-5 me-auto md:flex">
          <Logo />
        </div>

        <div className="flex items-center space-s-8">
          <LinkButton
            href={ROUTES.CHECKOUT}
            variant="custom"
            className="focus:outline-none inline-flex items-center rounded-full border-0 p-2.5 text-center text-sm font-medium text-accent ring-opacity-0 hover:bg-accent hover:text-white focus:ring-0 focus:ring-offset-0"
          >
            <div className="relative">
              <div className="border-1 absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
                {totalUniqueItems}
              </div>
              <CartIcon className="h-5 w-5" />
            </div>
            <span className="ml-3">${total}</span>
          </LinkButton>
          {/* {hasAccess(adminAndOwnerOnly, permissions) && (
            <LinkButton
              href={ROUTES.CREATE_SHOP}
              className="ms-4 md:ms-6"
              size="small"
            >
              {t("common:text-create-shop")}
            </LinkButton>
          )} */}

          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
