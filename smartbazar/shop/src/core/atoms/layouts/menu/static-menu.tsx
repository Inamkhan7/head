import Link from '@/core/atoms/ui/link';
import { ROUTES } from '@/lib/routes';
import useCartEnabled from '@/lib/use-cart';
import useCatalog from '@/lib/use-catalog';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const headerLinks = [
  { href: ROUTES.MARKETPLACE, icon: null, label: 'nav-menu-marktetplace' },
  { href: ROUTES.SHOPS, icon: null, label: 'nav-menu-shops' },
  // { href: ROUTES.RECIPES, icon: null, label: 'nav-menu-recipe' },
  {
    href: ROUTES.ARTICLES,
    icon: null,
    label: 'nav-menu-articles',
    dynamic: true,
  },
  // { href: ROUTES.OFFERS, icon: null, label: 'nav-menu-offer' },
  { href: ROUTES.CATEGORIES, label: 'nav-menu-categories', dynamic: true },
  { href: ROUTES.HELP, label: 'nav-menu-faq' },
  { href: ROUTES.CONTACT, label: 'nav-menu-contact' },
  { href: ROUTES.CHAT, label: 'Chat', dynamic: true },
];

const getDynamicHref = (
  pathname: string,
  catalog: string,
  savedCatalog: string | undefined,
  asPath: string,
  href: string
) => {
  if (
    [
      ROUTES.MARKETPLACE,
      ROUTES.SHOPS,
      ROUTES.CATEGORIES,
      ROUTES.HELP,
      ROUTES.CONTACT,
      ROUTES.ARTICLES,
      ROUTES.RECIPES,
      ROUTES.CHAT,
    ].includes(pathname)
  ) {
    return `${ROUTES.MARKETPLACE}${href}`;
  }
  if (pathname === `${ROUTES.MARKETPLACE}/[groupName]`) {
    return `${asPath}${href}`;
  }
  if (catalog?.length) {
    return `/${catalog || savedCatalog}${href}`;
  }
  if (href === ROUTES.ARTICLES) {
    return `${asPath}/articles`;
  }
  if (href === ROUTES.CHAT) {
    return `${asPath}/chat`;
  }
  return `${ROUTES.MARKETPLACE}${href}`;
};

const StaticMenu = ({ catalog }: { catalog: string }) => {
  const { t } = useTranslation('common');
  const { savedCatalog } = useCatalog();
  const router = useRouter();
  const { isCartEnabled } = useCartEnabled();

  return (
    <>
      {headerLinks
        .filter((item) =>
          !isCartEnabled && item.href === ROUTES.MARKETPLACE ? false : true
        )
        .map(({ href, label, icon, dynamic }) => (
          <li key={`${href}${label}`}>
            <Link
              href={
                dynamic
                  ? getDynamicHref(
                      router.pathname,
                      catalog,
                      savedCatalog,
                      router.asPath,
                      href
                    )
                  : href
              }
              className={cn(
                `focus:text-accent) flex items-center font-normal text-heading no-underline transition duration-200 hover:text-accent`,
                href === router.pathname ? 'text-accent' : ''
              )}
            >
              {icon && <span className="ltr:mr-2 rtl:ml-2">{icon}</span>}
              {t(
                !isCartEnabled && label === 'nav-menu-shops'
                  ? 'nav-menu-sites'
                  : label
              )}
            </Link>
          </li>
        ))}
    </>
  );
};

export default StaticMenu;
